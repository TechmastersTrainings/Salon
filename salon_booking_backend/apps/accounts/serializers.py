from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "phone",
            "role",
            "profile_image",
            "is_phone_verified",
            "is_owner_approved",
            "created_at",
        ]
        # Prevent mass assignment of privileged flags
        read_only_fields = ["id", "username", "role", "is_owner_approved", "is_phone_verified", "created_at"]