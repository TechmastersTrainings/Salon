# MakeMyHair - Luxury Salon & Grooming Atelier Platform

A modern, full-stack appointment booking and atelier management platform engineered for luxury hair salons, grooming studios, and wellness ateliers.

---

## 🎨 Visual Identity & Theme

The user experience adopts a bespoke design system with a luminous periwinkle and deep royal indigo palette:
* **Background (`#292966`)**: Deep Midnight Royal Indigo base canvas
* **Surface Cards (`#5C5C99` / `#363675`)**: Elevated slate purple & indigo surface containers
* **Borders & Soft Accents (`#A3A3CC`)**: Subtle periwinkle slate dividers and chips
* **Highlights (`#CCCCFF`)**: Luminous lavender periwinkle accents for primary CTAs, stars, and glows
* **Typography (`#FFFFFF`)**: Pure White high-contrast typography across all screens

---

## 🏗️ Architecture & Tech Stack

* **Backend**: Django 4.x, Django REST Framework, JWT Authentication (`rest_framework_simplejwt`), SQLite / MySQL
* **Frontend**: React 18, Vite, Tailwind CSS, Zustand, Lucide Icons, Date-fns, Axios
* **Mobile App**: Capacitor 8 for cross-platform Android native builds (APK & Google Play Store AAB support)

---

## 🛡️ Role-Based Access Control

The platform enforces three distinct user tiers:

1. **Client / Customer (`role: 'customer'`)**
   * Explore verified salons and browse service menus.
   * Book appointments, choose specialists, and track status.
   * *Strictly restricted from creating or adding salon shops.*
2. **Salon Merchant (`role: 'owner'`)**
   * Access the **Partner Command Center**.
   * Manage studio details, address, photos, and working hours.
   * Configure treatment menus and schedule team specialists.
   * View live incoming client queue and track earnings.
3. **Platform Administrator (`role: 'admin'`)**
   * Oversee salons, approve merchant onboarding, and view platform metrics.

---

## 🚀 Quick Start Guide

### 1. Backend Setup (Django)

```bash
cd salon_booking_backend

# Create & activate virtual environment (optional)
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env
# Edit .env with your secret keys and database settings

# Run database migrations
python manage.py migrate

# Seed verified atelier & account data (optional)
python scripts/setup_real_data.py

# Launch development server
python manage.py runserver 8000
```

### 2. Frontend Setup (React + Vite)

```bash
cd salon-frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will run at `http://localhost:5173`.

### 3. Mobile Build (Capacitor Android)

```bash
cd salon-frontend

# Build web assets
npm run build

# Sync web assets to Android
npx cap sync android

# Open Android Studio project
npx cap open android
```

---

## 🔑 Default Accounts (Development / Testing)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Merchant** | `techmastersinnovations@gmail.com` | `Fri10Feb@2023` |
| **Customer** | `sachin@email.com` | `Fri10Feb@2023` |
| **Administrator** | `admin@makemyhair.com` | `Fri10Feb@2023` |
