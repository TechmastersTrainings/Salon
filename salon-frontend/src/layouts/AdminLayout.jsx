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
    <div className="min-h-screen bg-ivory text-ink">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-blush text-ink z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-line
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-line">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-surface border border-rose-300 flex items-center justify-center text-rose-600">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-base uppercase tracking-tight text-ink font-sans">
                ADMIN<span className="text-rose-600">HQ</span>
              </span>
              <p className="text-[9px] uppercase tracking-widest text-muted -mt-1 font-semibold">
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
                    ? 'bg-ink text-ivory font-bold shadow-md'
                    : 'text-body hover:bg-surface hover:text-rose-600'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={16} className={active ? 'text-ivory' : 'text-muted'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-line bg-blush">
          <Link 
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-body hover:text-rose-600 transition-colors mb-1"
          >
            <Home size={15} className="text-rose-600" />
            <span>Storefront View</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-700 w-full text-left transition-colors"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen bg-ivory">
        {/* Top Header */}
        <header className="h-16 bg-ivory border-b border-line flex items-center justify-between px-6 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-ink hover:text-rose-600"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
              <span className="text-rose-600">MakeMyHair</span>
              <span>/</span>
              <span className="text-ink">Administration Platform</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blush border border-rose-300 text-rose-600 flex items-center justify-center text-xs font-bold">
              A
            </div>
            <span className="text-xs font-bold text-ink">Platform Admin</span>
          </div>
        </header>

        {/* Outlet Content */}
        <main className="p-6 sm:p-8 flex-1 pb-24 lg:pb-8 bg-ivory text-ink">
          <Outlet />
        </main>
        <MobileBottomBar />
      </div>
    </div>
  );
};

export default AdminLayout;
