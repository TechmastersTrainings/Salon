import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Scissors, Wallet, Calendar, Loader, PlusCircle,
  TrendingUp, ChevronRight, IndianRupee, Sparkles, Store, 
  ArrowUpRight, Clock, ShieldCheck, CheckCircle2, AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [hasSalon, setHasSalon] = useState(false);
  
  const [data, setData] = useState({
    salons: [],
    activeSalon: null,
    upcomingBookings: [],
    stats: {
      totalBookings: 0, totalStaff: 0, totalServices: 0, walletBalance: 0,
      todayBookings: 0, weeklyBookings: 0, monthlyRevenue: 0
    }
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { 
    fetchDashboardData(); 
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const salonsRes = await api.get('/salons/my-salons/');
      const salons = Array.isArray(salonsRes.data) ? salonsRes.data : salonsRes.data?.results || [];
      
      if (salons.length === 0) {
        setHasSalon(false);
        setData({
          salons: [],
          activeSalon: null,
          upcomingBookings: [],
          stats: {
            totalBookings: 0, totalStaff: 0, totalServices: 0, walletBalance: 0,
            todayBookings: 0, weeklyBookings: 0, monthlyRevenue: 0
          }
        });
        setLoading(false);
        return;
      }

      const activeSalon = salons[0];
      setHasSalon(true);

      const [staffRes, servicesRes, bookingsRes, walletRes] = await Promise.allSettled([
        api.get(`/staff/salon/${activeSalon.id}/`),
        api.get(`/services/salon/${activeSalon.id}/`),
        api.get('/bookings/'),
        api.get('/payments/wallet/')
      ]);

      const staffList = staffRes.status === 'fulfilled' ? (staffRes.value.data?.results || staffRes.value.data || []) : [];
      const servicesList = servicesRes.status === 'fulfilled' ? (servicesRes.value.data?.results || servicesRes.value.data || []) : [];
      const allBookings = bookingsRes.status === 'fulfilled' ? (bookingsRes.value.data?.results || bookingsRes.value.data || []) : [];
      const walletData = walletRes.status === 'fulfilled' ? walletRes.value.data : null;

      const todayBookingsCount = allBookings.filter(b => b.appointment_date === today).length;
      const completedRevenue = allBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0);

      setData({
        salons,
        activeSalon,
        upcomingBookings: allBookings.slice(0, 5),
        stats: {
          totalBookings: allBookings.length,
          totalStaff: staffList.length,
          totalServices: servicesList.length,
          walletBalance: walletData?.balance || 0,
          todayBookings: todayBookingsCount,
          weeklyBookings: allBookings.length,
          monthlyRevenue: completedRevenue
        }
      });
    } catch (error) { 
      console.error('Failed to load owner dashboard:', error);
      setData({
        salons: [],
        activeSalon: null,
        upcomingBookings: [],
        stats: {
          totalBookings: 0, totalStaff: 0, totalServices: 0, walletBalance: 0,
          todayBookings: 0, weeklyBookings: 0, monthlyRevenue: 0
        }
      });
    } finally { 
      setLoading(false); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#292966]">
        <div className="w-10 h-10 border-2 border-[rgba(163,163,204,0.2)] border-t-[#CCCCFF] rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-[#CCCCFF]">Loading Studio Command...</p>
      </div>
    );
  }

  if (!hasSalon) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#292966] px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#363675] border border-[#CCCCFF]/40 flex items-center justify-center text-[#CCCCFF] mb-6 shadow-xl">
          <Store size={32} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-white mb-3">
          No Studio Registered Yet
        </h2>
        <p className="text-sm text-white/70 max-w-md mb-8">
          Welcome to the Merchant Command Center. Register your salon atelier to configure specialists, treatment menus, and accept appointments.
        </p>
        <Link
          to="/salons/manage"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#CCCCFF] text-[#292966] font-poppins font-bold text-xs uppercase tracking-wider hover:bg-[#b8b8f5] transition-all shadow-lg"
        >
          <PlusCircle size={16} />
          <span>Register Salon Studio</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#292966] text-white pb-16 antialiased font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[rgba(163,163,204,0.12)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#363675] border border-[#CCCCFF]/40 text-[#CCCCFF] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={12} className="text-[#CCCCFF]" />
              <span>Partner Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">
              {data.activeSalon?.name || "TechMasters Salon & Grooming Atelier"}
            </h1>
            <p className="text-xs text-white/70 font-sans mt-1">
              {data.activeSalon?.address || 'Lavelle Road'}, {data.activeSalon?.city || 'Bangalore'} • <span className="text-[#CCCCFF] font-medium">Studio Active</span>
            </p>
          </div>
          
          <div className="bg-[#363675] border border-[rgba(163,163,204,0.15)] px-5 py-3 rounded-xl flex items-center gap-4 shadow-lg">
            <div className="p-2.5 rounded-lg bg-[#1e1e4f] text-[#CCCCFF] border border-[#CCCCFF]/30">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xl font-poppins font-bold text-white leading-none">{data.stats.todayBookings}</p>
              <p className="text-[10px] font-poppins font-semibold text-white/50 uppercase tracking-wider mt-1">Today's Sessions</p>
            </div>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Revenue (MTD)', val: `₹${data.stats.monthlyRevenue.toLocaleString()}`, icon: IndianRupee, link: '/wallet' },
            { label: 'Vault Balance', val: `₹${data.stats.walletBalance.toLocaleString()}`, icon: Wallet, link: '/wallet' },
            { label: 'Active Specialists', val: data.stats.totalStaff, icon: Users, link: '/staff' },
            { label: 'Treatment Menu', val: data.stats.totalServices, icon: Scissors, link: '/services' }
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => navigate(item.link)}
              className="group bg-[#363675] p-6 rounded-xl border border-[rgba(163,163,204,0.12)] hover:border-[#CCCCFF] shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="p-3 w-fit rounded-lg bg-[#1e1e4f] text-[#CCCCFF] group-hover:bg-[#CCCCFF] group-hover:text-[#292966] transition-colors mb-4 border border-[rgba(163,163,204,0.1)]">
                <item.icon size={20} />
              </div>
              <h3 className="text-2xl font-poppins font-bold text-white tracking-tight">{item.val}</h3>
              <p className="text-[11px] font-poppins font-medium text-white/60 uppercase tracking-wider mt-1">{item.label}</p>
              <ArrowUpRight className="absolute top-5 right-5 text-white/30 group-hover:text-[#CCCCFF] transition-colors" size={16} />
            </div>
          ))}
        </div>

        {/* MAIN BODY */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* INCOMING QUEUE */}
          <div className="lg:col-span-8 bg-[#363675] rounded-xl p-6 sm:p-8 border border-[rgba(163,163,204,0.12)] shadow-lg space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[rgba(163,163,204,0.1)]">
              <div className="flex items-center gap-2">
                <Clock className="text-[#CCCCFF]" size={18} />
                <h3 className="text-sm font-poppins font-bold text-white uppercase tracking-wider">
                  Upcoming Client Queue
                </h3>
              </div>
              <span className="text-[11px] font-poppins font-medium text-[#CCCCFF] bg-[#1e1e4f] px-3 py-1 rounded-full border border-[#CCCCFF]/30">
                Live Schedule
              </span>
            </div>
            
            <div className="space-y-3">
              {data.upcomingBookings.length > 0 ? (
                data.upcomingBookings.map((b) => (
                  <div 
                    key={b.id} 
                    className="flex items-center justify-between p-4 rounded-lg border border-[rgba(163,163,204,0.1)] bg-[#1e1e4f] hover:border-[#CCCCFF] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#292966] text-[#CCCCFF] border border-[#CCCCFF]/30 flex items-center justify-center font-poppins font-bold text-sm shadow-sm">
                        {(b.customer_name || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-poppins font-semibold text-white text-sm">{b.customer_name || 'Client'}</h4>
                        <p className="text-xs text-white/70 font-sans">{b.service_name || 'Service'}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-poppins font-bold text-[#CCCCFF] block">{b.appointment_time}</span>
                      <span className="text-[10px] font-poppins font-medium text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 px-4 rounded-lg border border-[rgba(163,163,204,0.08)] bg-[#1e1e4f]/60">
                  <Clock className="w-10 h-10 text-white/30 mx-auto mb-3" />
                  <p className="text-sm font-poppins font-semibold text-white">No Appointments Scheduled</p>
                  <p className="text-xs text-white/60 mt-1">New client bookings will appear here in real-time.</p>
                </div>
              )}
            </div>
          </div>

          {/* QUICK MANAGEMENT LINKS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1e1e4f] text-white rounded-xl p-6 sm:p-8 shadow-lg border border-[rgba(163,163,204,0.12)] space-y-5">
              <div>
                <span className="text-[10px] font-poppins font-semibold text-[#CCCCFF] uppercase tracking-widest block mb-1">Quick Navigation</span>
                <h3 className="text-base font-poppins font-bold text-white uppercase tracking-wider">
                  Studio Operations
                </h3>
              </div>
              
              <div className="space-y-2.5">
                <Link 
                  to="/salons/manage"
                  className="w-full flex items-center justify-between p-3.5 rounded-lg bg-[#363675] hover:bg-[#44448a] border border-[rgba(163,163,204,0.12)] text-xs font-poppins font-medium text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Store size={16} className="text-[#CCCCFF]" />
                    <span>Studio Details & Photos</span>
                  </div>
                  <ChevronRight size={14} className="text-white/40" />
                </Link>

                <Link 
                  to="/services"
                  className="w-full flex items-center justify-between p-3.5 rounded-lg bg-[#363675] hover:bg-[#44448a] border border-[rgba(163,163,204,0.12)] text-xs font-poppins font-medium text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Scissors size={16} className="text-[#CCCCFF]" />
                    <span>Manage Treatment Menu</span>
                  </div>
                  <ChevronRight size={14} className="text-white/40" />
                </Link>

                <Link 
                  to="/staff"
                  className="w-full flex items-center justify-between p-3.5 rounded-lg bg-[#363675] hover:bg-[#44448a] border border-[rgba(163,163,204,0.12)] text-xs font-poppins font-medium text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-[#CCCCFF]" />
                    <span>Specialists & Schedules</span>
                  </div>
                  <ChevronRight size={14} className="text-white/40" />
                </Link>

                <Link 
                  to="/wallet"
                  className="w-full flex items-center justify-between p-3.5 rounded-lg bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] text-xs font-poppins font-bold uppercase tracking-wider transition-all mt-4"
                >
                  <div className="flex items-center gap-2">
                    <Wallet size={15} />
                    <span>Open Vault & Payouts</span>
                  </div>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;
