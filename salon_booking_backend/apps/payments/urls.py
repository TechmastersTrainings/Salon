from django.urls import path, include
from .views import PaymentListView, PaymentDetailView, RefundPaymentView
from .payment_verification_views import (
    CreateRazorpayOrderView,
    VerifyPaymentView,
    PaymentStatusView
)
from .wallet_views import (
    WalletDetailView,
    CreateRechargeOrderView,
    VerifyRechargeView,
    WalletStatusView
)

urlpatterns = [
    # Payment list and detail
    path("", PaymentListView.as_view(), name="payment-list"),
    path("<int:pk>/", PaymentDetailView.as_view(), name="payment-detail"),
    path("<int:payment_id>/status/", PaymentStatusView.as_view(), name="payment-status"),
    path("<int:payment_id>/refund/", RefundPaymentView.as_view(), name="refund-payment"),

    # Razorpay endpoints (keep existing)
    path("create-order/", CreateRazorpayOrderView.as_view(), name="create-order"),
    path("verify/", VerifyPaymentView.as_view(), name="verify-payment"),

    # NEW: Wallet endpoints
    path("wallet/", WalletDetailView.as_view(), name="wallet-detail"),
    path("wallet/recharge/", CreateRechargeOrderView.as_view(), name="wallet-recharge"),
    path("wallet/verify/", VerifyRechargeView.as_view(), name="wallet-verify"),
    path("wallet/status/", WalletStatusView.as_view(), name="wallet-status"),
]