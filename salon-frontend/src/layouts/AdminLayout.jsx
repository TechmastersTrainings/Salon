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
    <div className="min-h-screen bg-[#0B3048] text-[#F2F0E9]">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#072132] text-[#F2F0E9] z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-[rgba(242,240,233,0.12)]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-[rgba(242,240,233,0.12)]">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0e3854] border border-[#B9F12F]/40 flex items-center justify-center text-[#B9F12F]">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-base uppercase tracking-tight text-[#F2F0E9] font-sans">
                ADMIN<span className="text-[#B9F12F]">HQ</span>
              </span>
              <p className="text-[9px] uppercase tracking-widest text-[#F2F0E9]/50 -mt-1 font-semibold">
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
                    ? 'bg-[#B9F12F] text-[#0B3048] font-bold shadow-md'
                    : 'text-[#F2F0E9]/70 hover:bg-[#0e3854] hover:text-[#B9F12F]'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={16} className={active ? 'text-[#0B3048]' : 'text-[#F2F0E9]/60'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(242,240,233,0.12)] bg-[#072132]">
          <Link 
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/70 hover:text-[#B9F12F] transition-colors mb-1"
          >
            <Home size={15} className="text-[#B9F12F]" />
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
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen bg-[#0B3048]">
        {/* Top Header */}
        <header className="h-16 bg-[#0B3048] border-b border-[rgba(242,240,233,0.12)] flex items-center justify-between px-6 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#F2F0E9] hover:text-[#B9F12F]"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/60">
              <span className="text-[#B9F12F]">MakeMyHair</span>
              <span>/</span>
              <span className="text-[#F2F0E9]">Administration Platform</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#072132] border border-[#B9F12F]/40 text-[#B9F12F] flex items-center justify-center text-xs font-bold">
              A
            </div>
            <span className="text-xs font-bold text-[#F2F0E9]">Platform Admin</span>
          </div>
        </header>

        {/* Outlet Content */}
        <main className="p-6 sm:p-8 flex-1 pb-24 lg:pb-8 bg-[#0B3048] text-[#F2F0E9]">
          <Outlet />
        </main>
        <MobileBottomBar />
      </div>
    </div>
  );
};

export default AdminLayout;
