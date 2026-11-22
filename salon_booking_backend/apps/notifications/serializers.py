from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id", "type", "type_display", "priority", "priority_display",
            "message", "user", "is_read", "read_at", "data",
            "created_at", "expires_at", "time_ago"
        ]
        read_only_fields = ["id", "created_at"]

    def get_time_ago(self, obj):
        from django.utils.timesince import timesince
        return timesince(obj.created_at)