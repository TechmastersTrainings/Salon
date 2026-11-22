from django.urls import path
from .views import UserListView, UserDetailView, RegisterView, LoginView, ApproveOwnerView

urlpatterns = [
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("users/<int:pk>/approve/", ApproveOwnerView.as_view(), name="approve-owner"),  # New endpoint
]