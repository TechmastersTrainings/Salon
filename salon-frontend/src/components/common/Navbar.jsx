import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Scissors, User, LogOut, Calendar, Search, 
  Wallet, Menu, X, Shield, Sparkles, Store, 
  Phone, Clock, MapPin, Heart, ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, demoLogin } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setRoleSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Condense the header once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const handleSwitchRole = (role) => {
    demoLogin(role);
    setRoleSwitcherOpen(false);
    toast.success(`Switched mode to ${role.toUpperCase()}`);
    if (role === 'admin') navigate('/admin');
    else if (role === 'owner') navigate('/dashboard');
    else navigate('/search');
  };

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 ease-lux ${
        scrolled ? 'bg-ivory/90 backdrop-blur-md shadow-lg' : 'bg-ivory shadow-none'
      }`}
    >
      
      {/* 1. TOP ANNOUNCEMENT BAR — collapses on scroll */}
      <div className={`collapse-y ${scrolled && !roleSwitcherOpen ? 'is-collapsed' : ''}`}>
      <div>
      <div className="bg-blush text-ink text-[11px] py-2 px-4 border-b border-line">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          {/* Left: Store Announcement */}
          <div className="flex items-center gap-4 text-body">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles size={12} className="text-rose-600" />
              <span>Complimentary scalp diagnosis with your first booking</span>
            </span>
            <span className="hidden md:inline text-neutral-300">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-body">
              <Phone size={11} className="text-rose-600" />
              <span>Hotline: +91 98807 68222</span>
            </span>
          </div>

          {/* Right: City & Role Switcher */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1 text-body">
              <Clock size={11} className="text-rose-600" />
              <span>08:00 AM – 10:00 PM</span>
            </span>

            {/* Persona Switcher */}
            <div className="relative" ref={roleRef}>
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-ink transition-colors uppercase tracking-wider"
              >
                <span>Demo: {user ? user.role : 'Select Role'}</span>
                <ChevronDown size={12} />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-line shadow-2xl p-2 z-50 animate-fadeIn text-ink">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted px-3 py-1.5 border-b border-line">
                    Switch Active Persona
                  </div>
                  <button
                    onClick={() => handleSwitchRole('customer')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-between"
                  >
                    <span>Client / Customer</span>
                    {user?.role === 'customer' && <span className="w-1.5 h-1.5 rounded-full bg-ink shadow-none" />}
                  </button>
                  <button
                    onClick={() => handleSwitchRole('owner')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-between"
                  >
                    <span>Studio Owner</span>
                    {user?.role === 'owner' && <span className="w-1.5 h-1.5 rounded-full bg-ink shadow-none" />}
                  </button>
                  <button
                    onClick={() => handleSwitchRole('admin')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-between"
                  >
                    <span>Super Admin</span>
                    {user?.role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-ink shadow-none" />}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className={`border-b border-line transition-colors duration-500 ${scrolled ? 'bg-transparent' : 'bg-ivory'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-[height] duration-500 ease-lux ${scrolled ? 'h-16' : 'h-20'}`}>
            
            {/* BRAND LOGO */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-blush border border-line flex items-center justify-center text-ink transition-colors group-hover:border-rose-400">
                <Scissors size={20} className="text-rose-600 transition-transform duration-500 ease-lux group-hover:rotate-[-20deg] group-hover:scale-110" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[1.55rem] tracking-[0.06em] text-ink">
                  MAKEMY<span className="text-rose-600">HAIR</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.28em] text-muted font-bold -mt-1">
                  Atelier & Studios
                </span>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION LINKS */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/search">Studios & Salons</NavLink>
              <NavLink to="/search?category=Haircut">Haircraft</NavLink>
              <NavLink to="/search?category=Spa">Spa & Treatment</NavLink>

              {user?.role === 'customer' && (
                <NavLink to="/bookings">My Bookings</NavLink>
              )}

              {user?.role === 'owner' && (
                <NavLink to="/dashboard">Owner Hub</NavLink>
              )}

              {user?.role === 'admin' && (
                <NavLink to="/admin">Admin Panel</NavLink>
              )}
            </nav>

            {/* RIGHT UTILITY & ACTIONS */}
            <div className="hidden sm:flex items-center gap-5">
              
              {/* Quick Search Link */}
              <Link
                to="/search"
                className="w-9 h-9 rounded-full flex items-center justify-center text-body hover:text-rose-600 hover:bg-surface transition-colors"
                title="Search Salons"
              >
                <Search size={18} />
              </Link>

              {/* Bookings shortcut */}
              {user?.role === 'customer' && (
                <Link
                  to="/bookings"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-body hover:text-rose-600 hover:bg-surface transition-colors relative"
                  title="My Reservations"
                >
                  <Calendar size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-ink rounded-full shadow-none" />
                </Link>
              )}

              {/* Auth Button or User Dropdown */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-line hover:border-rose-400 bg-surface transition-colors"
                  >
                    <div className="w-7 h-7 bg-blush text-rose-600 flex items-center justify-center text-xs font-bold border border-line">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-ink">{user.username || 'Account'}</span>
                    <ChevronDown size={13} className="text-muted" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-surface border border-line shadow-2xl z-50 animate-fadeIn text-ink">
                      <div className="p-3 border-b border-line">
                        <p className="text-xs font-bold text-ink">{user.username}</p>
                        <p className="text-[11px] text-muted truncate">{user.email || 'Verified Account'}</p>
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider text-rose-600">
                          {user.role} tier
                        </span>
                      </div>

                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-body hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={14} className="text-rose-600" />
                        My Profile
                      </Link>

                      {user.role === 'customer' && (
                        <Link 
                          to="/bookings" 
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-body hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Calendar size={14} className="text-rose-600" />
                          Reservations
                        </Link>
                      )}

                      {user.role === 'owner' && (
                        <Link 
                          to="/dashboard" 
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-body hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Store size={14} className="text-rose-600" />
                          Owner Dashboard
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-body hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Shield size={14} className="text-rose-600" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={() => { handleLogout(); setDropdownOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors text-left border-t border-line"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-xs font-bold uppercase tracking-wider text-body hover:text-rose-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/search"
                    className="bloxic-btn-primary"
                  >
                    Book Appointment
                  </Link>
                </div>
              )}

            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-ink hover:text-rose-600 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {isOpen && (
        <div className="lg:hidden bg-ivory border-b border-line px-4 py-5 shadow-2xl animate-slideDown text-ink">
          <div className="space-y-3 stagger-in">
            <Link to="/" className="block py-2 text-xs font-bold uppercase tracking-wider text-rose-600" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/search" className="block py-2 text-xs font-bold uppercase tracking-wider text-body hover:text-rose-600" onClick={() => setIsOpen(false)}>Explore Studios</Link>
            <Link to="/search?category=Haircut" className="block py-2 text-xs font-bold uppercase tracking-wider text-body hover:text-rose-600" onClick={() => setIsOpen(false)}>Haircraft</Link>
            <Link to="/search?category=Spa" className="block py-2 text-xs font-bold uppercase tracking-wider text-body hover:text-rose-600" onClick={() => setIsOpen(false)}>Spa & Treatment</Link>

            {user ? (
              <>
                <Link to="/profile" className="block py-2 text-xs font-bold uppercase tracking-wider text-body hover:text-rose-600" onClick={() => setIsOpen(false)}>Profile</Link>
                {user.role === 'customer' && (
                  <Link to="/bookings" className="block py-2 text-xs font-bold uppercase tracking-wider text-body hover:text-rose-600" onClick={() => setIsOpen(false)}>My Bookings</Link>
                )}
                {user.role === 'owner' && (
                  <Link to="/dashboard" className="block py-2 text-xs font-bold uppercase tracking-wider text-body hover:text-rose-600" onClick={() => setIsOpen(false)}>Owner Dashboard</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="block py-2 text-xs font-bold uppercase tracking-wider text-body hover:text-rose-600" onClick={() => setIsOpen(false)}>Admin Panel</Link>
                )}
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-4 border-t border-line flex flex-col gap-2">
                <Link 
                  to="/login" 
                  className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider border border-line text-ink hover:border-rose-400 hover:text-rose-600"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider bg-ink text-ivory"
                  onClick={() => setIsOpen(false)}
                >
                  Join MakeMyHair
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
};

// NavLink Helper
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`nav-underline text-xs font-bold uppercase tracking-wider transition-colors duration-300 py-2 ${
        isActive ? 'is-active text-rose-600' : 'text-body hover:text-rose-600'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
