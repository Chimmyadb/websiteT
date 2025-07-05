from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from tourapp.views import *

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'), 
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', register_user, name='register_user'),

    path('users/', manage_user, name='manage_user'),
    path('user/<int:pk>/', manage_user, name='manage_user_detail'),

    path('students/', manage_student, name='manage_student'),
    path('student/<int:pk>/', manage_student, name='manage_student_detail'),

    path('payments/', manage_payment, name='manage_payment'),
    path('payment/<int:pk>/', manage_payment, name='manage_payment_detail'),

    path('tours/', manage_tour, name='manage_tour'),
    path('tour/<int:pk>/', manage_tour, name='manage_tour_detail'),

   
    path('bookings/', manage_booking, name='manage_booking'),
    path('booking/<int:pk>/', manage_booking_detail, name='manage_booking_detail'),

    path('dashboard-stats/', dashboard_stats, name='dashboard_stats'),
  
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
