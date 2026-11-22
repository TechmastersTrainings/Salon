import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import { initNativeApp } from './services/nativeService';

// Layout
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import SessionWarning from './components/common/SessionWarning';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import SalonDetail from './pages/SalonDetail';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import BookingHistory from './pages/customer/BookingHistory';

// Legal & Compliance Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CancellationRefundPolicy from './pages/legal/CancellationRefundPolicy';
import SecurityTrust from './pages/legal/SecurityTrust';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerSalonManagement from './pages/owner/SalonManagement';
import OwnerStaffManagement from './pages/owner/StaffManagement';
import OwnerServiceManagement from './pages/owner/ServiceManagement';
import OwnerWallet from './pages/owner/Wallet';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUserManagement from './pages/admin/UserManagement';
import AdminOwnerApprovals from './pages/admin/OwnerApprovals';
import AdminSalonManagement from './pages/admin/SalonManagement';
import AdminServices from './pages/admin/AdminServices';
import AdminPaymentManagement from './pages/admin/PaymentManagement';
import AdminWalletManagement from './pages/admin/WalletManagement';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

// Protected Route Components
import ProtectedRoute from './components/common/ProtectedRoute';
import AuthRedirect from './components/common/AuthRedirect';
import AdminRoute from './components/common/AdminRoute';

function NativeBridge() {
  const navigate = useNavigate();
  useEffect(() => {
    initNativeApp(navigate);
  }, [navigate]);
  return null;
}

function App() {
  const { checkAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <NativeBridge />
      <PwaInstallPrompt />
      <Toaster position="top-right" />
      
      {user && <SessionWarning />}
      
      <Routes>
        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/owners" element={<AdminOwnerApprovals />} />
            <Route path="/admin/salons" element={<AdminSalonManagement />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/payments" element={<AdminPaymentManagement />} />
            <Route path="/admin/wallets" element={<AdminWalletManagement />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Main Layout Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="salon/:id" element={<SalonDetail />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="cancellation-policy" element={<CancellationRefundPolicy />} />
          <Route path="security" element={<SecurityTrust />} />
          
          <Route path="login" element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          } />
          <Route path="register" element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          } />

          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="booking/:salonId" element={<Booking />} />
            <Route path="bookings" element={<BookingHistory />} />
            
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="salons/manage" element={<OwnerSalonManagement />} />
            <Route path="staff" element={<OwnerStaffManagement />} />
            <Route path="services" element={<OwnerServiceManagement />} />
            <Route path="wallet" element={<OwnerWallet />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;