from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings
from django.utils import timezone
from apps.bookings.models import Appointment

class Payment(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("success", "Success"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
        ("initiated", "Initiated"),
    )

    METHOD_CHOICES = (
        ("upi", "UPI"),
        ("card", "Card"),
        ("netbanking", "Net Banking"),
        ("cash", "Cash"),
        ("wallet", "Wallet"),
    )

    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name="payment"
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=10, default="INR")
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    transaction_id = models.CharField(max_length=255, unique=True, db_index=True)
    order_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    payment_response = models.JSONField(default=dict, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["appointment", "status"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.transaction_id} - {self.status}"

    def mark_success(self, transaction_id, payment_details=None):
        """Mark payment as successful"""
        from django.utils import timezone
        self.status = "success"
        self.transaction_id = transaction_id
        self.paid_at = timezone.now()
        if payment_details:
            self.payment_response.update(payment_details)
        self.save()

        # Confirm appointment
        self.appointment.status = "confirmed"
        self.appointment.save()

    def mark_failed(self, error_details=None):
        """Mark payment as failed"""
        self.status = "failed"
        if error_details:
            self.payment_response.update({"error": error_details})
        self.save()

    def mark_refunded(self, refund_details=None):
        """Mark payment as refunded"""
        self.status = "refunded"
        if refund_details:
            self.payment_response.update({"refund": refund_details})
        self.save()


# Add to existing apps/payments/models.py - after Payment class

class Wallet(models.Model):
    """Wallet for salon owners to prepay for bookings"""
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wallet",
        limit_choices_to={'role': 'owner'}
    )
    balance = models.IntegerField(default=0, help_text="Current credit balance (1 credit = 1 booking)")
    total_recharged = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_bookings_used = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    last_recharged_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['owner', 'is_active']),
        ]

    def __str__(self):
        return f"{self.owner.username}'s wallet - {self.balance} credits"

    def has_sufficient_balance(self, credits_needed=3):
        return self.balance >= credits_needed

    def deduct_booking(self, booking):
        """Deduct 3 credits for a booking"""
        if self.balance >= 3:
            self.balance -= 3
            self.total_bookings_used += 1
            self.save()

            WalletTransaction.objects.create(
                wallet=self,
                amount=3,
                credits=-3,
                type='debit',
                description=f'Booking #{booking.id} - {booking.customer.username}',
                booking=booking
            )
            return True
        return False

    def add_credits(self, amount_paid, credits_added, transaction_id):
        """Add credits after recharge"""
        self.balance += credits_added
        self.total_recharged += amount_paid
        self.last_recharged_at = timezone.now()
        self.save()

        WalletTransaction.objects.create(
            wallet=self,
            amount=amount_paid,
            credits=credits_added,
            type='credit',
            description=f'Recharge - {transaction_id}'
        )

class WalletTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('credit', 'Credit'),
        ('debit', 'Debit'),
        ('refund', 'Refund'),
        ('bonus', 'Bonus'),
    )

    wallet = models.ForeignKey(
        Wallet,
        on_delete=models.CASCADE,
        related_name="transactions"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # in rupees
    credits = models.IntegerField()  # positive for credit, negative for debit
    type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    description = models.CharField(max_length=255)
    booking = models.ForeignKey(
        'bookings.Appointment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="wallet_transactions"
    )
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['wallet', 'created_at']),
            models.Index(fields=['booking']),
        ]

    def __str__(self):
        return f"{self.wallet.owner.username} - {self.type} - {self.credits} credits"