from datetime import datetime, timedelta, date
from .models import Appointment
from apps.services.models import Service
from apps.staff.models import StaffSchedule


def get_available_slots(salon, staff, booking_date, service_id):
    try:
        service = Service.objects.get(id=service_id)
        schedule = StaffSchedule.objects.get(staff=staff, day_of_week=booking_date.weekday(), is_off=False)
    except (Service.DoesNotExist, StaffSchedule.DoesNotExist):
        return []

    # Buffer: Service Duration + 30 mins Buffer
    total_needed = timedelta(minutes=service.duration_minutes + 30)

    available_slots = []

    # Determine the actual start time for checking (Opening time vs Now)
    start_time = schedule.start_time
    now = datetime.now()

    # If the requested date is today, don't even consider slots in the past
    if booking_date == now.date():
        # Add 15 min buffer to current time to give user time to finish booking
        earliest_possible = (now + timedelta(minutes=15)).time()
        if earliest_possible > start_time:
            start_time = earliest_possible

    curr_dt = datetime.combine(booking_date, start_time)
    end_dt = datetime.combine(booking_date, schedule.end_time)

    existing = Appointment.objects.filter(
        staff=staff,
        appointment_date=booking_date,
        status__in=["confirmed", "en_route", "checked_in", "in_chair"]
    ).select_related('service')

    while curr_dt + total_needed <= end_dt:
        is_blocked = False
        for booking in existing:
            b_start = datetime.combine(booking_date, booking.appointment_time)
            b_end = b_start + timedelta(minutes=booking.service.duration_minutes + 30)

            if curr_dt < b_end and (curr_dt + total_needed) > b_start:
                is_blocked = True
                break

        if not is_blocked:
            available_slots.append(curr_dt.time().strftime("%H:%M"))

        # Increment by 30 mins
        curr_dt += timedelta(minutes=30)

    return available_slots