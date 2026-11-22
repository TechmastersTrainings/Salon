from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from datetime import datetime

from .models import Appointment
from .serializers import AppointmentSerializer
from .slot_service import get_available_slots
from apps.salons.models import Salon, SalonHoliday
from apps.staff.models import Staff

class AppointmentListView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'role'):
            if user.role == "customer":
                return Appointment.objects.filter(customer=user)
            elif user.role == "owner":
                return Appointment.objects.filter(salon__owner=user)
            elif user.role == "staff":
                return Appointment.objects.filter(staff__user=user)
        return Appointment.objects.filter(customer=user)

    def perform_create(self, serializer):
        # Satisfaction Rule: Auto-confirm to delete waiting period
        serializer.save(customer=self.request.user, status="confirmed")

class AppointmentDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin" or user.is_staff or user.is_superuser:
            return Appointment.objects.all()
        elif user.role == "customer":
            return Appointment.objects.filter(customer=user)
        elif user.role == "owner":
            return Appointment.objects.filter(salon__owner=user)
        elif user.role == "staff":
            return Appointment.objects.filter(staff__user=user)
        return Appointment.objects.none()

class CancelAppointmentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        appointment = get_object_or_404(Appointment, id=pk, customer=request.user)
        appointment.status = "cancelled"
        appointment.save()
        return Response({"message": "Cancelled successfully"}, status=status.HTTP_200_OK)

class CustomerBookingHistoryView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(customer=self.request.user).order_by("-appointment_date", "-appointment_time")

class AvailableSlotsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        salon_id = request.query_params.get("salon_id")
        staff_id = request.query_params.get("staff_id")
        date_str = request.query_params.get("date")
        service_id = request.query_params.get("service_id")

        if not all([salon_id, staff_id, date_str, service_id]):
            return Response(
                {"error": "salon_id, staff_id, date, and service_id are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            salon = Salon.objects.get(id=salon_id)
            staff = Staff.objects.get(id=staff_id)
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except (Salon.DoesNotExist, Staff.DoesNotExist, ValueError):
            return Response({"error": "Invalid input data"}, status=status.HTTP_404_NOT_FOUND)

        if SalonHoliday.objects.filter(salon=salon, date=date).exists():
            return Response({"available_slots": [], "message": "Salon closed"})

        # Call the logic with the 30-min satisfaction buffer
        slots = get_available_slots(salon, staff, date, service_id)

        return Response({
            "salon_name": salon.name,
            "staff_name": staff.user.username if hasattr(staff, 'user') else "Staff",
            "available_slots": slots
        })