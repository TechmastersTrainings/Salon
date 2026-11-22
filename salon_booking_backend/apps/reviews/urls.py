from django.urls import path
from .views import (
    CreateReviewView,
    SalonReviewsView,
    CustomerReviewsView,
    ReviewDetailView,
    SalonRatingView
)

urlpatterns = [
    path("create/", CreateReviewView.as_view(), name="create-review"),
    path("my-reviews/", CustomerReviewsView.as_view(), name="my-reviews"),
    path("<int:pk>/", ReviewDetailView.as_view(), name="review-detail"),
    path("salon/<int:salon_id>/", SalonReviewsView.as_view(), name="salon-reviews"),
    path("salon/<int:salon_id>/rating/", SalonRatingView.as_view(), name="salon-rating"),
]