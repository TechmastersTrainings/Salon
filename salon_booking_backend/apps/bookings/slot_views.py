from datetime import datetime, timedelta
from .models import Appointment
from apps.services.models import Service
from apps.staff.models import StaffSchedule


def get_available_slots(salon, staff, date, service_id):
    try:
        service = Service.objects.get(id=service_id)
        schedule = StaffSchedule.objects.get(staff=staff, day_of_week=date.weekday(), is_off=False)
    except (Service.DoesNotExist, StaffSchedule.DoesNotExist):
        return []

    # ENFORCE: Service Duration + 30 mins Buffer
    total_needed = timedelta(minutes=service.duration_minutes + 30)

    available_slots = []
    curr_dt = datetime.combine(date, schedule.start_time)
    end_dt = datetime.combine(date, schedule.end_time)

    existing = Appointment.objects.filter(
        staff=staff,
        appointment_date=date,
        status__in=["confirmed", "en_route", "checked_in", "in_chair"]
    ).select_related('service')

    while curr_dt + total_needed <= end_dt:
        is_blocked = False
        for booking in existing:
            b_start = datetime.combine(date, booking.appointment_time)
            # Add 30m buffer to existing appointments too
            b_end = b_start + timedelta(minutes=booking.service.duration_minutes + 30)

            if curr_dt < b_end and (curr_dt + total_needed) > b_start:
                is_blocked = True
                break

        if not is_blocked:
            available_slots.append(curr_dt.time().strftime("%H:%M"))

        curr_dt += timedelta(minutes=30)

    return available_slots