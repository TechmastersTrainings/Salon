from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "type", "priority", "user", "is_read", "created_at", "expires_at")
    list_filter = ("type", "priority", "is_read", "created_at")
    search_fields = ("message", "user__username", "user__email")
    readonly_fields = ("created_at", "read_at")
    raw_id_fields = ("user",)
    date_hierarchy = "created_at"

    fieldsets = (
        ("Basic Information", {
            "fields": ("type", "priority", "message", "user")
        }),
        ("Status", {
            "fields": ("is_read", "read_at", "expires_at")
        }),
        ("Additional Data", {
            "fields": ("data",),
            "classes": ("collapse",)
        }),
        ("Timestamps", {
            "fields": ("created_at",),
            "classes": ("collapse",)
        }),
    )

    actions = ['mark_as_read', 'mark_as_unread']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True, read_at=timezone.now())

    mark_as_read.short_description = "Mark selected as read"

    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False, read_at=None)

    mark_as_unread.short_description = "Mark selected as unread"