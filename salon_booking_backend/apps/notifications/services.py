from .models import Notification
from django.utils import timezone
from django.db.models import Q


def create_notification(notification_type, message, user=None, priority="medium", data=None):
    """Create a new notification"""
    notification = Notification.objects.create(
        type=notification_type,
        message=message,
        user=user,
        priority=priority,
        data=data or {}
    )
    return notification


def notify_owner_pending_approval(owner):
    """Notify admin about pending owner approval"""
    from django.contrib.auth import get_user_model
    User = get_user_model()

    # Notify all admins
    admins = User.objects.filter(role='admin', is_active=True)
    for admin in admins:
        create_notification(
            notification_type="owner_pending_approval",
            message=f"New owner registration pending: {owner.username} ({owner.email})",
            user=admin,
            priority="high",
            data={"owner_id": owner.id, "owner_email": owner.email}
        )


def notify_owner_approved(owner):
    """Notify owner that their account is approved"""
    create_notification(
        notification_type="owner_approved",
        message="Your salon owner account has been approved! You can now create your salon.",
        user=owner,
        priority="high"
    )


def notify_new_booking(booking):
    """Notify owner about new booking"""
    create_notification(
        notification_type="new_booking",
        message=f"New booking for {booking.service.name} on {booking.appointment_date} at {booking.appointment_time}",
        user=booking.salon.owner,
        priority="medium",
        data={
            "booking_id": booking.id,
            "customer_name": booking.customer.username,
            "service": booking.service.name,
            "date": str(booking.appointment_date),
            "time": str(booking.appointment_time)
        }
    )


def notify_wallet_low_balance(owner, balance):
    """Notify owner when wallet balance is low"""
    create_notification(
        notification_type="wallet_low_balance",
        message=f"Your wallet balance is low: {balance} credits. Recharge now to continue accepting bookings.",
        user=owner,
        priority="high",
        data={"balance": balance, "credits_needed": 30 - balance}
    )


def notify_wallet_recharged(owner, amount, credits):
    """Notify owner after successful wallet recharge"""
    create_notification(
        notification_type="wallet_recharged",
        message=f"Wallet recharged with ₹{amount} (+{credits} credits)",
        user=owner,
        priority="medium",
        data={"amount": amount, "credits": credits}
    )


def notify_booking_reminder(booking):
    """Send reminder to customer before booking"""
    create_notification(
        notification_type="booking_reminder",
        message=f"Reminder: Your booking at {booking.salon.name} for {booking.service.name} is tomorrow at {booking.appointment_time}",
        user=booking.customer,
        priority="medium",
        data={
            "booking_id": booking.id,
            "salon_name": booking.salon.name,
            "date": str(booking.appointment_date),
            "time": str(booking.appointment_time)
        }
    )