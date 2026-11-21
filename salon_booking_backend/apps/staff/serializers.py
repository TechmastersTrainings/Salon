from rest_framework import serializers
from .models import Staff, StaffSchedule
from apps.services.serializers import ServiceSerializer
from apps.accounts.serializers import UserSerializer
from apps.services.models import Service
from datetime import time

class StaffScheduleSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = StaffSchedule
        fields = [
            "id", "staff", "day_of_week", "day_display",
            "start_time", "end_time", "is_off", "created_at"
        ]
        read_only_fields = ["id", "created_at"]

    def validate(self, data):
        if not data.get('is_off', False):
            start_time = data.get('start_time')
            end_time = data.get('end_time')
            if start_time and end_time and start_time >= end_time:
                raise serializers.ValidationError(
                    {"end_time": "End time must be after start time"}
                )
        return data

class StaffSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    services_details = ServiceSerializer(source='services', many=True, read_only=True)
    services = serializers.PrimaryKeyRelatedField(many=True, queryset=Service.objects.all())
    schedule = serializers.SerializerMethodField()
    salon_name = serializers.CharField(source='salon.name', read_only=True)

    class Meta:
        model = Staff
        fields = [
            "id", "user", "user_details", "salon", "salon_name",
            "bio", "experience_years", "services", "services_details",
            "schedule", "is_active", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "salon", "created_at", "updated_at"]

    def get_schedule(self, obj):
        schedules = obj.schedules.all().order_by('day_of_week')
        return StaffScheduleSerializer(schedules, many=True).data

class CreateStaffSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    class Meta:
        model = Staff
        fields = [
            "email", "password", "first_name", "last_name",
            "bio", "experience_years", "services"
        ]

    def create(self, validated_data):
        from django.contrib.auth import get_user_model
        User = get_user_model()

        staff_email = validated_data.pop('email')

        user_data = {
            'email': staff_email,
            'username': staff_email,
            'password': validated_data.pop('password'),
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'role': 'staff',
            'phone': None  # This PREVENTS the IntegrityError crash
        }

        user = User.objects.create_user(**user_data)
        validated_data['user'] = user
        validated_data['salon'] = self.context['salon']

        staff = super().create(validated_data)

        # Auto-create schedules
        default_start = time(9, 0)
        default_end = time(18, 0)

        schedules_to_create = []
        for day in range(7):
            schedules_to_create.append(
                StaffSchedule(
                    staff=staff,
                    day_of_week=day,
                    start_time=default_start,
                    end_time=default_end,
                    is_off=False
                )
            )

        StaffSchedule.objects.bulk_create(schedules_to_create)

        return staff