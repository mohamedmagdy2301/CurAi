from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from datetime import datetime, timedelta, date
from django.db import transaction
from collections import defaultdict
from .permissions import IsPatient, IsDoctor
from drf_spectacular.utils import extend_schema, OpenApiParameter,OpenApiResponse
from .models import Appointment, DoctorAvailability, CustomUser, Weekday
from .serializers import AppointmentSerializer, DoctorAvailabilitySerializer
import uuid
from .utils import (
    get_weekday_from_date,
    is_doctor_available,
    get_doctor_availability_data,
    generate_time_slots
)




class DoctorAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = DoctorAvailability.objects.all()
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [IsAuthenticated,IsDoctor]

    def perform_create(self, serializer):

        serializer.save(doctor=self.request.user)

    def list(self, request, *args, **kwargs):


        doctor_availabilities = DoctorAvailability.objects.filter(doctor=request.user)
        serializer = self.get_serializer(doctor_availabilities, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        availability = self.get_object()
        if availability.doctor != request.user:
            return Response({"detail": "You cannot modify another doctor's availability."}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        availability = self.get_object()
        if availability.doctor != request.user:
            return Response({"detail": "You cannot modify another doctor's availability."}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):


        availability = self.get_object()
        if availability.doctor != request.user:
            return Response({"detail": "You cannot view availability for another doctor."}, status=status.HTTP_403_FORBIDDEN)

        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def doctor_schedule(self, request):
        doctor = request.user
        doctor_availabilities = DoctorAvailability.objects.filter(doctor=doctor)
        schedule_data = []
        for availability in doctor_availabilities:
            available_times = []
            for day in availability.days_of_week.all():
                available_times.append({
                    "day": day.name,
                    "available_from": availability.available_from,
                    "available_to": availability.available_to,
                })
            schedule_data.append({"doctor": doctor.username, "schedule": available_times})

        return Response({"doctor_schedule": schedule_data})

    @action(detail=False, methods=['get'], url_path='appointments_by_day')
    def appointments_by_day(self, request):
        doctor = request.user
        appointments = Appointment.objects.filter(
            doctor=doctor
        ).order_by('appointment_date', 'appointment_time')

        serializer = AppointmentSerializer(appointments, many=True, context={'request': request})
        grouped = defaultdict(list)

        for appt in serializer.data:
            date = appt.get("appointment_date")
            grouped[date].append(appt)

        return Response(grouped)





class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsPatient]


    def get_queryset(self):
        user = self.request.user
        return Appointment.objects.filter(patient=user).order_by('-appointment_date', '-appointment_time')

    @action(detail=True, methods=['post'], url_path='simulate_payment')
    def simulate_payment(self, request, pk=None):
        appointment = self.get_object()

        if appointment.patient != request.user:
            return Response({"error": "You are not allowed to pay for this appointment"}, status=403)

        if appointment.payment_status == 'paid':
            return Response({"message": "Payment has already been completed"}, status=400)

        # 🛑 تحقق من أن الموعد ما اتأكدش لمريض آخر في نفس الوقت
        conflict = Appointment.objects.filter(
            doctor=appointment.doctor,
            appointment_date=appointment.appointment_date,
            appointment_time=appointment.appointment_time,
            payment_status='paid',
        ).exclude(id=appointment.id)

        if conflict.exists():
            return Response({
                "error": "Sorry, this appointment has been confirmed for another patient.",
                "suggestion": "Please choose another date."
            }, status=400)

        # ✅ كل شيء تمام → نؤكد الحجز
        appointment.payment_status = 'paid'
        appointment.status = 'completed'
        appointment.save()


        # ✅ أضف 5 نقاط بونص للمريض
        patient = appointment.patient
        patient.bonus_points += 5
        patient.save()

        return Response({
            "message": "Payment has been made successfully and the appointment has been confirmed ✅.",
            "new_bonus": patient.bonus_points
        })

    @extend_schema(
        methods=["GET"],
        description="إرجاع جدول التوافر للطبيب المسجل حاليًا.",
        responses={
            200: OpenApiResponse(
                description="قائمة الأيام المتاحة للطبيب مع ساعات العمل"
            )
        }
    )
    @action(detail=False, methods=['get', 'post'])
    def doctor_availability(self, request):


        doctor_id = request.query_params.get('doctor_id')

        if not doctor_id:
            return Response({"error": "The (doctor_id) must be sent in the URL.URL"}, status=400)

        try:
            doctor = CustomUser.objects.get(id=doctor_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=404)


        if request.method == 'GET':
            availability_data = get_doctor_availability_data(request, doctor)
            return Response({"doctor_availability": availability_data})


        elif request.method == 'POST':

            date_str = request.data.get('appointment_date')

            time_str = request.data.get('appointment_time')

            patient = request.user

            if not date_str or not time_str:
                return Response({"error": "(appointment_date) and (appointment_time) are required"}, status=400)

            try:

                appointment_date = datetime.strptime(date_str, "%Y-%m-%d").date()

                appointment_time = datetime.strptime(time_str, "%H:%M").time()

            except ValueError:

                return Response({"error": "Invalid date or time format"}, status=400)

            if appointment_date < date.today():
                return Response({"error": "Cannot book an appointment in the past"}, status=400)

            weekday_name = get_weekday_from_date(appointment_date)

            try:

                weekday = Weekday.objects.get(name=weekday_name)

            except Weekday.DoesNotExist:

                return Response({"error": "Weekday not found"}, status=400)

            if not is_doctor_available(doctor, weekday, appointment_time):
                return Response({"error": "Doctor is not available at this time"}, status=400)

            with transaction.atomic():

                conflict = Appointment.objects.filter(

                    doctor=doctor,

                    appointment_date=appointment_date,

                    appointment_time=appointment_time,

                    status__in=["pending", "confirmed", "completed"]

                )

                if conflict.exists():
                    return Response({"error": "This appointment slot is already booked"}, status=400)

                appointment = Appointment.objects.create(

                    patient=patient,

                    doctor=doctor,

                    appointment_date=appointment_date,

                    appointment_time=appointment_time,

                    status='pending',

                    payment_status='pending'

                )

                availability_data = get_doctor_availability_data(request, doctor)

                return Response({

                    "message": "Appointment booked successfully. Please complete the payment to confirm.",

                    "appointment_id": appointment.id,

                }, status=201)



class GenerateTemporaryCouponView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request):
        user = request.user
        try:
            points_to_deduct = int(request.data.get("points"))
        except (TypeError, ValueError):
            return Response({"error": "برجاء إرسال رقم صحيح في الحقل (points)"}, status=400)

        if points_to_deduct <= 0:
            return Response({"error": "عدد النقاط يجب أن يكون أكبر من صفر"}, status=400)

        if user.bonus_points < points_to_deduct:
            return Response({"error": "لا يوجد نقاط كافية في حسابك"}, status=400)

        # خصم النقاط
        user.bonus_points -= points_to_deduct
        user.save()

        # توليد كود مؤقت
        coupon_code = uuid.uuid4().hex[:10].upper()

        return Response({
            "message": "done create coupon code",
            "coupon_code": coupon_code,
            "discount_value": points_to_deduct,
            "remaining_bonus": user.bonus_points
        }, status=200)