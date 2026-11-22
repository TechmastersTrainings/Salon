from django.contrib import admin
from .models import Staff, StaffSchedule

class StaffScheduleInline(admin.TabularInline):
    model = StaffSchedule
    extra = 7  # Show all 7 days

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "salon", "experience_years", "is_active", "created_at")
    list_filter = ("salon", "is_active", "salon__city")
    search_fields = ("user__username", "user__email", "salon__name")
    raw_id_fields = ("user", "salon")
    filter_horizontal = ("services",)
    inlines = [StaffScheduleInline]
    date_hierarchy = "created_at"

@admin.register(StaffSchedule)
class StaffScheduleAdmin(admin.ModelAdmin):
    list_display = ("id", "staff", "day_of_week", "start_time", "end_time", "is_off")
    list_filter = ("day_of_week", "is_off", "staff__salon")
    search_fields = ("staff__user__username", "staff__salon__name")
    raw_id_fields = ("staff",)