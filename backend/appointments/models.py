from django.db import models
from register_user.models import CustomUser
from datetime import date






class Weekday(models.Model):
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    ]
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='doctor_appointments')
    appointment_date = models.DateField(default=date.today)  # 👈 ضفنا default مؤقت
    appointment_time = models.TimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    payment_status = models.CharField(
        max_length=10,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending'
    )
    def __str__(self):
        day_name = self.appointment_date.strftime("%A")
        return f"Appointment of {self.patient.username} with {self.doctor.username} on {day_name} at {self.appointment_time}"


class DoctorAvailability(models.Model):
    doctor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="availability")
    available_from = models.TimeField()
    available_to = models.TimeField()
    days_of_week = models.ManyToManyField(Weekday, related_name="available_doctors")

    def __str__(self):
        return f"{self.doctor.username} Availability from {self.available_from} to {self.available_to} on {', '.join([day.name for day in self.days_of_week.all()])}"

