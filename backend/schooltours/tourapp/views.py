import logging
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, Student, Tour, Booking, Payment
from .serializers import (
    MyTokenObtainPairSerializer, UserSerializer, StudentSerializer,
    TourSerializer, BookingSerializer, PaymentSerializer
)

logger = logging.getLogger(__name__)


class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# Registration endpoint: usually public (AllowAny), remove IsAuthenticated
@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def register_user(request):
    try:
        data = request.data
        required = ['first_name', 'last_name', 'phone', 'username', 'password', 'role']
        for field in required:
            if field not in data or not data[field]:
                return Response({'message': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=data['username']).exists():
            return Response({'message': 'Username already exists'}, status=status.HTTP_409_CONFLICT)

        User.objects.create(
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data['phone'],
            username=data['username'],
            password=make_password(data['password']),
            role=data['role']
        )

        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Custom permission decorator to restrict update/delete to staff users
def staff_only_update_delete(view_func):
    def _wrapped_view(request, *args, **kwargs):
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            if not (request.user and request.user.is_authenticated and request.user.role == 'staff'):
                return Response({'error': 'Permission denied: staff only'}, status=status.HTTP_403_FORBIDDEN)
        return view_func(request, *args, **kwargs)
    return _wrapped_view


def generic_api(model_class, serializer_class):
    @api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
    @permission_classes([IsAuthenticated])
    @staff_only_update_delete
    def api_handler(request, pk=None):
        logger.debug(f"Request method: {request.method}, Data: {request.data}")

        if request.method == 'GET':
            if pk:
                try:
                    instance = model_class.objects.get(pk=pk)
                    serializer = serializer_class(instance)
                    return Response(serializer.data)
                except model_class.DoesNotExist:
                    return Response({'error': 'The object not found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                instances = model_class.objects.all()
                serializer = serializer_class(instances, many=True)
                return Response(serializer.data)

        elif request.method == 'POST':
            serializer = serializer_class(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method in ['PUT', 'PATCH']:
            if not pk:
                return Response({'error': 'ID is required to update data'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                instance = model_class.objects.get(pk=pk)
                serializer = serializer_class(instance, data=request.data, partial=(request.method=='PATCH'))
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except model_class.DoesNotExist:
                return Response({'error': 'The object not found'}, status=status.HTTP_404_NOT_FOUND)

        elif request.method == 'DELETE':
            if not pk:
                return Response({'error': 'ID is required to delete data'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                instance = model_class.objects.get(pk=pk)
                instance.delete()
                return Response({'message': 'Deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
            except model_class.DoesNotExist:
                return Response({'error': 'The object not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    return api_handler


# Instantiate generic APIs with permission handling
manage_user = generic_api(User, UserSerializer)
manage_student = generic_api(Student, StudentSerializer)
manage_tour = generic_api(Tour, TourSerializer)
manage_payment = generic_api(Payment, PaymentSerializer)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def manage_booking(request):
    if request.method == 'POST':
        serializer = BookingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        if request.user.role == 'staff':
            bookings = Booking.objects.all()
        else:
            bookings = Booking.objects.filter(parent=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def manage_booking_detail(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check permission: parents only see their own bookings
    if request.user.role == 'parent' and booking.parent != request.user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = BookingSerializer(booking)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        if request.user.role == 'parent':
            # Allow parent to update only student field
            allowed_fields = ['student']
            data = {field: request.data.get(field) for field in allowed_fields if field in request.data}
            serializer = BookingSerializer(booking, data=data, partial=True)

        elif request.user.role == 'staff':
            # Staff can update all fields (status, etc.)
            serializer = BookingSerializer(booking, data=request.data, partial=True)

        else:
            return Response({'error': 'You do not have permission to update this booking'}, status=status.HTTP_403_FORBIDDEN)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    total_payments = Payment.objects.count()
    total_students = Student.objects.count()
    total_tours = Tour.objects.count()

    data = {
        'totalPayments': total_payments,
        'totalStudents': total_students,
        'totalTours': total_tours,
    }
    return Response(data)
