"""
BDD Test Runner & Scenario Step Definitions for MakeMyHair Platform
Executes Gherkin feature scenarios against Django REST Framework test client
"""

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


class SecurityBddScenarioTests(TestCase):
    """
    BDD Executable Test Specifications corresponding to
    tests_bdd/features/security_access_control.feature
    """

    def setUp(self):
        self.client = APIClient()

    # Scenario: Prevent Unauthorized Admin Self-Registration
    def test_bdd_scenario_prevent_admin_self_registration(self):
        # Given a guest attacker submitting registration details
        payload = {
            "email": "infiltrator@domain.com",
            "password": "AttackPassword!2026",
            "confirm_password": "AttackPassword!2026",
            "phone": "+919999000111",
            "role": "admin"
        }
        # When the attacker requests the role "admin"
        response = self.client.post("/api/accounts/register/", payload, format="json")

        # Then the platform rejects the registration with HTTP 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # And no admin account is created
        self.assertFalse(User.objects.filter(email="infiltrator@domain.com").exists())

    # Scenario: Prevent Mass Assignment Privilege Escalation
    def test_bdd_scenario_prevent_mass_assignment_profile_escalation(self):
        # Given an authenticated customer with role "customer"
        customer = User.objects.create_user(
            email="regular.patron@makemyhair.com",
            password="SecurePassword!2026",
            role="customer"
        )
        self.client.force_authenticate(user=customer)

        # When the customer submits a profile update with "role: admin" and "is_owner_approved: true"
        response = self.client.patch(
            f"/api/accounts/users/{customer.id}/",
            {"role": "admin", "is_owner_approved": True},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Then the user's role remains "customer"
        customer.refresh_from_db()
        self.assertEqual(customer.role, "customer")
        # And the user's approval status remains unapproved
        self.assertFalse(customer.is_owner_approved)

    # Scenario: Prevent Insecure Direct Object Reference on Appointments
    def test_bdd_scenario_prevent_idor_appointment_tampering(self):
        # Given Customer Alice has a confirmed salon booking
        alice = User.objects.create_user(
            email="alice.client@makemyhair.com",
            password="SecurePass!2026",
            role="customer"
        )
        bob = User.objects.create_user(
            email="bob.client@makemyhair.com",
            password="SecurePass!2026",
            role="customer"
        )
        owner = User.objects.create_user(
            email="atelier.owner@makemyhair.com",
            password="SecurePass!2026",
            role="owner",
            is_owner_approved=True
        )
        salon = Salon.objects.create(
            owner=owner,
            name="BDD Test Salon",
            city="Bangalore",
            phone="+919876543210",
            address="Koramangala",
            opening_time=time(9, 0),
            closing_time=time(21, 0),
            is_active=True
        )
        service = Service.objects.create(
            salon=salon,
            name="Cut & Style",
            duration_minutes=30,
            price=1000.00
        )
        alice_appt = Appointment.objects.create(
            customer=alice,
            salon=salon,
            service=service,
            appointment_date=date.today() + timedelta(days=3),
            appointment_time=time(10, 0),
            status="confirmed",
            notes="Alice initial booking"
        )

        # And Customer Bob is authenticated on the platform
        self.client.force_authenticate(user=bob)

        # When Bob attempts to inspect or tamper with Alice's appointment record
        get_response = self.client.get(f"/api/bookings/{alice_appt.id}/")
        patch_response = self.client.patch(
            f"/api/bookings/{alice_appt.id}/",
            {"notes": "Hacked Notes"},
            format="json"
        )

        # Then the platform returns HTTP 404 Not Found
        self.assertEqual(get_response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(patch_response.status_code, status.HTTP_404_NOT_FOUND)

        # And Alice's appointment remains unmodified
        alice_appt.refresh_from_db()
        self.assertEqual(alice_appt.notes, "Alice initial booking")

    # Scenario: Prevent Customer-Initiated Payment Refunds
    def test_bdd_scenario_prevent_customer_initiated_refunds(self):
        # Given a customer with a successful booking payment
        customer = User.objects.create_user(
            email="paying.client@makemyhair.com",
            password="SecurePass!2026",
            role="customer"
        )
        owner = User.objects.create_user(
            email="salon.merchant@makemyhair.com",
            password="SecurePass!2026",
            role="owner",
            is_owner_approved=True
        )
        salon = Salon.objects.create(
            owner=owner,
            name="Merchant Salon",
            city="Mumbai",
            phone="+919876500000",
            address="Colaba",
            opening_time=time(9, 0),
            closing_time=time(21, 0),
            is_active=True
        )
        service = Service.objects.create(
            salon=salon,
            name="Shave",
            duration_minutes=20,
            price=500.00
        )
        appt = Appointment.objects.create(
            customer=customer,
            salon=salon,
            service=service,
            appointment_date=date.today() + timedelta(days=2),
            appointment_time=time(15, 0),
            status="confirmed"
        )
        payment = Payment.objects.create(
            appointment=appt,
            amount=500.00,
            method="upi",
            transaction_id="TXN_BDD_REFUND_CHECK",
            status="success"
        )

        # When the customer directly invokes the refund payment endpoint
        self.client.force_authenticate(user=customer)
        response = self.client.post(
            f"/api/payments/{payment.id}/refund/",
            {"reason": "Attempt refund"},
            format="json"
        )

        # Then the platform returns HTTP 403 Forbidden
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # And the payment status remains "success"
        payment.refresh_from_db()
        self.assertEqual(payment.status, "success")
