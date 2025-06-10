from .models import Appointment, DoctorAvailability, Weekday
from datetime import date, timedelta, datetime
from collections import defaultdict

def get_weekday_from_date(date_obj):
    """
    استخرج اسم اليوم من التاريخ (مثلاً: 'Monday')
    """
    return date_obj.strftime("%A")


def generate_time_slots(start_time, end_time, step_minutes=60):
    """
    إنشاء قائمة من الساعات المتاحة من وقت البدء حتى وقت الانتهاء.
    """
    current = datetime.combine(datetime.today(), start_time)
    end = datetime.combine(datetime.today(), end_time)
    slots = []
    while current < end:
        slots.append(current.time().strftime("%H:%M"))
        current += timedelta(minutes=step_minutes)
    return slots


def is_doctor_available(doctor, weekday, appointment_time):
    """
    تحقق ما إذا كان الطبيب متاحًا في يوم ووقت معينين
    """
    return DoctorAvailability.objects.filter(
        doctor=doctor,
        days_of_week=weekday,
        available_from__lte=appointment_time,
        available_to__gt=appointment_time
    ).exists()


# def get_doctor_availability_data(doctor):
#     """
#     إرجاع جدول التوافر للطبيب مع المواعيد المحجوزة
#     """
#     doctor_availability = DoctorAvailability.objects.filter(doctor=doctor)
#     availability_data = []
#
#     for availability in doctor_availability:
#         for day in availability.days_of_week.all():
#             start_time = availability.available_from
#             end_time = availability.available_to
#
#             slots = generate_time_slots(start_time, end_time)
#             slot_strings = [slot.strftime("%H:%M") for slot in slots]
#
#             appointments = [
#                 a for a in Appointment.objects.filter(
#                     doctor=doctor,
#                     status__in=["completed"]
#                 )
#                 if a.appointment_date.strftime("%A") == day.name
#             ]
#
#             booked_times = {a.appointment_time.strftime("%H:%M") for a in appointments}
#
#             free_slots = [t for t in slot_strings if t not in booked_times]
#             booked_slots = [
#                 {
#                     "time": a.appointment_time.strftime("%H:%M"),
#                     "date": a.appointment_date.strftime("%Y-%m-%d")
#                 }
#                 for a in appointments
#             ]
#             availability_data.append({
#                 "day": day.name,
#                 "available_from": start_time.strftime("%H:%M"),
#                 "available_to": end_time.strftime("%H:%M"),
#                 "free_slots": free_slots,
#                 "booked_slots": booked_slots,
#             })
#
#     return availability_data


def get_doctor_availability_data(request, doctor):
    availability_data = []
    doctor_availabilities = DoctorAvailability.objects.filter(doctor=doctor)

    today = date.today()
    now = datetime.now().time()

    try:
        range_days = int(request.query_params.get("range_days", 30))
    except ValueError:
        range_days = 30

    future_dates = [today + timedelta(days=i) for i in range(range_days)]

    for availability in doctor_availabilities:
        for day in availability.days_of_week.all():
            booked_by_date = defaultdict(list)

            for d in future_dates:
                if d.strftime("%A") != day.name:
                    continue

                appointments = Appointment.objects.filter(
                    doctor=doctor,
                    appointment_date=d,
                    status="completed"
                )

                for appt in appointments:
                    if d == today and appt.appointment_time <= now:
                        continue

                    booked_by_date[d.strftime("%Y-%m-%d")].append(appt.appointment_time.strftime("%H:%M"))

            date_slots = []
            for d in future_dates:
                if d.strftime("%A") != day.name:
                    continue

                all_possible_slots = generate_time_slots(
                    availability.available_from, availability.available_to
                )
                booked_slots = booked_by_date.get(d.strftime("%Y-%m-%d"), [])
                free_slots = [slot for slot in all_possible_slots if slot not in booked_slots]

                date_slots.append({
                    "date": d.strftime("%Y-%m-%d"),
                    "booked_slots": booked_slots,
                    "free_slots": free_slots
                })

            availability_data.append({
                "day": day.name,
                "available_from": availability.available_from.strftime("%H:%M"),
                "available_to": availability.available_to.strftime("%H:%M"),
                "dates": date_slots
            })

    return availability_data