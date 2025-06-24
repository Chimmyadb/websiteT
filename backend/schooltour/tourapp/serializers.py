from rest_framework import serializers
from .models import*

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
        
        
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = '__all__'
        
class Tour_StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour_Staff
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = '__all__'
        
class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'