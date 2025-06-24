
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from tourapp.views import *
from tourapp.views import api_view
from rest_framework_simplejwt.views import(
     TokenObtainPairView, 
     TokenRefreshView ,
    )

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('users/', manage_user, name='manage_user'),
    path('user/<int:pk>/', manage_user, name='manage_user_detail'),
    
    path('parents/', manage_parent, name='manage_parent'),
    path('parent/<int:pk>/', manage_parent, name='manage_parent_detail'),
    
    path('students/', manage_student, name='manage_student'),
    path('student/<int:pk>/', manage_student, name='manage_student_detail'),
    
    path('payments/', manage_payment, name='manage_payment'),
    path('payment/<int:pk>/', manage_payment, name='manage_payment_detail'),
    
    path('tours/', manage_tour, name='manage_tour'),
    path('tour/<int:pk>/', manage_tour, name='manage_tour_detail'),
    
    path('notifications/', manage_notification, name='manage_notification'),
    path('notification/<int:pk>/', manage_notification, name='manage_notification_detail'),
    
    path('staffs/', manage_staff, name='manage_staff'),
    path('staff/<int:pk>/', manage_staff, name='manage_staff_detail'),
    
    path('tour_staffs/', manage_tour_staff, name='manage_tour_staff'),
    path('tour_staff/<int:pk>/', manage_tour_staff, name='manage_tour_staff_detail'),
    
  
    path('registration/', manage_registration, name='manage_registration'),
    path('registrations/<int:pk>/', manage_registration, name='manage_registration_detail'),
    path('registration/<int:student_id>/<int:tour_id>/', manage_registration, name='manage_registration_detail'),
    
    path('reports/', manage_report, name='manage_report'),
    path('report/<int:pk>/', manage_report, name='manage_report_detail'),
         
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
