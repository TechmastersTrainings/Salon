from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.salons.models import Salon
from apps.services.models import Service


class Staff(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="staff_profile"
    )
    salon = models.ForeignKey(
        Salon,
        on_delete=models.CASCADE,
        related_name="staff_members"
    )
    bio = models.TextField(blank=True)
    experience_years = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(50)]
    )
    services = models.ManyToManyField(
        Service,
        related_name="staff_members"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["salon", "is_active"]),
            models.Index(fields=["user"]),
        ]
        ordering = ["user__username"]

    def __str__(self):
        return f"{self.user.username} - {self.salon.name}"


class StaffSchedule(models.Model):
    DAYS = (
        (0, "Monday"),
        (1, "Tuesday"),
        (2, "Wednesday"),
        (3, "Thursday"),
        (4, "Friday"),
        (5, "Saturday"),
        (6, "Sunday")
    )

    staff = models.ForeignKey(
        Staff,
        on_delete=models.CASCADE,
        related_name="schedules"
    )
    day_of_week = models.IntegerField(choices=DAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_off = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["staff", "day_of_week"],
                name="unique_staff_day_schedule"
            )
        ]
        indexes = [
            models.Index(fields=["staff", "day_of_week"]),
        ]
        ordering = ["staff", "day_of_week"]

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.is_off and self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.staff} - {self.get_day_of_week_display()}"