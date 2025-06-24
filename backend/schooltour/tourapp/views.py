from venv import logger
from django.shortcuts import render
from django.http import JsonResponse

from tourapp.serializers import *
from .models import*
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from tourapp.token_serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

import logging


logger = logging.getLogger(__name__)
class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
@csrf_exempt
def register_user(request):
    try:
        data = request.data

        # Validate required fields
        required = ['username', 'email', 'password', 'user_type', 'phone']
        for field in required:
            if field not in data:
                return Response({'message': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=data['username']).exists():
            return Response({'message': 'Username already exists'}, status=status.HTTP_409_CONFLICT)

        user = User.objects.create(
            username=data['username'],
            email=data['email'],
            password=make_password(data['password']),  # Hash password
            user_type=data['user_type'],
            phone=data['phone']
        )

        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def generic_api(model_class, serializer_class):
    @api_view(['GET', 'POST', 'PUT', 'DELETE'])
    def api_handler(request, pk=None):
        logger.debug(f"Request method: {request.method}, Data: {request.data}")
        
        if request.method == 'GET':
            if pk:
                try:
                    instance=model_class.objects.get(pk=pk)
                    serializer = serializer_class(instance)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                except model_class.DoesNotExist:
                    return Response({'error': 'The object not found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                instances = model_class.objects.all()
                serializer = serializer_class(instances, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.method == 'POST':
            serializer = serializer_class(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'PUT':
            if pk:
                try:
                    instance = model_class.objects.get(pk=pk)
                    serializer = serializer_class(instance, data=request.data)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                except model_class.DoesNotExist:
                    return Response({'error': 'The object not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'error': 'ID is  required to update data'}, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            if pk:
                try:
                    instance = model_class.objects.get(pk=pk)
                    instance.delete()
                    return Response({'message': 'Deleted successfully'},status=status.HTTP_204_NO_CONTENT)
                except model_class.DoesNotExist:
                    return Response({'error': 'The object not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'error': 'ID is required to delete data'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    return api_handler

manage_user = generic_api(User, UserSerializer)
manage_parent = generic_api(Parent, ParentSerializer)
manage_student = generic_api(Student, StudentSerializer)
manage_payment = generic_api(Payment, PaymentSerializer)
manage_tour = generic_api(Tour, TourSerializer)
manage_tour_staff = generic_api(Tour_Staff, Tour_StaffSerializer)
manage_staff = generic_api(Staff, StaffSerializer)
manage_registration = generic_api(Registration, RegistrationSerializer)
manage_report = generic_api(Report, ReportSerializer)


        
