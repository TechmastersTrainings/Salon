#C:\Users\sachi\PycharmProjects\Saloon\salon_booking_backend\core\security.py
from rest_framework.throttling import UserRateThrottle
class BookingThrottle(UserRateThrottle):

    scope = "booking"