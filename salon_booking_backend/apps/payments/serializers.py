from rest_framework import serializers
from .models import Payment
from apps.bookings.serializers import AppointmentSerializer

class PaymentSerializer(serializers.ModelSerializer):
    appointment_details = AppointmentSerializer(source='appointment', read_only=True)
    customer_name = serializers.CharField(source='appointment.customer.username', read_only=True)
    salon_name = serializers.CharField(source='appointment.salon.name', read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id", "appointment", "appointment_details", "amount", "currency",
            "method", "transaction_id", "order_id", "status", "payment_response",
            "paid_at", "customer_name", "salon_name", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at", "payment_response"]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        return value