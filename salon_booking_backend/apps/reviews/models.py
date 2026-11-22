from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.salons.models import Salon
from apps.bookings.models import Appointment

class Review(models.Model):
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    salon = models.ForeignKey(
        Salon,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name="review"
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]  # Added validation
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # Added for tracking edits

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["customer", "appointment"],
                name="unique_customer_appointment_review"
            )
        ]
        ordering = ["-created_at"]  # Added ordering
        indexes = [
            models.Index(fields=["salon", "-created_at"]),  # For fast salon reviews
            models.Index(fields=["customer", "-created_at"]),  # For user reviews
        ]

    def __str__(self):
        return f"{self.customer.username} - {self.salon.name} - {self.rating}★"