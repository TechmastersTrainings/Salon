import os
import sys
import django

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.models import User
from apps.salons.models import Salon, SalonImage
from apps.services.models import Service
from apps.staff.models import Staff
from apps.payments.models import Wallet, WalletTransaction
from datetime import time

def setup_data():
    print("Initializing Clean Database Setup...")

    # Clear existing data to remove any dummy/partial records
    Service.objects.all().delete()
    Staff.objects.all().delete()
    Salon.objects.all().delete()
    User.objects.all().delete()
    Wallet.objects.all().delete()

    print("Existing records cleared.")

    PASSWORD = os.getenv("SEED_PASSWORD", "TemporaryPass123!")

    # 1. Create Customer Account
    customer = User.objects.create_user(
        email=os.getenv("SEED_CUSTOMER_EMAIL", "customer@makemyhair.com"),
        password=PASSWORD,
        role="customer",
        first_name="Test",
        last_name="Customer",
        phone="+919800011122",
        is_active=True
    )
    print(f"Customer created: {customer.email}")

    # 2. Create Salon Owner Account
    owner = User.objects.create_user(
        email=os.getenv("SEED_OWNER_EMAIL", "partner@makemyhair.com"),
        password=PASSWORD,
        role="owner",
        first_name="Salon",
        last_name="Partner",
        phone="+919876543210",
        is_owner_approved=True,
        is_active=True
    )
    print(f"Salon Owner created: {owner.email} (Approved)")

    # 3. Create Admin Account
    admin = User.objects.create_superuser(
        email=os.getenv("SEED_ADMIN_EMAIL", "admin@example.com"),
        password=PASSWORD,
        role="admin",
        first_name="Super",
        last_name="Admin",
        phone="+919999988888",
        is_active=True
    )
    print(f"Admin created: {admin.email}")

    # 4. Create Owner's Wallet
    wallet, _ = Wallet.objects.get_or_create(
        owner=owner,
        defaults={
            "balance": 5000,
            "total_recharged": 15000,
            "total_bookings_used": 0,
            "is_active": True
        }
    )
    print(f"Owner wallet initialized with {wallet.balance} credits.")

    # 5. Create 1 Real Salon for this Owner
    salon = Salon.objects.create(
        owner=owner,
        name="TechMasters Salon & Grooming Atelier",
        description="Flagship grooming studio offering bespoke haircuts, French balayage, beard sculpture, and organic scalp wellness therapies.",
        phone="+91 98765 43210",
        email=os.getenv("SEED_SALON_EMAIL", "salon@makemyhair.com"),
        address="Lavelle Road, Near UB City, Shantala Nagar",
        city="Bangalore",
        state="Karnataka",
        postal_code="560001",
        latitude=12.971600,
        longitude=77.594600,
        opening_time=time(9, 0),
        closing_time=time(21, 0),
        is_active=True
    )
    print(f"Salon created: {salon.name} (ID: {salon.id})")

    # 6. Create Services for this Salon
    services_data = [
        {"name": "Signature Royal Scissor Cut", "duration_minutes": 45, "price": 1200.00, "description": "Consultation, precision shear sculpting, hot towel wrap, and botanical styling."},
        {"name": "Beard Architecture & Hot Shave", "duration_minutes": 35, "price": 650.00, "description": "Crisp contouring, warm lather straight-razor shave, and sandalwood balm soothing."},
        {"name": "French Balayage & Gloss", "duration_minutes": 120, "price": 4500.00, "description": "Dimensional hand-painted highlights with ammonia-free conditioning gloss treatment."},
        {"name": "Scalp Detox Mist Therapy", "duration_minutes": 50, "price": 1800.00, "description": "Deep micro-mist cleansing, active peptide ampoule, and shiatsu pressure point massage."},
        {"name": "Keratin Silk Infusion", "duration_minutes": 90, "price": 3200.00, "description": "Intense restorative treatment that eliminates frizz and seals radiant gloss for 90 days."}
    ]

    created_services = []
    for s_data in services_data:
        srv = Service.objects.create(
            salon=salon,
            name=s_data["name"],
            duration_minutes=s_data["duration_minutes"],
            price=s_data["price"],
            description=s_data["description"],
            is_active=True
        )
        created_services.append(srv)
    print(f"Created {len(created_services)} services.")

    # 7. Create Specialists / Staff
    staff_profiles = [
        {"name": "Vikram", "last": "Mehta", "email": "vikram.stylist@makemyhair.com", "bio": "Master Stylist & Creative Director", "exp": 9},
        {"name": "Rhea", "last": "Sen", "email": "rhea.color@makemyhair.com", "bio": "Senior Colorist & Balayage Specialist", "exp": 7},
        {"name": "Kabir", "last": "Nair", "email": "kabir.barber@makemyhair.com", "bio": "Precision Barber & Grooming Artisan", "exp": 6}
    ]

    for sp in staff_profiles:
        staff_user = User.objects.create_user(
            email=sp["email"],
            password=PASSWORD,
            role="staff",
            first_name=sp["name"],
            last_name=sp["last"],
            is_active=True
        )
        staff_obj = Staff.objects.create(
            user=staff_user,
            salon=salon,
            bio=sp["bio"],
            experience_years=sp["exp"],
            is_active=True
        )
        staff_obj.services.set(created_services)
    print(f"Created {len(staff_profiles)} resident specialists.")

    print("\nDatabase seeded successfully:")
    print(f"1. Customer Account: {customer.email}")
    print(f"2. Salon Owner Account: {owner.email}")
    print(f"3. Administrator Account: {admin.email}")
    print(f"4. Salon: {salon.name} (5 Services, 3 Specialists)")
    print("Note: Set SEED_PASSWORD env var before running to configure seed passwords.")

if __name__ == '__main__':
    setup_data()

