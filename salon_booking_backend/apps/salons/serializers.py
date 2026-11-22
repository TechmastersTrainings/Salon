from rest_framework import serializers
from .models import Salon, SalonImage, SalonHoliday

class SalonImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonImage
        fields = ["id", "image", "created_at"]
        read_only_fields = ["id", "created_at"]

class SalonHolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonHoliday
        fields = ["id", "salon", "date", "reason", "created_at"]
        read_only_fields = ["id", "created_at"]

class SalonSerializer(serializers.ModelSerializer):
    images = SalonImageSerializer(many=True, read_only=True)
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    staff_count = serializers.IntegerField(read_only=True)
    service_count = serializers.IntegerField(read_only=True)
    distance_km = serializers.FloatField(read_only=True)

    class Meta:
        model = Salon
        fields = [
            "id", "owner", "owner_name", "name", "description", "phone",
            "email", "address", "city", "state", "postal_code",
            "latitude", "longitude", "opening_time", "closing_time",
            "is_active", "images", "staff_count", "service_count",
            "distance_km", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]