from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Custom user manager where email is the unique identifier"""

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a user with the given email and password."""
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)

        # Auto-generate username from email
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        while self.model.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        extra_fields['username'] = username
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = (
        ("customer", "Customer"),
        ("owner", "Salon Owner"),
        ("admin", "Admin"),
        ("staff", "Staff"),
    )

    username = models.CharField(max_length=150, unique=True, blank=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="customer")
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    profile_image = models.ImageField(upload_to="profiles/", null=True, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    is_owner_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]

    def __str__(self):
        return f"{self.email} ({self.role})"