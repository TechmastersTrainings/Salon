from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Appointment
from datetime import datetime


@receiver(post_save, sender=Appointment)
def handle_delay_notification(sender, instance, **kwargs):
    """
    If an appointment status changes to 'in_chair' (started) late,
    notify the next person in the queue.
    """
    if instance.status == "in_chair" and instance.actual_start_time:
        scheduled_dt = datetime.combine(instance.appointment_date, instance.appointment_time)

        # If started more than 5 mins late
        if instance.actual_start_time > scheduled_dt + timedelta(minutes=5):
            delay_mins = (instance.actual_start_time - scheduled_dt).seconds // 60

            # Find the NEXT person in line for this barber
            next_booking = Appointment.objects.filter(
                staff=instance.staff,
                appointment_date=instance.appointment_date,
                appointment_time__gt=instance.appointment_time,
                status="confirmed"
            ).first()

            if next_booking:
                # Logic to trigger WhatsApp/SMS
                send_delay_alert(next_booking.customer, delay_mins)


def send_delay_alert(user, minutes):
    # Integration with WhatsApp API goes here
    print(f"Alerting {user.username}: Barber is {minutes} mins late. Please adjust your arrival.")