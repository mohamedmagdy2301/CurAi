from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorReviewViewSet,DoctorReviewsViewSet

router = DefaultRouter()
app_name = 'rating'

# تسجيل الـ ViewSet
router.register('review', DoctorReviewViewSet, basename='rating')
router.register(r'doctor_reviews/(?P<doctor_id>\d+)/reviews', DoctorReviewsViewSet, basename='doctor-reviews')

urlpatterns = [
    path('', include(router.urls)),
]
