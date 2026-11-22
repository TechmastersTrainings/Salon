from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class AccountsSecurityAndUnitTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create regular customer
        self.customer = User.objects.create_user(
            email="regular.customer@makemyhair.com",
            password="SecureCustomerPass123!",
            role="customer",
            first_name="Alice",
            last_name="Customer",
            phone="+919811122233"
        )

        # Create regular customer B
        self.customer_b = User.objects.create_user(
            email="bob.customer@makemyhair.com",
            password="SecureCustomerPass123!",
            role="customer",
            first_name="Bob",
            last_name="Customer",
            phone="+919811122244"
        )

        # Create platform admin
        self.admin_user = User.objects.create_superuser(
            email="platform.admin@makemyhair.com",
            password="SecureAdminPass123!",
            role="admin",
            first_name="Admin",
            last_name="Supervisor"
        )

    def test_privilege_escalation_registration_blocked(self):
        """SECURITY TEST: Malicious users must NOT be able to register as 'admin' or 'staff'"""
        payload = {
            "email": "hacker.admin@makemyhair.com",
            "password": "HackerPassword123!",
            "confirm_password": "HackerPassword123!",
            "phone": "+919800099999",
            "role": "admin"
        }
        response = self.client.post("/api/accounts/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(email="hacker.admin@makemyhair.com").exists())

    def test_customer_registration_success(self):
        """Verify normal customer self-registration succeeds"""
        payload = {
            "email": "new.member@makemyhair.com",
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!",
            "phone": "+919800055555",
            "role": "customer"
        }
        response = self.client.post("/api/accounts/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email="new.member@makemyhair.com")
        self.assertEqual(user.role, "customer")
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_owner_registration_requires_admin_approval(self):
        """Owner registration must set is_owner_approved=False by default"""
        payload = {
            "email": "candidate.salon@makemyhair.com",
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!",
            "phone": "+919800044444",
            "role": "owner"
        }
        response = self.client.post("/api/accounts/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        owner = User.objects.get(email="candidate.salon@makemyhair.com")
        self.assertEqual(owner.role, "owner")
        self.assertFalse(owner.is_owner_approved)

    def test_mass_assignment_profile_escalation_blocked(self):
        """SECURITY TEST: Normal user cannot escalate their role or approve themselves via profile updates"""
        self.client.force_authenticate(user=self.customer)
        response = self.client.patch(
            f"/api/accounts/users/{self.customer.id}/",
            {"role": "admin", "is_owner_approved": True, "phone": "+919999888877"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.customer.refresh_from_db()
        # Phone should update, but role and is_owner_approved MUST remain un-escalated
        self.assertEqual(self.customer.phone, "+919999888877")
        self.assertEqual(self.customer.role, "customer")
        self.assertFalse(self.customer.is_owner_approved)

    def test_user_directory_enumeration_blocked_for_customers(self):
        """SECURITY TEST: Normal customers cannot list all users in the system"""
        self.client.force_authenticate(user=self.customer)
        response = self.client.get("/api/accounts/users/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return empty results for non-admin
        results = response.data.get("results", response.data)
        self.assertEqual(len(results), 0)
        self.assertEqual(response.data.get("count", 0), 0)

        # Admin should receive all users
        self.client.force_authenticate(user=self.admin_user)
        admin_response = self.client.get("/api/accounts/users/")
        self.assertEqual(admin_response.status_code, status.HTTP_200_OK)
        admin_results = admin_response.data.get("results", admin_response.data)
        self.assertGreaterEqual(len(admin_results), 3)

    def test_jwt_authentication_flow(self):
        """Verify JWT login returns access and refresh tokens"""
        response = self.client.post("/api/accounts/login/", {
            "email": "regular.customer@makemyhair.com",
            "password": "SecureCustomerPass123!"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], "regular.customer@makemyhair.com")
