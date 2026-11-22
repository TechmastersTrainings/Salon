# C:\Users\sachi\PycharmProjects\Saloon\salon_booking_backend\core\security.py
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

class BookingThrottle(UserRateThrottle):
    scope = "booking"

class AuthAnonThrottle(AnonRateThrottle):
    scope = "auth"
