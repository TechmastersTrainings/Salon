from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Payment
from .serializers import PaymentSerializer

class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "customer":
            return Payment.objects.filter(appointment__customer=user)
        elif user.role == "owner":
            return Payment.objects.filter(appointment__salon__owner=user)
        elif user.role == "admin" or user.is_staff or user.is_superuser:
            return Payment.objects.all()
        return Payment.objects.none()

class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "customer":
            return Payment.objects.filter(appointment__customer=user)
        elif user.role == "owner":
            return Payment.objects.filter(appointment__salon__owner=user)
        elif user.role == "admin" or user.is_staff or user.is_superuser:
            return Payment.objects.all()
        return Payment.objects.none()

class RefundPaymentView(APIView):
    """Initiate refund for a payment"""
    permission_classes = [IsAuthenticated]

    def post(self, request, payment_id):
        # Only owners/admins can refund
        if request.user.role not in ['owner', 'admin'] and not request.user.is_staff and not request.user.is_superuser:
            return Response(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        if request.user.role == 'owner':
            payment = get_object_or_404(
                Payment,
                id=payment_id,
                appointment__salon__owner=request.user
            )
        else:
            payment = get_object_or_404(Payment, id=payment_id)

        if payment.status != 'success':
            return Response(
                {"error": "Only successful payments can be refunded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mark as refunded
        payment.mark_refunded({
            'refunded_by': request.user.id,
            'refunded_at': timezone.now().isoformat(),
            'reason': request.data.get('reason', '')
        })

        return Response({
            "message": "Refund initiated successfully",
            "payment_id": payment.id
        })