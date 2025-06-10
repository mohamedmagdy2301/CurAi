from django.db import models
from django.contrib.auth.models import User
from register_user.models import CustomUser
from django.core.exceptions import ValidationError


class DoctorReview(models.Model):
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'patient'}, related_name='patient_reviews')
    doctor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'doctor'}, related_name='doctor_reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # تقييم من 1 إلى 5
    comment = models.TextField(blank=True, null=True)  # تعليق إضافي من المريض
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        existing_review = DoctorReview.objects.filter(patient=self.patient, doctor=self.doctor).exists()
        if existing_review:
            raise ValidationError(
                "You have already submitted a review for this doctor. Please delete the previous review to submit a new one.")

    def save(self, *args, **kwargs):
        # تأكد من أنه يتم التحقق من التقييم المسبق قبل الحفظ
        self.clean()  # تنفيذ التحقق قبل الحفظ
        super().save(*args, **kwargs)  # حفظ التقييم إذا كان التحقق ناجحًا
    def __str__(self):
        return f"Review by {self.patient.username} for Dr. {self.doctor.username}"
