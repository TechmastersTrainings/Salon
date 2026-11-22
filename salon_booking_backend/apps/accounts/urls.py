from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserListView, UserDetailView, RegisterView, LoginView, ApproveOwnerView

urlpatterns = [
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("users/<int:pk>/approve/", ApproveOwnerView.as_view(), name="approve-owner"),  # New endpoint
]