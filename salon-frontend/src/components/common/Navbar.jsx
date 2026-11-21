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
    <header className="sticky top-0 left-0 w-full z-50 bg-[#0B3048] shadow-lg transition-all duration-300">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#072132] text-[#F2F0E9] text-[11px] py-2 px-4 border-b border-[rgba(242,240,233,0.1)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          {/* Left: Store Announcement */}
          <div className="flex items-center gap-4 text-[#F2F0E9]/80">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles size={12} className="text-[#B9F12F]" />
              <span>Complimentary scalp diagnosis with your first booking</span>
            </span>
            <span className="hidden md:inline text-[rgba(242,240,233,0.2)]">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-[#F2F0E9]/70">
              <Phone size={11} className="text-[#B9F12F]" />
              <span>Hotline: +91 98807 68222</span>
            </span>
          </div>

          {/* Right: City & Role Switcher */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1 text-[#F2F0E9]/70">
              <Clock size={11} className="text-[#B9F12F]" />
              <span>08:00 AM – 10:00 PM</span>
            </span>

            {/* Persona Switcher */}
            <div className="relative" ref={roleRef}>
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#B9F12F] hover:text-white transition-colors uppercase tracking-wider"
              >
                <span>Demo: {user ? user.role : 'Select Role'}</span>
                <ChevronDown size={12} />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0e3854] border border-[rgba(242,240,233,0.15)] shadow-2xl p-2 z-50 animate-fadeIn text-[#F2F0E9]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#F2F0E9]/50 px-3 py-1.5 border-b border-[rgba(242,240,233,0.1)]">
                    Switch Active Persona
                  </div>
                  <button
                    onClick={() => handleSwitchRole('customer')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-[#134567] hover:text-[#B9F12F] transition-colors flex items-center justify-between"
                  >
                    <span>Client / Customer</span>
                    {user?.role === 'customer' && <span className="w-1.5 h-1.5 rounded-full bg-[#B9F12F] shadow-[0_0_6px_#B9F12F]" />}
                  </button>
                  <button
                    onClick={() => handleSwitchRole('owner')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-[#134567] hover:text-[#B9F12F] transition-colors flex items-center justify-between"
                  >
                    <span>Studio Owner</span>
                    {user?.role === 'owner' && <span className="w-1.5 h-1.5 rounded-full bg-[#B9F12F] shadow-[0_0_6px_#B9F12F]" />}
                  </button>
                  <button
                    onClick={() => handleSwitchRole('admin')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-[#134567] hover:text-[#B9F12F] transition-colors flex items-center justify-between"
                  >
                    <span>Super Admin</span>
                    {user?.role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-[#B9F12F] shadow-[0_0_6px_#B9F12F]" />}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="border-b border-[rgba(242,240,233,0.12)] bg-[#0B3048]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* BRAND LOGO */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#072132] border border-[rgba(242,240,233,0.15)] flex items-center justify-center text-white transition-colors group-hover:border-[#B9F12F]">
                <Scissors size={20} className="text-[#B9F12F] group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tighter text-[#F2F0E9] font-sans">
                  MAKEMY<span className="text-[#B9F12F]">HAIR</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.28em] text-[#F2F0E9]/60 font-bold -mt-1">
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
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#F2F0E9]/80 hover:text-[#B9F12F] hover:bg-[#0e3854] transition-colors"
                title="Search Salons"
              >
                <Search size={18} />
              </Link>

              {/* Bookings shortcut */}
              {user?.role === 'customer' && (
                <Link
                  to="/bookings"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#F2F0E9]/80 hover:text-[#B9F12F] hover:bg-[#0e3854] transition-colors relative"
                  title="My Reservations"
                >
                  <Calendar size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#B9F12F] rounded-full shadow-[0_0_6px_#B9F12F]" />
                </Link>
              )}

              {/* Auth Button or User Dropdown */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-[rgba(242,240,233,0.18)] hover:border-[#B9F12F] bg-[#0e3854] transition-colors"
                  >
                    <div className="w-7 h-7 bg-[#072132] text-[#B9F12F] flex items-center justify-center text-xs font-bold border border-[rgba(242,240,233,0.15)]">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-[#F2F0E9]">{user.username || 'Account'}</span>
                    <ChevronDown size={13} className="text-[#F2F0E9]/60" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#0e3854] border border-[rgba(242,240,233,0.15)] shadow-2xl z-50 animate-fadeIn text-[#F2F0E9]">
                      <div className="p-3 border-b border-[rgba(242,240,233,0.1)]">
                        <p className="text-xs font-bold text-[#F2F0E9]">{user.username}</p>
                        <p className="text-[11px] text-[#F2F0E9]/60 truncate">{user.email || 'Verified Account'}</p>
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider text-[#B9F12F]">
                          {user.role} tier
                        </span>
                      </div>

                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#F2F0E9]/80 hover:bg-[#134567] hover:text-[#B9F12F] transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={14} className="text-[#B9F12F]" />
                        My Profile
                      </Link>

                      {user.role === 'customer' && (
                        <Link 
                          to="/bookings" 
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#F2F0E9]/80 hover:bg-[#134567] hover:text-[#B9F12F] transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Calendar size={14} className="text-[#B9F12F]" />
                          Reservations
                        </Link>
                      )}

                      {user.role === 'owner' && (
                        <Link 
                          to="/dashboard" 
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#F2F0E9]/80 hover:bg-[#134567] hover:text-[#B9F12F] transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Store size={14} className="text-[#B9F12F]" />
                          Owner Dashboard
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#F2F0E9]/80 hover:bg-[#134567] hover:text-[#B9F12F] transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Shield size={14} className="text-[#B9F12F]" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={() => { handleLogout(); setDropdownOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors text-left border-t border-[rgba(242,240,233,0.1)]"
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
                    className="text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 hover:text-[#B9F12F] transition-colors"
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
              className="lg:hidden p-2 text-[#F2F0E9] hover:text-[#B9F12F] transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {isOpen && (
        <div className="lg:hidden bg-[#0B3048] border-b border-[rgba(242,240,233,0.12)] px-4 py-5 shadow-2xl animate-slideDown text-[#F2F0E9]">
          <div className="space-y-3">
            <Link to="/" className="block py-2 text-xs font-bold uppercase tracking-wider text-[#B9F12F]" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/search" className="block py-2 text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 hover:text-[#B9F12F]" onClick={() => setIsOpen(false)}>Explore Studios</Link>
            <Link to="/search?category=Haircut" className="block py-2 text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 hover:text-[#B9F12F]" onClick={() => setIsOpen(false)}>Haircraft</Link>
            <Link to="/search?category=Spa" className="block py-2 text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 hover:text-[#B9F12F]" onClick={() => setIsOpen(false)}>Spa & Treatment</Link>

            {user ? (
              <>
                <Link to="/profile" className="block py-2 text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 hover:text-[#B9F12F]" onClick={() => setIsOpen(false)}>Profile</Link>
                {user.role === 'customer' && (
                  <Link to="/bookings" className="block py-2 text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 hover:text-[#B9F12F]" onClick={() => setIsOpen(false)}>My Bookings</Link>
                )}
                {user.role === 'owner' && (
                  <Link to="/dashboard" className="block py-2 text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 hover:text-[#B9F12F]" onClick={() => setIsOpen(false)}>Owner Dashboard</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="block py-2 text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 hover:text-[#B9F12F]" onClick={() => setIsOpen(false)}>Admin Panel</Link>
                )}
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-red-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-4 border-t border-[rgba(242,240,233,0.12)] flex flex-col gap-2">
                <Link 
                  to="/login" 
                  className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider border border-[rgba(242,240,233,0.2)] text-[#F2F0E9] hover:border-[#B9F12F] hover:text-[#B9F12F]"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider bg-[#B9F12F] text-[#0B3048]"
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
      className={`text-xs font-bold uppercase tracking-wider transition-colors py-2 border-b-2 ${
        isActive 
          ? 'border-[#B9F12F] text-[#B9F12F]' 
          : 'border-transparent text-[#F2F0E9]/75 hover:text-[#B9F12F] hover:border-[#B9F12F]/40'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
