from django.urls import path
from .views import PlatformStatsView

urlpatterns = [
    path('platform/', PlatformStatsView.as_view(), name='platform-stats'),
]