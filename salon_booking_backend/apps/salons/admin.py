from django.contrib import admin
from .models import Salon, SalonImage, SalonHoliday

class SalonImageInline(admin.TabularInline):
    model = SalonImage
    extra = 1

class SalonHolidayInline(admin.TabularInline):
    model = SalonHoliday
    extra = 1

@admin.register(Salon)
class SalonAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "owner", "city", "phone", "is_active", "created_at")
    list_filter = ("city", "is_active", "state")
    search_fields = ("name", "city", "phone", "owner__username")
    inlines = [SalonImageInline, SalonHolidayInline]
    raw_id_fields = ("owner",)
    date_hierarchy = "created_at"

@admin.register(SalonImage)
class SalonImageAdmin(admin.ModelAdmin):
    list_display = ("id", "salon", "created_at")
    list_filter = ("salon",)
    raw_id_fields = ("salon",)

@admin.register(SalonHoliday)
class SalonHolidayAdmin(admin.ModelAdmin):
    list_display = ("id", "salon", "date", "reason")
    list_filter = ("salon", "date")
    search_fields = ("salon__name", "reason")
    raw_id_fields = ("salon",)
    date_hierarchy = "date"