from rest_framework import serializers
from .models import Review
from apps.accounts.serializers import UserSerializer


class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    salon_name = serializers.CharField(source='salon.name', read_only=True)

    class Meta:
        model = Review
        fields = [
            "id", "customer", "customer_name", "salon", "salon_name",
            "appointment", "rating", "comment", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "customer", "created_at", "updated_at"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value