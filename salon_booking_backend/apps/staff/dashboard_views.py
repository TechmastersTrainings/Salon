from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Count, Q
from datetime import timedelta
from apps.bookings.models import Appointment
from .models import Staff


class StaffDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, staff_id):
        user = request.user

        # Permission check
        if user.role == "staff":
            staff = get_object_or_404(Staff, id=staff_id, user=user)
        elif user.role == "owner":
            staff = get_object_or_404(Staff, id=staff_id, salon__owner=user)
        else:
            return Response(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        today = timezone.localdate()
        week_start = today - timedelta(days=today.weekday())

        # Basic stats
        total_bookings = Appointment.objects.filter(staff=staff).count()
        today_bookings = Appointment.objects.filter(
            staff=staff,
            appointment_date=today
        ).count()

        # Status breakdown
        completed_bookings = Appointment.objects.filter(
            staff=staff,
            status="completed"
        ).count()

        cancelled_bookings = Appointment.objects.filter(
            staff=staff,
            status="cancelled"
        ).count()

        pending_bookings = Appointment.objects.filter(
            staff=staff,
            status="pending"
        ).count()

        confirmed_bookings = Appointment.objects.filter(
            staff=staff,
            status="confirmed"
        ).count()

        # Weekly bookings
        weekly_bookings = Appointment.objects.filter(
            staff=staff,
            appointment_date__gte=week_start
        ).count()

        # Upcoming appointments (next 7 days)
        upcoming = Appointment.objects.filter(
            staff=staff,
            appointment_date__gte=today,
            status__in=["pending", "confirmed"]
        ).order_by('appointment_date', 'appointment_time')[:10]

        upcoming_data = [{
            'id': a.id,
            'customer': a.customer.username,
            'service': a.service.name,
            'date': a.appointment_date,
            'time': a.appointment_time,
            'status': a.status
        } for a in upcoming]

        return Response({
            "staff_id": staff.id,
            "staff_name": staff.user.username,
            "salon_name": staff.salon.name,
            "total_bookings": total_bookings,
            "pending_bookings": pending_bookings,
            "confirmed_bookings": confirmed_bookings,
            "completed_bookings": completed_bookings,
            "cancelled_bookings": cancelled_bookings,
            "today_bookings": today_bookings,
            "weekly_bookings": weekly_bookings,
            "upcoming_appointments": upcoming_data,
            "booking_breakdown": {
                "completed": completed_bookings,
                "cancelled": cancelled_bookings,
                "pending": pending_bookings,
                "confirmed": confirmed_bookings
            }
        })