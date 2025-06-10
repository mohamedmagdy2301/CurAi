# في admin.py
from django.contrib import admin
from .models import DoctorReview

@admin.register(DoctorReview)
class DoctorReviewAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'rating', 'created_at', 'comment')

