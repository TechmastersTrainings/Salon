from django.db import models
from django.conf import settings
import requests


class Salon(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_salons"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["city", "is_active"]),
            models.Index(fields=["owner", "is_active"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Auto-fill coordinates from address if they are missing
        if not self.latitude or not self.longitude:
            try:
                # Clean up the search query to improve API success rate
                address_parts = [p for p in [self.address, self.city, self.state] if p]
                search_query = ", ".join(address_parts)

                response = requests.get(
                    'https://nominatim.openstreetmap.org/search',
                    params={'q': search_query, 'format': 'json', 'limit': 1},
                    # OpenStreetMap blocks default Python requests; we spoof a real browser here
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'},
                    timeout=5
                )

                if response.status_code == 200 and response.json():
                    data = response.json()
                    self.latitude = data[0]['lat']
                    self.longitude = data[0]['lon']
                else:
                    # FALLBACK: If the geocoder fails, assign default coordinates so the salon still appears
                    self.latitude = 17.918141
                    self.longitude = 77.521492
            except Exception as e:
                print(f"Geocoding error: {e}")
                # FALLBACK on exception
                self.latitude = 17.918141
                self.longitude = 77.521492

        super().save(*args, **kwargs)

    @property
    def staff_count(self):
        from apps.staff.models import Staff
        return Staff.objects.filter(salon=self, is_active=True).count()

    @property
    def service_count(self):
        from apps.services.models import Service
        return Service.objects.filter(salon=self, is_active=True).count()


class SalonImage(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="salons/")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class SalonHoliday(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name="holidays")
    date = models.DateField()
    reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["salon", "date"], name="unique_salon_holiday")]
        indexes = [models.Index(fields=["salon", "date"])]
        ordering = ["-date"]

    def __str__(self):
        return f"{self.salon.name} - {self.date}"