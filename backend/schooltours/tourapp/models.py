from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Username must be provided")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = [
        ('staff', 'staff'),
        ('parent', 'parent'),
    ]
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone = models.CharField(max_length=15, blank=True, null=True)
    username = models.CharField(max_length=150, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []  # email + password already required

    class Meta:
        db_table = 'user'

    def __str__(self):
        return f"{self.username} - ({self.role})"


class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    classes = models.CharField(max_length=10)
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    class Meta:
        db_table = 'student'

    def __str__(self):
        return self.name


class Payment(models.Model):
    METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('bank', 'Bank'),
        ('mobile', 'Mobile'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]

    payment_id = models.AutoField(primary_key=True)
    amount = models.IntegerField()
    methods = models.CharField(max_length=50, choices=METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    payment_date = models.DateField()
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    booking = models.ForeignKey('Booking', on_delete=models.CASCADE, null=True, blank=True) 

    class Meta:
        db_table = 'payment'

    def __str__(self):
        return f"Payment {self.payment_id} - {self.amount} ({self.status})"


class Tour(models.Model):
    tour_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    destination = models.TextField()
    amount = models.IntegerField(default=0)
    # student=models.ForeignKey(Student, on_delete=models.CASCADE)
    
     
    class Meta:
        db_table = 'tour'

    def __str__(self):
        return f"{self.title} - {self.date} ({self.destination})"




from django.db import models
class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    parent = models.ForeignKey('User', on_delete=models.CASCADE)
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    tour = models.ForeignKey('Tour', on_delete=models.CASCADE)
    booking_date = models.DateField()
    status = models.CharField(max_length=20, default='pending')
    amount = models.IntegerField(default=0)


    def __str__(self):
        return f"{self.student.name} - {self.tour.title} ({self.status})"


