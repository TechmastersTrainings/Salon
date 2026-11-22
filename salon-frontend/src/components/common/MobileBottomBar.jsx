import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User, Store, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { triggerHaptic } from '../../services/nativeService';

const MobileBottomBar = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const pathname = location.pathname;

  // Determine active states
  const isHome = pathname === '/';
  const isSearch = pathname.startsWith('/search') || pathname.startsWith('/salon/');
  const isBookings = pathname.startsWith('/bookings') || pathname.startsWith('/booking/');
  
  let accountPath = '/profile';
  let accountLabel = 'Profile';
  let AccountIcon = User;
  let isAccount = pathname.startsWith('/profile');

  if (user?.role === 'owner') {
    accountPath = '/dashboard';
    accountLabel = 'Studio';
    AccountIcon = Store;
    isAccount = pathname.startsWith('/dashboard') || pathname.startsWith('/salons') || pathname.startsWith('/services') || pathname.startsWith('/staff') || pathname.startsWith('/wallet');
  } else if (user?.role === 'admin') {
    accountPath = '/admin';
    accountLabel = 'Admin';
    AccountIcon = Shield;
    isAccount = pathname.startsWith('/admin');
  } else if (!user) {
    accountPath = '/login';
    accountLabel = 'Sign In';
    AccountIcon = User;
    isAccount = pathname.startsWith('/login') || pathname.startsWith('/register');
  }

  const tabs = [
    { label: 'Home', path: '/', icon: Home, active: isHome },
    { label: 'Explore', path: '/search', icon: Search, active: isSearch },
    { label: 'Bookings', path: user ? '/bookings' : '/login?redirect=/bookings', icon: Calendar, active: isBookings },
    { label: accountLabel, path: accountPath, icon: AccountIcon, active: isAccount },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-ivory/95 backdrop-blur-md border-t border-line shadow-[0_-8px_24px_-12px_rgba(60,40,30,0.18)] pb-[max(env(safe-area-inset-bottom),8px)] pt-2"
    >
      <div className="flex items-center justify-around max-w-md mx-auto px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.active;
          return (
            <Link
              key={tab.label}
              to={tab.path}
              onClick={() => triggerHaptic()}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 relative ${
                isActive ? 'text-rose-600' : 'text-muted hover:text-ink'
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} className={isActive ? 'text-rose-600' : 'text-muted'} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-ink shadow-none" />
                )}
              </div>
              <span className={`text-[10px] font-poppins mt-1 tracking-tight ${
                isActive ? 'font-bold text-rose-600' : 'font-medium text-muted'
              }`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomBar;
