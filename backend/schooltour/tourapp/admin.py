from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Parent)
admin.site.register(Student)
admin.site.register(Payment)
admin.site.register(Tour)
admin.site.register(Tour_Staff)
admin.site.register(Staff)
admin.site.register(Registration)
admin.site.register(Report)
# Registering User model if needed
# admin.site.register(User)  