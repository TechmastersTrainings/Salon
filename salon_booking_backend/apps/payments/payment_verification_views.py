import razorpay
import logging
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.bookings.models import Appointment
from .models import Payment

logger = logging.getLogger(__name__)


class CreateRazorpayOrderView(APIView):
    """Create Razorpay order for appointment"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        appointment_id = request.data.get("appointment_id")

        if not appointment_id:
            return Response(
                {"error": "appointment_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment = get_object_or_404(
            Appointment,
            id=appointment_id,
            customer=request.user
        )

        # Check if payment already exists
        if hasattr(appointment, 'payment'):
            return Response(
                {"error": "Payment already exists for this appointment"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Initialize Razorpay client
        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        # Create order
        order_amount = int(appointment.service.price * 100)  # Convert to paise
        order_currency = 'INR'
        order_receipt = f'appointment_{appointment.id}'

        try:
            razorpay_order = client.order.create({
                'amount': order_amount,
                'currency': order_currency,
                'receipt': order_receipt,
                'payment_capture': 1  # Auto capture
            })

            # Create payment record
            payment = Payment.objects.create(
                appointment=appointment,
                amount=appointment.service.price,
                method="upi",  # Default, will be updated during verification
                transaction_id=f"temp_{appointment.id}",
                order_id=razorpay_order['id'],
                status="initiated",
                payment_response={'razorpay_order': razorpay_order}
            )

            return Response({
                'order_id': razorpay_order['id'],
                'amount': order_amount,
                'currency': order_currency,
                'key_id': settings.RAZORPAY_KEY_ID,
                'payment_id': payment.id
            })

        except razorpay.errors.BadRequestError as e:
            logger.error(f"Razorpay order creation failed: {str(e)}")
            return Response(
                {"error": "Failed to create payment order"},
                status=status.HTTP_400_BAD_REQUEST
            )


class VerifyPaymentView(APIView):
    """Verify Razorpay payment signature"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")
        payment_id = request.data.get("payment_id")

        # Validate required fields
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_id]):
            return Response(
                {"error": "Missing required fields"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get payment record
            payment = Payment.objects.get(
                id=payment_id,
                appointment__customer=request.user
            )

            # Initialize Razorpay client
            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            # Verify signature
            params_dict = {
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature
            }

            client.utility.verify_payment_signature(params_dict)

            # Update payment status
            payment.mark_success(
                transaction_id=razorpay_payment_id,
                payment_details={
                    'razorpay_order_id': razorpay_order_id,
                    'razorpay_signature': razorpay_signature,
                    'verified_at': timezone.now().isoformat()
                }
            )

            return Response({
                "message": "Payment successful and appointment confirmed",
                "payment_id": payment.id,
                "transaction_id": payment.transaction_id,
                "appointment_id": payment.appointment.id
            })

        except Payment.DoesNotExist:
            return Response(
                {"error": "Invalid payment ID"},
                status=status.HTTP_404_NOT_FOUND
            )
        except razorpay.errors.SignatureVerificationError:
            # Mark payment as failed
            if 'payment' in locals():
                payment.mark_failed("Signature verification failed")
            return Response(
                {"error": "Payment verification failed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Payment verification error: {str(e)}")
            return Response(
                {"error": "Payment verification failed"},
                status=status.HTTP_400_BAD_REQUEST
            )


class PaymentStatusView(APIView):
    """Check payment status"""
    permission_classes = [IsAuthenticated]

    def get(self, request, payment_id):
        payment = get_object_or_404(
            Payment,
            id=payment_id,
            appointment__customer=request.user
        )

        return Response({
            'payment_id': payment.id,
            'status': payment.status,
            'amount': str(payment.amount),
            'transaction_id': payment.transaction_id,
            'paid_at': payment.paid_at
        })