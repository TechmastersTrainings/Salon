from django.urls import path
from .dashboard_views import SalonDashboardView
from .views import (
    SalonListView,
    SalonDetailView,
    SalonSearchView,
    NearbySalonView,
    CreateSalonView,
    OwnerSalonListView
)

urlpatterns = [
    path("", SalonListView.as_view(), name="salon-list"),
    path("search/", SalonSearchView.as_view(), name="salon-search"),
    path("search/nearby/", NearbySalonView.as_view(), name="salon-nearby"),
    path("create/", CreateSalonView.as_view(), name="create-salon"),
    path("my-salons/", OwnerSalonListView.as_view(), name="owner-salons"),
    path("<int:pk>/", SalonDetailView.as_view(), name="salon-detail"),
    path("<int:salon_id>/dashboard/", SalonDashboardView.as_view(), name="salon-dashboard"),
]