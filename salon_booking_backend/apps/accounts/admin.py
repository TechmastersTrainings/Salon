from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "username", "phone", "role", "is_owner_approved", "is_active", "created_at")
    list_filter = ("role", "is_owner_approved", "is_active")
    search_fields = ("email", "username", "phone")
    ordering = ("-created_at",)