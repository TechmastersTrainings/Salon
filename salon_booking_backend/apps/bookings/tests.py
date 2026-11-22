from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, time, timedelta

from apps.salons.models import Salon
from apps.services.models import Service
from apps.staff.models import Staff, StaffSchedule
from apps.bookings.models import Appointment

User = get_user_model()


class BookingsSecurityAndUnitTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Customer A
        self.customer_a = User.objects.create_user(
            email="cust.a@makemyhair.com",
            password="SecurePass123!",
            role="customer",
            first_name="Customer",
            last_name="A"
        )

        # Customer B
        self.customer_b = User.objects.create_user(
            email="cust.b@makemyhair.com",
            password="SecurePass123!",
            role="customer",
            first_name="Customer",
            last_name="B"
        )

        # Salon Owner
        self.owner = User.objects.create_user(
            email="owner.salon@makemyhair.com",
            password="SecurePass123!",
            role="owner",
            is_owner_approved=True
        )

        # Salon
        self.salon = Salon.objects.create(
            owner=self.owner,
            name="Atelier Hairstyle",
            phone="+919876543210",
            email="salon@makemyhair.com",
            address="Brigade Road",
            city="Bangalore",
            state="Karnataka",
            postal_code="560025",
            latitude=12.9716,
            longitude=77.5946,
            opening_time=time(9, 0),
            closing_time=time(21, 0),
            is_active=True
        )

        # Service
        self.service = Service.objects.create(
            salon=self.salon,
            name="Signature Scissor Cut",
            duration_minutes=45,
            price=1200.00,
            is_active=True
        )

        # Staff User & Staff
        self.staff_user = User.objects.create_user(
            email="stylist.leo@makemyhair.com",
            password="SecurePass123!",
            role="staff",
            first_name="Leo",
            last_name="Barber"
        )
        self.staff = Staff.objects.create(
            user=self.staff_user,
            salon=self.salon,
            experience_years=5,
            is_active=True
        )
        self.staff.services.add(self.service)

        # Staff Schedule for next week
        self.target_date = date.today() + timedelta(days=2)
        StaffSchedule.objects.create(
            staff=self.staff,
            day_of_week=self.target_date.weekday(),
            start_time=time(9, 0),
            end_time=time(19, 0),
            is_off=False
        )

        # Customer A's Appointment
        self.appt_a = Appointment.objects.create(
            customer=self.customer_a,
            salon=self.salon,
            staff=self.staff,
            service=self.service,
            appointment_date=self.target_date,
            appointment_time=time(11, 0),
            status="confirmed"
        )

    def test_idor_customer_cannot_view_another_customer_appointment(self):
        """SECURITY TEST (BOLA/IDOR): Customer B cannot view Customer A's appointment details"""
        self.client.force_authenticate(user=self.customer_b)
        response = self.client.get(f"/api/bookings/{self.appt_a.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Customer A should be able to view their own appointment
        self.client.force_authenticate(user=self.customer_a)
        response_a = self.client.get(f"/api/bookings/{self.appt_a.id}/")
        self.assertEqual(response_a.status_code, status.HTTP_200_OK)
        self.assertEqual(response_a.data["id"], self.appt_a.id)

    def test_idor_customer_cannot_modify_another_customer_appointment(self):
        """SECURITY TEST: Customer B cannot alter Customer A's appointment date/time/notes"""
        self.client.force_authenticate(user=self.customer_b)
        response = self.client.patch(
            f"/api/bookings/{self.appt_a.id}/",
            {"notes": "Malicious Tampering Attempt"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.appt_a.refresh_from_db()
        self.assertNotEqual(self.appt_a.notes, "Malicious Tampering Attempt")

    def test_customer_cannot_mark_appointment_completed(self):
        """SECURITY TEST: Customer cannot arbitrarily set their status to 'completed'"""
        self.client.force_authenticate(user=self.customer_a)
        response = self.client.patch(
            f"/api/bookings/{self.appt_a.id}/",
            {"status": "completed"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.appt_a.refresh_from_db()
        self.assertEqual(self.appt_a.status, "confirmed")

    def test_customer_can_cancel_own_appointment(self):
        """Customer can legitimately cancel their own appointment"""
        self.client.force_authenticate(user=self.customer_a)
        response = self.client.post(f"/api/bookings/{self.appt_a.id}/cancel/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.appt_a.refresh_from_db()
        self.assertEqual(self.appt_a.status, "cancelled")

    def test_double_booking_slot_collision_prevented(self):
        """Double booking the exact same staff and slot returns validation error"""
        self.client.force_authenticate(user=self.customer_b)
        payload = {
            "salon": self.salon.id,
            "staff": self.staff.id,
            "service": self.service.id,
            "appointment_date": str(self.target_date),
            "appointment_time": "11:00:00"
        }
        response = self.client.post("/api/bookings/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("appointment_time", str(response.data))
