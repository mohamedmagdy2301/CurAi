from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=(('male', 'Male'), ('female', 'Female')), blank=True, null=True)
    age = models.IntegerField(null=True, blank=True)

    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
    )
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=15,choices=ROLE_CHOICES,default='patient',)
    specialization = models.ForeignKey('Specialization', on_delete=models.SET_NULL, null=True, blank=True)
    consultation_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # سعر الكشف
    location = models.CharField(max_length=255, null=True, blank=True)
    is_approved = models.BooleanField(default=True)
    bio= models.TextField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True, default='profile_pics/default_profile_pic.jpg')
    profile_certificate = models.ImageField(upload_to='profile_certificate/', null=True, blank=True)
    bonus_points = models.PositiveIntegerField(default=0)


    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    def save(self, *args, **kwargs):
        if self.role != 'doctor':
            self.profile_certificate = None
        elif self.role == 'doctor':
            self.profile_certificate = 'profile_certificate/default_profile_certificate_pic.jpg'
        super().save(*args, **kwargs)

#Specialization
class Specialization(models.Model):
    name = models.CharField(max_length=100, unique=True)



    image = models.ImageField(upload_to='specialization_pics/', null=True, blank=True, default='specialization_pics/default_specialization_pic.jpg')

    def __str__(self):
        return self.name

class PatientHistory(models.Model):
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="medical_history", limit_choices_to={'role': 'patient'})
    doctor = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name="written_histories", limit_choices_to={'role': 'doctor'})
    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History for {self.patient.username} by {self.doctor.username if self.doctor else 'Unknown Doctor'}"
