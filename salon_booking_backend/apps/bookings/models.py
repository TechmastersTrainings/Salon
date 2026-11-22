from django.db import models
from django.conf import settings
from apps.salons.models import Salon
from apps.services.models import Service
from apps.staff.models import Staff
from datetime import timedelta


class Appointment(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("en_route", "En Route"),  # User is moving
        ("checked_in", "At Salon"),  # User arrived
        ("in_chair", "In Progress"),  # Barber started
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="appointments")
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name="appointments")
    staff = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, related_name="appointments")
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="appointments")

    appointment_date = models.DateField()
    appointment_time = models.TimeField()

    # Real-time tracking fields
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def expected_duration(self):
        # Adds a 5 minute cleanup buffer to every service duration
        return timedelta(minutes=self.service.duration_minutes + 5)

    class Meta:
        indexes = [
            models.Index(fields=["staff", "appointment_date", "appointment_time"]),
            models.Index(fields=["salon", "appointment_date"]),
        ]
        ordering = ["appointment_date", "appointment_time"]

    def __str__(self):
        return f"{self.customer.username} - {self.status} at {self.appointment_time}"