from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Count, Avg
from apps.accounts.models import User
from apps.salons.models import Salon
from apps.services.models import Service
from apps.bookings.models import Appointment
from apps.reviews.models import Review


class PlatformStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        stats = {
            'total_customers': User.objects.filter(role='customer', is_active=True).count(),
            'total_salons': Salon.objects.filter(is_active=True).count(),
            'total_services': Service.objects.filter(is_active=True).count(),
            'total_bookings': Appointment.objects.count(),
            'total_reviews': Review.objects.count(),
            'avg_rating': Review.objects.aggregate(avg=Avg('rating'))['avg'] or 0,
        }
        return Response(stats)