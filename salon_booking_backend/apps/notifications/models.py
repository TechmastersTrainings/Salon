from django.db import models
from django.conf import settings
from datetime import timedelta
from django.utils import timezone


class Notification(models.Model):
    TYPE_CHOICES = (
        # Customer notifications
        ("customer_registered", "Customer Registered"),
        ("booking_confirmed", "Booking Confirmed"),
        ("booking_cancelled", "Booking Cancelled"),
        ("booking_reminder", "Booking Reminder"),
        ("payment_success", "Payment Success"),
        ("payment_failed", "Payment Failed"),

        # Owner notifications
        ("owner_registered", "Owner Registered"),
        ("owner_approved", "Owner Approved"),
        ("owner_first_login", "Owner First Login"),
        ("salon_created", "Salon Created"),
        ("new_booking", "New Booking Received"),
        ("booking_completed", "Booking Completed"),
        ("wallet_low_balance", "Wallet Low Balance"),
        ("wallet_recharged", "Wallet Recharged"),

        # Staff notifications
        ("staff_assigned", "Staff Assigned"),
        ("staff_schedule_updated", "Schedule Updated"),

        # Admin notifications
        ("owner_pending_approval", "Owner Pending Approval"),
        ("system_alert", "System Alert"),
        ("report_ready", "Report Ready"),
    )

    PRIORITY_CHOICES = (
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("urgent", "Urgent"),
    )

    message = models.TextField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="medium")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications"
    )
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    data = models.JSONField(default=dict, blank=True)  # For additional data
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["user", "is_read"]),
            models.Index(fields=["type"]),
            models.Index(fields=["expires_at"]),
        ]

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=7)  # 7 days default
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_type_display()} - {self.created_at}"

    def mark_as_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()