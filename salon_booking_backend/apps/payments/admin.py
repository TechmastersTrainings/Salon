from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id", "appointment", "amount", "method",
        "status", "transaction_id", "paid_at", "created_at"
    )
    list_filter = ("method", "status", "currency")
    search_fields = ("transaction_id", "order_id", "appointment__customer__username")
    readonly_fields = ("payment_response", "created_at", "updated_at")
    raw_id_fields = ("appointment",)
    date_hierarchy = "created_at"

    fieldsets = (
        ("Basic Information", {
            "fields": ("appointment", "amount", "currency", "method")
        }),
        ("Transaction Details", {
            "fields": ("transaction_id", "order_id", "status", "paid_at")
        }),
        ("Additional Data", {
            "fields": ("payment_response",),
            "classes": ("collapse",)
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )