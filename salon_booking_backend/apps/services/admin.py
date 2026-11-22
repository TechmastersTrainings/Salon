from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "salon", "price", "duration_minutes", "is_active", "created_at")
    list_filter = ("salon", "is_active", "salon__city")
    search_fields = ("name", "salon__name", "description")
    list_editable = ("is_active", "price")
    raw_id_fields = ("salon",)
    date_hierarchy = "created_at"

    fieldsets = (
        ("Basic Information", {
            "fields": ("salon", "name", "description")
        }),
        ("Pricing & Duration", {
            "fields": ("price", "duration_minutes")
        }),
        ("Status", {
            "fields": ("is_active",)
        }),
    )