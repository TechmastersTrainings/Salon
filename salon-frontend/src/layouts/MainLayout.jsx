import { useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MobileBottomBar from '../components/common/MobileBottomBar';
import { useAuthStore } from '../store/authStore';
import useScrollReveal from '../hooks/useScrollReveal';

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation();
  const rootRef = useRef(null);

  useScrollReveal(rootRef, pathname);

  return (
    <div ref={rootRef} className="min-h-screen flex flex-col bg-ivory text-ink">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-grow pb-16 md:pb-0 bg-ivory">
        {/* Re-keyed on route change so each page fades in */}
        <div key={pathname} className="animate-page">
          <Outlet />
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
};

export default MainLayout;
