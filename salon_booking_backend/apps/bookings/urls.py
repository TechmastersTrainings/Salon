from django.urls import path
from .views import (
    AppointmentListView,
    AppointmentDetailView,
    CancelAppointmentView,
    CustomerBookingHistoryView,
    AvailableSlotsView
)

urlpatterns = [
    path("", AppointmentListView.as_view(), name="appointment-list"),
    path("<int:pk>/", AppointmentDetailView.as_view(), name="appointment-detail"),
    path("<int:pk>/cancel/", CancelAppointmentView.as_view(), name="cancel-appointment"),
    path("history/", CustomerBookingHistoryView.as_view(), name="booking-history"),
    path("available-slots/", AvailableSlotsView.as_view(), name="available-slots"),
]