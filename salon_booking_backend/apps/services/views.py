from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.salons.models import Salon
from .models import Service
from .serializers import ServiceSerializer


class ServiceListView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Service.objects.filter(is_active=True)

        # Optional filtering by salon
        salon_id = self.request.query_params.get("salon_id")
        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)

        return queryset


class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "owner":
            return Service.objects.filter(salon__owner=user)
        return Service.objects.filter(is_active=True)

    def perform_update(self, serializer):
        service = self.get_object()
        if service.salon.owner != self.request.user:
            raise PermissionDenied("You can only update your own services")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.salon.owner != self.request.user:
            raise PermissionDenied("You can only delete your own services")
        instance.is_active = False
        instance.save()


class SalonServiceListView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        salon_id = self.kwargs.get("salon_id")
        salon = get_object_or_404(Salon, id=salon_id)
        return Service.objects.filter(salon=salon, is_active=True)


class CreateServiceView(generics.CreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        salon_id = self.request.data.get("salon")

        if user.role != "owner" and not user.is_staff:
            raise PermissionDenied("Only salon owners can create services")

        if salon_id:
            # Creating service for specific salon (admin or owner)
            salon = get_object_or_404(Salon, id=salon_id)
            if not user.is_staff and salon.owner != user:
                raise PermissionDenied("You can only create services for your own salons")
        else:
            # Auto-assign to owner's first salon
            salon = Salon.objects.filter(owner=user).first()
            if not salon:
                raise NotFound("You need to create a salon first")

        serializer.save(salon=salon)


class UpdateServiceView(generics.UpdateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(salon__owner=self.request.user)


class ToggleServiceStatusView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        service = get_object_or_404(Service, id=pk, salon__owner=request.user)
        service.is_active = not service.is_active
        service.save()

        return Response({
            "message": f"Service {'activated' if service.is_active else 'deactivated'} successfully",
            "is_active": service.is_active
        })