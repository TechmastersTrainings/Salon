from django.urls import path
from .views import (
    ServiceListView,
    ServiceDetailView,
    SalonServiceListView,
    CreateServiceView,
    UpdateServiceView,
    ToggleServiceStatusView
)

urlpatterns = [
    path("", ServiceListView.as_view(), name="service-list"),
    path("create/", CreateServiceView.as_view(), name="create-service"),
    path("<int:pk>/", ServiceDetailView.as_view(), name="service-detail"),
    path("<int:pk>/update/", UpdateServiceView.as_view(), name="update-service"),
    path("<int:pk>/toggle-status/", ToggleServiceStatusView.as_view(), name="toggle-service"),
    path("salon/<int:salon_id>/", SalonServiceListView.as_view(), name="salon-services"),
]