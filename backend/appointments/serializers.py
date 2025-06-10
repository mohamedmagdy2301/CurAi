from rest_framework import serializers
from .models import Appointment,DoctorAvailability,Weekday
from datetime import datetime

class AppointmentSerializer(serializers.ModelSerializer):
    patient = serializers.CharField(source='patient.username', read_only=True)
    patient_id = serializers.IntegerField(source='patient.id', read_only=True)
    doctor = serializers.CharField(source='doctor.username', read_only=True)
    doctor_id = serializers.IntegerField(source='doctor.id', read_only=True)
    status = serializers.CharField(read_only=True)
    patient_picture = serializers.ImageField(source='patient.profile_picture', read_only=True)
    payment_status = serializers.CharField(read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'patient',"patient_id",'patient_picture', 'doctor','doctor_id', 'status','payment_status', 'appointment_date', 'appointment_time']

    def create(self, validated_data):
        """
        Override the create method to handle the conversion of `day` and `time`
        to `appointment_date`.
        """
        # الحصول على اليوم و الوقت من validated_data
        day = validated_data.pop('day')
        time = validated_data.pop('time')

        # تحويل اليوم و الوقت إلى تاريخ كامل
        appointment_date_str = f"{day} {time}"
        appointment_date = datetime.strptime(appointment_date_str, "%A %H:%M:%S")

        # إضافة `appointment_date` إلى validated_data
        validated_data['appointment_date'] = appointment_date

        # إنشاء الموعد باستخدام `appointment_date` و البيانات الأخرى
        appointment = super().create(validated_data)
        return appointment

class WeekdaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Weekday
        fields = ['name']


class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    doctor = serializers.CharField(source='doctor.username', read_only=True)
    days_of_week = serializers.CharField(write_only=True)  # 👈 بدّل ListField بـ CharField

    class Meta:
        model = DoctorAvailability
        fields = ['id', 'doctor', 'available_from', 'available_to', 'days_of_week']

    def create(self, validated_data):
        # افصل الأيام
        days_string = validated_data.pop('days_of_week', '')
        day_names = [d.strip() for d in days_string.split(',') if d.strip()]

        instance = super().create(validated_data)
        instance.days_of_week.set(Weekday.objects.filter(name__in=day_names))
        return instance

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['days_of_week'] = [day.name for day in instance.days_of_week.all()]
        return rep

