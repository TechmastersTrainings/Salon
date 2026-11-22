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
        # REMOVED "is_owner_approved" from here
        read_only_fields = ["id", "username", "created_at"]