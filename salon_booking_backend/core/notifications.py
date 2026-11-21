#C:\Users\sachi\PycharmProjects\Saloon\salon_booking_backend\core\notifications.py
from django.core.mail import send_mail
from django.conf import settings

def send_booking_confirmation_email(user,appointment):
    subject="Salon Appointment Confirmed"
    message=f"Hello {user.username}, your appointment for {appointment.service.name} on {appointment.appointment_date} at {appointment.appointment_time} has been confirmed."
    send_mail(subject,message,settings.DEFAULT_FROM_EMAIL,[user.email],fail_silently=True)

def send_booking_cancel_email(user,appointment):
    subject="Salon Appointment Cancelled"
    message=f"Hello {user.username}, your appointment for {appointment.service.name} on {appointment.appointment_date} at {appointment.appointment_time} has been cancelled."
    send_mail(subject,message,settings.DEFAULT_FROM_EMAIL,[user.email],fail_silently=True)