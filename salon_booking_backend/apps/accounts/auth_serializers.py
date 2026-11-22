from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ["email", "phone", "password", "confirm_password", "role"]

    def validate_role(self, value):
        # SECURITY: Prevent privilege escalation. Public registration is only allowed for customer or owner.
        if value not in ["customer", "owner"]:
            raise serializers.ValidationError("Invalid registration role. Only customer or salon owner registration is permitted.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("User with this email already exists")
        return value.lower()

    def validate_phone(self, value):
        if value and User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("User with this phone already exists")
        return value

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        # Ensure new owners are unapproved by default, and cannot escalate permissions
        if validated_data.get('role') == 'owner':
            validated_data['is_owner_approved'] = False
        validated_data['is_staff'] = False
        validated_data['is_superuser'] = False
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email:
            raise serializers.ValidationError("Email is required")

        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        if user.role == "owner" and not user.is_owner_approved:
            raise serializers.ValidationError("Owner account not approved by admin")

        return user