# apps/payments/wallet_views.py

import uuid
import io
import base64
try:
    import qrcode
    HAS_QRCODE = True
except ImportError:
    qrcode = None
    HAS_QRCODE = False
from django.utils import timezone
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Wallet, WalletTransaction, Payment


class WalletDetailView(APIView):
    """Get wallet balance and transaction history"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'owner':
            return Response(
                {"error": "Only salon owners have wallets"},
                status=status.HTTP_403_FORBIDDEN
            )

        wallet, created = Wallet.objects.get_or_create(owner=request.user)

        # Get recent transactions
        transactions = WalletTransaction.objects.filter(wallet=wallet)[:20]

        # Calculate stats
        total_spent = sum(t.amount for t in transactions if t.type == 'debit')

        return Response({
            'balance': wallet.balance,
            'total_recharged': float(wallet.total_recharged),
            'total_bookings_used': wallet.total_bookings_used,
            'total_spent': float(total_spent),
            'recent_transactions': [{
                'type': t.type,
                'credits': t.credits,
                'amount': float(t.amount),
                'description': t.description,
                'date': t.created_at
            } for t in transactions],
            'credit_value': 3,  # 1 credit = ₹3
        })


class CreateRechargeOrderView(APIView):
    """Create a recharge order for wallet"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'owner':
            return Response(
                {"error": "Only salon owners can recharge"},
                status=status.HTTP_403_FORBIDDEN
            )

        amount = request.data.get('amount')
        if not amount:
            return Response(
                {"error": "Amount is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            amount = float(amount)
            if amount < 50:
                return Response(
                    {"error": "Minimum recharge amount is ₹50"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {"error": "Invalid amount"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate credits (₹3 = 1 credit)
        credits = int(amount / 3)
        bonus_credits = 0

        # Add bonus for larger recharges
        if amount >= 1000:
            bonus_credits = 20
        elif amount >= 500:
            bonus_credits = 5

        total_credits = credits + bonus_credits

        # Create a payment record for this recharge
        transaction_id = f"RECHARGE{uuid.uuid4().hex[:12].upper()}"

        # Generate UPI QR code data
        upi_id = getattr(settings, 'UPI_ID', 'yourbusiness@okhdfcbank')
        upi_string = (
            f"upi://pay?pa={upi_id}"
            f"&pn={request.user.username}"
            f"&am={amount}"
            f"&cu=INR"
            f"&tn={transaction_id}"
        )

        # Generate QR code
        qr_base64 = ""
        if HAS_QRCODE and qrcode:
            try:
                qr = qrcode.QRCode(version=1, box_size=10, border=5)
                qr.add_data(upi_string)
                qr.make(fit=True)
                img = qr.make_image(fill_color="black", back_color="white")

                # Convert to base64
                buffer = io.BytesIO()
                img.save(buffer, format='PNG')
                qr_base64 = base64.b64encode(buffer.getvalue()).decode()
            except Exception:
                qr_base64 = ""

        return Response({
            'transaction_id': transaction_id,
            'amount': amount,
            'credits': credits,
            'bonus_credits': bonus_credits,
            'total_credits': total_credits,
            'upi_id': upi_id,
            'qr_code': f'data:image/png;base64,{qr_base64}',
            'expires_at': timezone.now() + timezone.timedelta(minutes=15)
        })


class VerifyRechargeView(APIView):
    """Verify and complete wallet recharge"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'owner':
            return Response(
                {"error": "Only salon owners can recharge"},
                status=status.HTTP_403_FORBIDDEN
            )

        transaction_id = request.data.get('transaction_id')
        amount = request.data.get('amount')

        if not transaction_id or not amount:
            return Response(
                {"error": "Transaction ID and amount required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            amount = float(amount)
        except ValueError:
            return Response(
                {"error": "Invalid amount"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate credits
        credits = int(amount / 3)
        bonus_credits = 0
        if amount >= 1000:
            bonus_credits = 20
        elif amount >= 500:
            bonus_credits = 5
        total_credits = credits + bonus_credits

        # Get or create wallet
        wallet, created = Wallet.objects.get_or_create(owner=request.user)

        # Add credits
        wallet.add_credits(amount, total_credits, transaction_id)

        return Response({
            'message': f'Wallet recharged successfully! Added {total_credits} credits',
            'new_balance': wallet.balance,
            'credits_added': total_credits,
            'amount_paid': amount
        })


class WalletStatusView(APIView):
    """Check if wallet has sufficient balance for booking"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'owner':
            return Response(
                {"error": "Only salon owners have wallets"},
                status=status.HTTP_403_FORBIDDEN
            )

        wallet, created = Wallet.objects.get_or_create(owner=request.user)

        return Response({
            'balance': wallet.balance,
            'can_book': wallet.balance >= 3,
            'bookings_possible': wallet.balance // 3,
            'low_balance': wallet.balance < 30,
            'credit_value': 3
        })