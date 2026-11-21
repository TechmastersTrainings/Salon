from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from apps.salons.models import Salon
from .models import Staff, StaffSchedule
from .serializers import StaffSerializer, StaffScheduleSerializer, CreateStaffSerializer

User = get_user_model()


class StaffListView(generics.ListAPIView):
    serializer_class = StaffSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Staff.objects.filter(is_active=True).select_related('user', 'salon').prefetch_related('services',
                                                                                                         'schedules')

        salon_id = self.request.query_params.get("salon_id")
        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)

        service_id = self.request.query_params.get("service_id")
        if service_id:
            queryset = queryset.filter(services__id=service_id)

        return queryset


class StaffDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "owner":
            return Staff.objects.filter(salon__owner=user).prefetch_related('services')
        elif user.role == "staff":
            return Staff.objects.filter(user=user).prefetch_related('services')
        return Staff.objects.none()

    def perform_update(self, serializer):
        staff = self.get_object()
        if staff.salon.owner != self.request.user:
            raise PermissionDenied("Only salon owner can update staff")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.salon.owner != self.request.user:
            raise PermissionDenied("Only salon owner can delete staff")
        # FIX: Hard-delete the associated User to free up the unique email and phone
        instance.user.delete()


class SalonStaffListView(generics.ListAPIView):
    serializer_class = StaffSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        salon_id = self.kwargs.get("salon_id")
        return Staff.objects.filter(salon_id=salon_id, is_active=True).select_related('user').prefetch_related(
            'services')


class CreateStaffView(generics.CreateAPIView):
    serializer_class = CreateStaffSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        salon_id = self.request.data.get("salon_id")

        if user.role != "owner" and not user.is_staff:
            raise PermissionDenied("Only salon owners can add staff")

        if salon_id:
            salon = get_object_or_404(Salon, id=salon_id)
            if not user.is_staff and salon.owner != user:
                raise PermissionDenied("You can only add staff to your own salons")
        else:
            salon = Salon.objects.filter(owner=user).first()
            if not salon:
                raise NotFound("You need to create a salon first")

        serializer.context['salon'] = salon
        serializer.save()


class UpdateStaffScheduleView(generics.UpdateAPIView):
    serializer_class = StaffScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StaffSchedule.objects.filter(staff__salon__owner=self.request.user)


class StaffServicesView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        staff = get_object_or_404(Staff, id=pk, salon__owner=request.user)
        service_ids = request.data.get('service_ids', [])

        if not isinstance(service_ids, list):
            return Response(
                {"error": "service_ids must be a list"},
                status=status.HTTP_400_BAD_REQUEST
            )

        staff.services.set(service_ids)
        return Response({
            "message": "Staff services updated successfully",
            "services": list(staff.services.values_list('id', flat=True))
        })