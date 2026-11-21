from rest_framework import serializers
from datetime import datetime, date, time
from .models import Appointment
from apps.salons.models import SalonHoliday
from apps.staff.models import StaffSchedule
from django.db.models import Q

class AppointmentSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    staff_name = serializers.CharField(source='staff.user.username', read_only=True)
    salon_name = serializers.CharField(source='salon.name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "customer",
            "customer_name",
            "salon",
            "salon_name",
            "staff",
            "staff_name",
            "service",
            "service_name",
            "appointment_date",
            "appointment_time",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "customer",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):
        salon = data.get("salon")
        staff = data.get("staff")
        service = data.get("service")
        appointment_date = data.get("appointment_date")
        appointment_time = data.get("appointment_time")
        customer = self.context['request'].user

        if not all([salon, staff, service, appointment_date, appointment_time]):
            raise serializers.ValidationError("All fields are required")

        now = datetime.now()
        today = date.today()

        if appointment_date < today:
            raise serializers.ValidationError(
                {"appointment_date": "Cannot book appointment in the past."}
            )

        if appointment_date == today:
            selected_datetime = datetime.combine(appointment_date, appointment_time)
            if selected_datetime <= now:
                raise serializers.ValidationError(
                    {"appointment_time": "Cannot book appointment in past time."}
                )

        # CHECK: Prevent user from booking the EXACT same slot across any salon
        user_conflict = Appointment.objects.filter(
            customer=customer,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            status__in=["pending", "confirmed", "en_route", "checked_in", "in_chair"]
        ).exists()

        if user_conflict:
            raise serializers.ValidationError(
                {"appointment_time": "You already have a booking at this time."}
            )

        # Check salon holiday
        if SalonHoliday.objects.filter(salon=salon, date=appointment_date).exists():
            raise serializers.ValidationError(
                {"appointment_date": "Salon is closed on this date."}
            )

        # Check staff schedule
        weekday = appointment_date.weekday()
        try:
            schedule = StaffSchedule.objects.get(staff=staff, day_of_week=weekday)
            if schedule.is_off:
                raise serializers.ValidationError(
                    {"staff": "Staff is not working on this day."}
                )
            if appointment_time < schedule.start_time or appointment_time > schedule.end_time:
                raise serializers.ValidationError(
                    {"appointment_time": "Time outside staff working hours."}
                )
        except StaffSchedule.DoesNotExist:
            raise serializers.ValidationError(
                {"staff": "Staff schedule not set for this day."}
            )

        # Validate relationships
        if service.salon_id != salon.id:
            raise serializers.ValidationError(
                {"service": "Service does not belong to this salon."}
            )

        if staff.salon_id != salon.id:
            raise serializers.ValidationError(
                {"staff": "Staff does not belong to this salon."}
            )

        if not staff.services.filter(id=service.id).exists():
            raise serializers.ValidationError(
                {"staff": "Selected staff does not provide this service."}
            )

        # Check for staff availability (existing appointments for this specific staff)
        appointment_exists = Appointment.objects.filter(
            staff=staff,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            status__in=["pending", "confirmed", "en_route", "checked_in", "in_chair"]
        ).exists()

        if appointment_exists:
            raise serializers.ValidationError(
                {"appointment_time": "This time slot is already booked."}
            )

        return data