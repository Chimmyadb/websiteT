from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

# Create your models here.
#User model
class User(AbstractUser):
    ROLE_CHOICES = [
        ('staff', 'Staff'),
        ('parent', 'Parent'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    
    class Meta:
        db_table = 'user'
        
    def __str__(self):
        return f"{self.username} - ({self.role})"

class Parent(models.Model):
    parent_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=20)
    phone = models.IntegerField()
    email = models.EmailField(max_length=100)
    
    class Meta:
        db_table = 'parent'
    
    def __str__(self):
        return self.user.username
      
    
class Student(models.Model):
    student_id= models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    classes = models.CharField(max_length=10)
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]

    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    parent_id=models.ForeignKey(Parent, on_delete=models.CASCADE)

    class Meta:
        db_table = 'student'
    
    def __str__(self):
        return self.name
    
    
class Payment(models.Model):
    payment_id=models.AutoField(primary_key=True)
    amount=models.IntegerField()
    methods=models.CharField(max_length=50)
    status=models.CharField(max_length=20)
    payment_date=models.DateField()
    
    class Meta:
        db_table = 'payment'
        
    def __str__(self):
        return f"Payment {self.payment_id} - {self.amount} ({self.status})"
    
class Tour(models.Model):
    tour_id=models.AutoField(primary_key=True)
    title=models.CharField(max_length=200)
    description=models.TextField()
    date=models.DateField()
    destination=models.TextField()
    
    class Meta:
        db_table = 'tour'
        
    def __str__(self):
        return f"{self.title} - {self.date} ({self.destination})"
    
    

    
class Staff(models.Model):
    staff_id=models.AutoField(primary_key=True)
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    name=models.CharField(max_length=50)
    phone=models.IntegerField()
    email=models.EmailField(max_length=100)
    role=models.CharField(max_length=50)
    
    class Meta:
        db_table = 'staff'
    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
class Tour_Staff(models.Model):
    tour_staff_id=models.AutoField(primary_key=True)
    staff_id=models.ForeignKey(Staff, on_delete=models.CASCADE)
    tour_id=models.ForeignKey(Tour, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'tour_staff'
        
    def __str__(self):
        return f"{self.staff_id.name} - {self.tour_id.title}"
    
    
class Registration(models.Model):
    registration_id=models.AutoField(primary_key=True)
    student_id=models.ForeignKey(Student, on_delete=models.CASCADE)
    tour_id=models.ForeignKey(Tour, on_delete=models.CASCADE)
    payment_id=models.ForeignKey(Payment, on_delete=models.CASCADE)
    registration_date=models.DateField()
    
    class Meta:
        db_table = 'registration'
        
    def __str__(self):
        return f"Registration {self.registration_id} - {self.student_id.name} for {self.tour_id.title}"
    
    
class Report(models.Model):
    report_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    tour_id = models.ForeignKey(Tour, on_delete=models.CASCADE)

    class Meta:
        db_table = 'report'

    def __str__(self):
        return f"{self.title} - {self.tour_id.title}"
    
    

