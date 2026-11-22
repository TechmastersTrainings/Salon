from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Q
from apps.salons.models import Salon
from apps.services.models import Service
from apps.staff.models import Staff


class GlobalSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "").strip()

        if not query or len(query) < 2:
            return Response({
                "salons": [],
                "services": [],
                "staff": [],
                "message": "Please enter at least 2 characters to search"
            })

        # Search salons
        salons = Salon.objects.filter(
            Q(name__icontains=query) |
            Q(city__icontains=query) |
            Q(address__icontains=query),
            is_active=True
        ).distinct()[:10]

        # Search services
        services = Service.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query),
            is_active=True,
            salon__is_active=True
        ).select_related('salon').distinct()[:10]

        # Search staff
        staff = Staff.objects.filter(
            Q(user__first_name__icontains=query) |
            Q(user__last_name__icontains=query) |
            Q(bio__icontains=query),
            is_active=True,
            salon__is_active=True
        ).select_related('user', 'salon').distinct()[:10]

        # Format results
        salon_results = [{
            "id": s.id,
            "name": s.name,
            "city": s.city,
            "address": s.address,
            "phone": s.phone,
            "type": "salon"
        } for s in salons]

        service_results = [{
            "id": s.id,
            "name": s.name,
            "salon_id": s.salon.id,
            "salon_name": s.salon.name,
            "price": str(s.price),
            "duration_minutes": s.duration_minutes,
            "type": "service"
        } for s in services]

        staff_results = [{
            "id": st.id,
            "name": st.user.get_full_name() or st.user.username,
            "salon_id": st.salon.id,
            "salon_name": st.salon.name,
            "experience_years": st.experience_years,
            "type": "staff"
        } for st in staff]

        return Response({
            "query": query,
            "salons": salon_results,
            "services": service_results,
            "staff": staff_results,
            "total_results": len(salon_results) + len(service_results) + len(staff_results)
        })