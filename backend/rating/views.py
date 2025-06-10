from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import DoctorReview
from .serializers import DoctorReviewSerializer
from rest_framework.permissions import AllowAny

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import DoctorReview
from .serializers import DoctorReviewSerializer
from rest_framework.exceptions import ValidationError


class DoctorReviewViewSet(viewsets.ModelViewSet):
    queryset = DoctorReview.objects.all()
    serializer_class = DoctorReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        patient = self.request.user
        doctor = serializer.validated_data['doctor']

        if DoctorReview.objects.filter(patient=patient, doctor=doctor).exists():
            raise ValidationError(
                "You have already submitted a review for this doctor. Please delete the previous review to submit a new one.")

        # إذا لم يكن هناك تقييم سابق، نقوم بحفظ التقييم
        serializer.save(patient=patient)

    def update(self, request, *args, **kwargs):
        # تعديل التقييم
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if instance.patient != request.user:
            return Response({"detail": "You do not have permission to edit this review."},
                            status=status.HTTP_403_FORBIDDEN)

        # تحديث التقييم
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        # حذف التقييم
        instance = self.get_object()

        if instance.patient != request.user:
            return Response({"detail": "You do not have permission to delete this review."},
                            status=status.HTTP_403_FORBIDDEN)

        instance.delete()
        return Response({"detail": "Review deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class DoctorReviewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DoctorReview.objects.all()
    serializer_class = DoctorReviewSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        doctor_id = self.kwargs['doctor_id']
        reviews = DoctorReview.objects.filter(doctor=doctor_id)  # استرجاع جميع التقييمات الخاصة بالطبيب
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)