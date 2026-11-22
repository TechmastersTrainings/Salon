from django.urls import path
from .views import GlobalSearchView
from .nearby_views import NearbySalonView

urlpatterns = [
    path("global/", GlobalSearchView.as_view(), name="global-search"),
    path("nearby/", NearbySalonView.as_view(), name="nearby-salons"),
]