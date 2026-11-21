from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer",
        "salon",
        "staff",
        "service",
        "appointment_date",
        "appointment_time",
        "status",
    )
    list_filter = (
        "status",
        "salon",
        "appointment_date",
    )
    search_fields = (
        "customer__username",
        "customer__email",
        "salon__name",
    )
    date_hierarchy = "appointment_date"
    raw_id_fields = ("customer", "staff", "service")