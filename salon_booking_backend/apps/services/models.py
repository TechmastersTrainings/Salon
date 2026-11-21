from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.salons.models import Salon


class Service(models.Model):
    salon = models.ForeignKey(
        Salon,
        on_delete=models.CASCADE,
        related_name="services"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(
        validators=[MinValueValidator(5), MaxValueValidator(480)]
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["salon", "is_active"]),
            models.Index(fields=["name"]),
        ]
        ordering = ["name"]
        unique_together = ["salon", "name"]  # Prevent duplicate service names in same salon

    def __str__(self):
        return f"{self.name} - {self.salon.name}"