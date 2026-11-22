from django.urls import path
from .views import (
    AdminNotificationListView,
    UserNotificationListView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
    UnreadCountView,
    DeleteNotificationView
)

urlpatterns = [
    # Admin endpoints
    path("admin/", AdminNotificationListView.as_view(), name="admin-notifications"),

    # User endpoints
    path("my/", UserNotificationListView.as_view(), name="my-notifications"),
    path("unread-count/", UnreadCountView.as_view(), name="unread-count"),
    path("<int:pk>/read/", MarkNotificationReadView.as_view(), name="mark-read"),
    path("read-all/", MarkAllNotificationsReadView.as_view(), name="mark-all-read"),
    path("<int:pk>/delete/", DeleteNotificationView.as_view(), name="delete-notification"),
]