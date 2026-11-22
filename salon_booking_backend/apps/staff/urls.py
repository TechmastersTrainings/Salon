from django.urls import path

from .views import (
    StaffListView,
    StaffDetailView,
    SalonStaffListView,
    CreateStaffView, StaffServicesView,
)

from .schedule_views import (
    CreateStaffScheduleView,
    StaffScheduleListView,
    BulkCreateScheduleView,
    UpdateStaffScheduleView
)

from .dashboard_views import StaffDashboardView

urlpatterns = [
    # Staff management
    path("", StaffListView.as_view(), name="staff-list"),
    path("create/", CreateStaffView.as_view(), name="create-staff"),
    path("<int:pk>/", StaffDetailView.as_view(), name="staff-detail"),
    path("<int:pk>/services/", StaffServicesView.as_view(), name="staff-services"),

    # Salon specific
    path("salon/<int:salon_id>/", SalonStaffListView.as_view(), name="salon-staff"),

    # Schedule management
    path("schedule/", CreateStaffScheduleView.as_view(), name="create-schedule"),
    path("schedule/<int:pk>/", UpdateStaffScheduleView.as_view(), name="update-schedule"),
    path("<int:staff_id>/schedules/", StaffScheduleListView.as_view(), name="staff-schedules"),
    path("<int:staff_id>/schedules/bulk/", BulkCreateScheduleView.as_view(), name="bulk-schedules"),

    # Dashboard
    path("<int:staff_id>/dashboard/", StaffDashboardView.as_view(), name="staff-dashboard"),
]