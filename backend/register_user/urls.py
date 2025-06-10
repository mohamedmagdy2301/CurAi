from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SpecializationViewSet,DoctorViewSet,LogoutView,LoginView,ContactUsView,TopDoctorsAPIView,AddPatientHistoryView,PatientHistoryView
from rest_registration.api.views import login,register,change_password,profile,reset_password,send_reset_password_link,register_email,verify_email,verify_registration
from django.conf.urls.static import static
from django.conf import settings



app_name = "register_user"
router = DefaultRouter()
router.register(r'specializations', SpecializationViewSet, basename='specialization')
router.register(r'All_doctors', DoctorViewSet, basename='doctor')



urlpatterns = [
    # path("api/auth/", include("rest_registration.api.urls")),
    # path("api/login/", login, name="login"),
    path("api/login/", LoginView.as_view(), name="login"),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/register/', register, name='register'),
    # path('api/register/', register, name='register'),
    path('api/change-password/', change_password, name='change-password'),
    path('api/profile/', profile, name='profile'),

    path('', include(router.urls)),    # ✅ **إضافة مسارات إعادة تعيين كلمة المرور وتغييرها**
    path("api/reset-password/", reset_password, name="reset-password"),
    path("api/send-reset-password-link/", send_reset_password_link, name="send-reset-password-link"),
    path('api/contact-us/', ContactUsView.as_view(), name='contact_us'),

    #top doctor
    path('api/top-doctors/', TopDoctorsAPIView.as_view(), name='top-doctors'),

    path('api/patients/<int:patient_id>/add-history/', AddPatientHistoryView.as_view(), name='add_patient_history'),
    path('api/patients/<int:patient_id>/history/', PatientHistoryView.as_view(), name='get_patient_history'),




]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
