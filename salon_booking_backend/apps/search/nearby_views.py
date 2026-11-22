from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from apps.salons.models import Salon
from apps.services.models import Service
import math
from django.db.models import Q


class NearbySalonView(APIView):
    permission_classes = [AllowAny]

    def calculate_distance(self, lat1, lon1, lat2, lon2):
        """Calculate distance between two points using Haversine formula"""
        R = 6371  # Earth's radius in kilometers

        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)

        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) *
             math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) ** 2)

        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def get(self, request):
        # Get parameters
        lat = request.query_params.get("lat")
        lng = request.query_params.get("lng")
        radius = request.query_params.get("radius", 10)  # Default radius 10km
        service_id = request.query_params.get("service_id")
        limit = request.query_params.get("limit", 20)

        # Validate required params
        if not lat or not lng:
            return Response(
                {"error": "Latitude and longitude are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate coordinates
        try:
            lat = float(lat)
            lng = float(lng)
            radius = float(radius)
            limit = int(limit)

            if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
                raise ValueError("Invalid coordinates")

        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid latitude/longitude values"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get active salons with coordinates
        salons = Salon.objects.filter(
            is_active=True,
            latitude__isnull=False,
            longitude__isnull=False
        ).exclude(
            Q(latitude=0) | Q(longitude=0)
        )

        # Filter by service if provided
        if service_id:
            try:
                service_id = int(service_id)
                salons = salons.filter(services__id=service_id).distinct()
            except ValueError:
                return Response(
                    {"error": "Invalid service_id"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Calculate distances and filter by radius
        results = []
        for salon in salons:
            try:
                salon_lat = float(salon.latitude)
                salon_lng = float(salon.longitude)

                distance = self.calculate_distance(lat, lng, salon_lat, salon_lng)

                if distance <= radius:
                    # Get service count
                    service_count = salon.services.filter(is_active=True).count()

                    results.append({
                        "id": salon.id,
                        "name": salon.name,
                        "address": salon.address,
                        "city": salon.city,
                        "phone": salon.phone,
                        "latitude": salon.latitude,
                        "longitude": salon.longitude,
                        "distance_km": round(distance, 2),
                        "opening_time": salon.opening_time.strftime("%H:%M") if salon.opening_time else None,
                        "closing_time": salon.closing_time.strftime("%H:%M") if salon.closing_time else None,
                        "service_count": service_count,
                        "has_coordinates": True
                    })
            except (ValueError, TypeError):
                continue  # Skip salons with invalid coordinates

        # Sort by distance and limit results
        results = sorted(results, key=lambda x: x["distance_km"])[:limit]

        # Get total count in area
        total_in_area = len(results)

        return Response({
            "user_location": {
                "latitude": lat,
                "longitude": lng
            },
            "search_radius_km": radius,
            "total_found": total_in_area,
            "results": results,
            "filters_applied": {
                "service_id": service_id
            }
        })