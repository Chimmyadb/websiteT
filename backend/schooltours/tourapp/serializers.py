from rest_framework import serializers
from .models import User, Student, Tour, Booking, Payment
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        token['id'] = user.id
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = getattr(self.user, 'username', '')
        data['role'] = self.user.role.lower()

        if data['role'] not in ['parent', 'staff']:
            raise serializers.ValidationError("Unknown or invalid role.")
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


from rest_framework import serializers
from .models import Payment

from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    studentName = serializers.CharField(source='student.name', read_only=True)
    parentName = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = ['payment_id', 'amount', 'payment_date', 'status', 'studentName', 'parentName']

    def get_parentName(self, obj):
        # Defensive check in case booking or parent is None
        if obj.booking and obj.booking.parent:
            parent = obj.booking.parent
            return f"{parent.first_name} {parent.last_name}"
        return None



class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = '__all__'




class BookingSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    tour_title = serializers.CharField(source='tour.title', read_only=True)
    parent_name = serializers.CharField(source='parent.username', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['parent', 'status']  # parent assigned in backend, status controlled by staff only

    def create(self, validated_data):
        # Assign the parent automatically, e.g., from context or request user
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['parent'] = request.user
        else:
            raise serializers.ValidationError("Parent (user) must be provided.")
        return super().create(validated_data)
