from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta

from apps.bookings.models import Appointment
from apps.services.models import Service
from apps.staff.models import Staff
from .models import Salon


class SalonDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, salon_id):
        salon = get_object_or_404(Salon, id=salon_id, owner=request.user)

        # Basic counts
        total_staff = Staff.objects.filter(salon=salon).count()
        total_services = Service.objects.filter(salon=salon).count()
        total_bookings = Appointment.objects.filter(salon=salon).count()

        # Booking stats
        completed_bookings = Appointment.objects.filter(
            salon=salon,
            status="completed"
        ).count()

        cancelled_bookings = Appointment.objects.filter(
            salon=salon,
            status="cancelled"
        ).count()

        pending_bookings = Appointment.objects.filter(
            salon=salon,
            status="pending"
        ).count()

        confirmed_bookings = Appointment.objects.filter(
            salon=salon,
            status="confirmed"
        ).count()

        # Today's bookings
        today = timezone.now().date()
        today_bookings = Appointment.objects.filter(
            salon=salon,
            appointment_date=today
        ).count()

        # Weekly revenue (completed bookings)
        week_ago = timezone.now() - timedelta(days=7)
        weekly_revenue = Appointment.objects.filter(
            salon=salon,
            status="completed",
            updated_at__gte=week_ago
        ).count()  # Replace with actual revenue calculation when payment is implemented

        return Response({
            "salon_id": salon.id,
            "salon_name": salon.name,
            "total_staff": total_staff,
            "total_services": total_services,
            "total_bookings": total_bookings,
            "completed_bookings": completed_bookings,
            "cancelled_bookings": cancelled_bookings,
            "pending_bookings": pending_bookings,
            "confirmed_bookings": confirmed_bookings,
            "today_bookings": today_bookings,
            "weekly_bookings": weekly_revenue,
            "booking_breakdown": {
                "completed": completed_bookings,
                "cancelled": cancelled_bookings,
                "pending": pending_bookings,
                "confirmed": confirmed_bookings
            }
        })