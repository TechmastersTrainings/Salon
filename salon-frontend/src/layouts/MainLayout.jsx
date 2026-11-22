import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MobileBottomBar from '../components/common/MobileBottomBar';
import { useAuthStore } from '../store/authStore';

const MainLayout = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#292966] text-white">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-grow pb-16 md:pb-0 bg-[#292966]">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
};

export default MainLayout;
