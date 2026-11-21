import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import MobileBottomBar from '../components/common/MobileBottomBar';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  CreditCard, 
  Wallet,
  Scissors, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search, 
  ChevronDown, 
  BarChart3, 
  UserCog, 
  Home, 
  Shield, 
  Sparkles 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Salon Management', href: '/admin/salons', icon: Store },
    { name: 'Service Management', href: '/admin/services', icon: Scissors },
    { name: 'Owner Approvals', href: '/admin/owners', icon: UserCog },
    { name: 'Payment Management', href: '/admin/payments', icon: CreditCard },
    { name: 'Wallet Management', href: '/admin/wallets', icon: Wallet },
    { name: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#292966] text-white">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#1e1e4f] text-white z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-[rgba(163,163,204,0.12)]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-[rgba(163,163,204,0.12)]">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#363675] border border-[#CCCCFF]/40 flex items-center justify-center text-[#CCCCFF]">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-base uppercase tracking-tight text-white font-sans">
                ADMIN<span className="text-[#CCCCFF]">HQ</span>
              </span>
              <p className="text-[9px] uppercase tracking-widest text-white/50 -mt-1 font-semibold">
                MakeMyHair Console
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors
                  ${active
                    ? 'bg-[#CCCCFF] text-[#292966] font-bold shadow-md'
                    : 'text-white/70 hover:bg-[#363675] hover:text-[#CCCCFF]'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={16} className={active ? 'text-[#292966]' : 'text-white/60'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(163,163,204,0.12)] bg-[#1e1e4f]">
          <Link 
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-[#CCCCFF] transition-colors mb-1"
          >
            <Home size={15} className="text-[#CCCCFF]" />
            <span>Storefront View</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 w-full text-left transition-colors"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen bg-[#292966]">
        {/* Top Header */}
        <header className="h-16 bg-[#292966] border-b border-[rgba(163,163,204,0.12)] flex items-center justify-between px-6 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-white hover:text-[#CCCCFF]"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
              <span className="text-[#CCCCFF]">MakeMyHair</span>
              <span>/</span>
              <span className="text-white">Administration Platform</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs font-bold">
              A
            </div>
            <span className="text-xs font-bold text-white">Platform Admin</span>
          </div>
        </header>

        {/* Outlet Content */}
        <main className="p-6 sm:p-8 flex-1 pb-24 lg:pb-8 bg-[#292966] text-white">
          <Outlet />
        </main>
        <MobileBottomBar />
      </div>
    </div>
  );
};

export default AdminLayout;
