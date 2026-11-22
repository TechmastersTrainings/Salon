from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, time, timedelta

from apps.salons.models import Salon
from apps.services.models import Service
from apps.staff.models import Staff
from apps.bookings.models import Appointment
from apps.payments.models import Payment

User = get_user_model()


class PaymentsSecurityAndUnitTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Customer
        self.customer = User.objects.create_user(
            email="payer.customer@makemyhair.com",
            password="SecurePass123!",
            role="customer"
        )

        # Attacker Customer
        self.attacker = User.objects.create_user(
            email="malicious.customer@makemyhair.com",
            password="SecurePass123!",
            role="customer"
        )

        # Salon Owner
        self.owner = User.objects.create_user(
            email="owner.merchant@makemyhair.com",
            password="SecurePass123!",
            role="owner",
            is_owner_approved=True
        )

        # Salon
        self.salon = Salon.objects.create(
            owner=self.owner,
            name="Apex Grooming Lounge",
            phone="+919876543299",
            email="apex@makemyhair.com",
            address="Church Street",
            city="Bangalore",
            state="Karnataka",
            postal_code="560001",
            latitude=12.9750,
            longitude=77.6000,
            opening_time=time(9, 0),
            closing_time=time(21, 0),
            is_active=True
        )

        # Service
        self.service = Service.objects.create(
            salon=self.salon,
            name="Luxury Beard Trim",
            duration_minutes=30,
            price=800.00,
            is_active=True
        )

        # Appointment
        self.appointment = Appointment.objects.create(
            customer=self.customer,
            salon=self.salon,
            service=self.service,
            appointment_date=date.today() + timedelta(days=1),
            appointment_time=time(14, 0),
            status="confirmed"
        )

        # Payment record
        self.payment = Payment.objects.create(
            appointment=self.appointment,
            amount=800.00,
            method="upi",
            transaction_id="TXN_TEST_998877",
            status="success"
        )

    def test_refund_access_control_denied_for_customers(self):
        """SECURITY TEST: A customer cannot trigger refund for an appointment"""
        self.client.force_authenticate(user=self.customer)
        response = self.client.post(
            f"/api/payments/{self.payment.id}/refund/",
            {"reason": "Customer attempt to force refund"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, "success")

    def test_payment_detail_idor_denied_for_unrelated_user(self):
        """SECURITY TEST (BOLA): An attacker cannot read payment details of another customer"""
        self.client.force_authenticate(user=self.attacker)
        response = self.client.get(f"/api/payments/{self.payment.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_owner_can_issue_refund_for_their_salon_payment(self):
        """Salon owner can legitimately refund payment for their own salon"""
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(
            f"/api/payments/{self.payment.id}/refund/",
            {"reason": "Customer rescheduled with mutual agreement"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, "refunded")
