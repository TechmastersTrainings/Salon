from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.contrib.auth import get_user_model
from django.db.models import F, FloatField, ExpressionWrapper
from django.db.models.functions import ACos, Cos, Radians, Sin
from .models import Salon
from .serializers import SalonSerializer

User = get_user_model()


class IsMerchantOrAdmin(BasePermission):
    """
    Permission check: Only verified salon merchants (owner) or platform admins can add/manage shops.
    """
    message = "Access Denied: Only salon merchants or administrators are authorized to add a shop."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return request.user.role in ["owner", "admin"] or request.user.is_staff or request.user.is_superuser


class SalonListView(generics.ListAPIView):
    serializer_class = SalonSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Salon.objects.filter(is_active=True)
        city = self.request.query_params.get("city")
        if city:
            queryset = queryset.filter(city__icontains=city)
        return queryset


class SalonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Salon.objects.all()
    serializer_class = SalonSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_update(self, serializer):
        salon = self.get_object()
        if salon.owner != self.request.user and self.request.user.role != 'admin':
            raise PermissionDenied("You can only edit your own salon.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.owner != self.request.user and self.request.user.role != 'admin':
            raise PermissionDenied("You can only delete your own salon.")
        instance.delete()


class SalonSearchView(generics.ListAPIView):
    serializer_class = SalonSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Salon.objects.filter(is_active=True)
        city = self.request.query_params.get("city")
        name = self.request.query_params.get("name")
        if city:
            queryset = queryset.filter(city__icontains=city)
        if name:
            queryset = queryset.filter(name__icontains=name)
        return queryset


class NearbySalonView(generics.ListAPIView):
    serializer_class = SalonSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        lat = self.request.query_params.get("lat")
        lng = self.request.query_params.get("lng")
        radius = self.request.query_params.get("radius", 50)  # Increased to 50km for testing

        if not lat or not lng:
            return Salon.objects.none()

        try:
            lat_f = float(lat)
            lng_f = float(lng)

            # Distance formula
            distance_expr = ExpressionWrapper(
                6371 * ACos(
                    Cos(Radians(lat_f)) * Cos(Radians(F('latitude'))) *
                    Cos(Radians(F('longitude')) - Radians(lng_f)) +
                    Sin(Radians(lat_f)) * Sin(Radians(F('latitude')))
                ),
                output_field=FloatField()
            )

            return Salon.objects.filter(
                is_active=True,
                latitude__isnull=False,
                longitude__isnull=False
            ).annotate(distance_km=distance_expr).filter(distance_km__lte=float(radius)).order_by('distance_km')
        except:
            return Salon.objects.none()


class CreateSalonView(generics.CreateAPIView):
    serializer_class = SalonSerializer
    permission_classes = [IsAuthenticated, IsMerchantOrAdmin]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == "admin" or user.is_staff or user.is_superuser:
            owner_id = self.request.data.get("owner")
            if not owner_id:
                owner = user
            else:
                owner = User.objects.get(id=owner_id, role="owner")
            serializer.save(owner=owner)
        else:
            serializer.save(owner=user)


class OwnerSalonListView(generics.ListAPIView):
    serializer_class = SalonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Salon.objects.filter(owner=self.request.user, is_active=True)