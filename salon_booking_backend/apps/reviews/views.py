from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from apps.bookings.models import Appointment
from apps.salons.models import Salon


class CreateReviewView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        appointment = serializer.validated_data["appointment"]

        # Check if appointment belongs to this customer
        if appointment.customer != self.request.user:
            raise ValidationError("You can only review your own appointments")

        # Check if appointment is completed
        if appointment.status != "completed":
            raise ValidationError("You can only review completed appointments")

        # Check if review already exists
        if hasattr(appointment, 'review'):
            raise ValidationError("Review already exists for this appointment")

        # Save the review
        serializer.save(
            customer=self.request.user,
            salon=appointment.salon
        )


class SalonReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        salon_id = self.kwargs["salon_id"]
        return Review.objects.filter(salon_id=salon_id).select_related(
            'customer', 'salon'
        ).order_by("-created_at")


class CustomerReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(
            customer=self.request.user
        ).select_related('salon').order_by("-created_at")


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(customer=self.request.user)

    def perform_update(self, serializer):
        # Prevent changing appointment/customer/salon
        serializer.save()

    def perform_destroy(self, instance):
        if instance.customer != self.request.user:
            raise PermissionDenied("You can only delete your own reviews")
        instance.delete()


class SalonRatingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, salon_id):
        salon = get_object_or_404(Salon, id=salon_id)

        # Calculate average rating and count
        stats = Review.objects.filter(salon=salon).aggregate(
            average_rating=Avg('rating'),
            total_reviews=Count('id')
        )

        # Get rating distribution
        distribution = Review.objects.filter(salon=salon).values('rating').annotate(
            count=Count('id')
        ).order_by('rating')

        rating_counts = {i: 0 for i in range(1, 6)}
        for item in distribution:
            rating_counts[item['rating']] = item['count']

        return Response({
            'salon_id': salon.id,
            'salon_name': salon.name,
            'average_rating': round(stats['average_rating'] or 0, 1),
            'total_reviews': stats['total_reviews'] or 0,
            'rating_distribution': [
                {'stars': i, 'count': rating_counts[i]}
                for i in range(1, 6)
            ]
        })