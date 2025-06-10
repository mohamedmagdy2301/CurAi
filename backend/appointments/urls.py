from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet,DoctorAvailabilityViewSet,GenerateTemporaryCouponView
from django.conf import settings
from django.conf.urls.static import static


app_name = "appointments"

router = DefaultRouter()
router.register(r'patient_panal_appointments', AppointmentViewSet, basename='patient-appointments')
router.register(r'doctor_panal_availabilities', DoctorAvailabilityViewSet, basename='doctor-availability')

urlpatterns = [
    path('', include(router.urls)),
    path('generate-temporary-coupon/', GenerateTemporaryCouponView.as_view(), name='generate-temp-coupon'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)