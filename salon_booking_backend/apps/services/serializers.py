from rest_framework import serializers
from .models import Service
from apps.salons.models import Salon


class ServiceSerializer(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "salon",
            "salon_name",
            "name",
            "description",
            "duration_minutes",
            "price",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "salon",
            "created_at",
            "updated_at",
        ]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value

    def validate_duration_minutes(self, value):
        if value < 5:
            raise serializers.ValidationError("Duration must be at least 5 minutes")
        if value > 480:
            raise serializers.ValidationError("Duration cannot exceed 8 hours (480 minutes)")
        return value