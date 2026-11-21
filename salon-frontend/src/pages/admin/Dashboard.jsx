import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Store, CreditCard, Wallet, TrendingUp, Clock, 
  CheckCircle, IndianRupee, Calendar, ArrowUpRight, 
  ArrowDownRight, Loader, Sparkles, ShieldAlert 
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSalons: 0,
    totalOwners: 0,
    pendingOwners: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalWalletBalance: 0,
    totalPayments: 0,
    completedBookings: 0,
    activeSalons: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, salonsRes, bookingsRes, paymentsRes] = await Promise.allSettled([
        api.get('/accounts/users/'),
        api.get('/salons/'),
        api.get('/bookings/'),
        api.get('/payments/')
      ]);

      const users = usersRes.status === 'fulfilled' 
        ? (Array.isArray(usersRes.value.data) ? usersRes.value.data : usersRes.value.data?.results || [])
        : [];
      
      const owners = users.filter(u => u.role === 'owner');
      const pendingOwners = owners.filter(u => !u.is_owner_approved);

      const salons = salonsRes.status === 'fulfilled'
        ? (Array.isArray(salonsRes.value.data) ? salonsRes.value.data : salonsRes.value.data?.results || [])
        : [];
      
      const activeSalons = salons.filter(s => s.is_active).length;

      const bookings = bookingsRes.status === 'fulfilled'
        ? (Array.isArray(bookingsRes.value.data) ? bookingsRes.value.data : bookingsRes.value.data?.results || [])
        : [];
      
      const completedBookings = bookings.filter(b => b.status === 'completed').length;

      const payments = paymentsRes.status === 'fulfilled'
        ? (Array.isArray(paymentsRes.value.data) ? paymentsRes.value.data : paymentsRes.value.data?.results || [])
        : [];
      
      const totalRevenue = payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

      setStats({
        totalUsers: users.length,
        totalSalons: salons.length,
        totalOwners: owners.length,
        pendingOwners: pendingOwners.length,
        totalBookings: bookings.length,
        completedBookings,
        activeSalons,
        totalRevenue: totalRevenue,
        totalWalletBalance: 0,
        totalPayments: payments.length
      });

      // Construct activity from live salons and users
      const activities = [];
      salons.slice(0, 2).forEach(s => {
        activities.push({
          id: `salon-${s.id}`,
          title: `Active Studio: ${s.name}`,
          description: `Location: ${s.city || 'Bangalore'} • Owned by ${s.owner_name || 'Merchant'}`,
          time: s.created_at ? new Date(s.created_at).toLocaleDateString() : 'Active',
          icon: Store,
          type: 'salon'
        });
      });

      users.filter(u => u.role === 'owner').slice(0, 2).forEach(o => {
        activities.push({
          id: `owner-${o.id}`,
          title: o.is_owner_approved ? 'Verified Studio Partner' : 'Pending Partner Verification',
          description: `${o.email} (${o.username || 'Merchant Partner'})`,
          time: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Active',
          icon: o.is_owner_approved ? CheckCircle : Clock,
          type: 'owner'
        });
      });

      setRecentActivity(activities);

    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Registered Clients',
      value: stats.totalUsers.toLocaleString(),
      change: 'Active Platform Patrons',
      icon: Users,
      link: '/admin/users'
    },
    {
      title: 'Active Ateliers',
      value: stats.totalSalons,
      change: `${stats.activeSalons} currently active`,
      icon: Store,
      link: '/admin/salons'
    },
    {
      title: 'Pending Studio Approvals',
      value: stats.pendingOwners,
      change: stats.pendingOwners > 0 ? 'Requires attention' : 'All approved',
      icon: ShieldAlert,
      link: '/admin/owners'
    },
    {
      title: 'Platform GMV',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: 'Verified settlements',
      icon: IndianRupee,
      link: '/admin/payments'
    },
    {
      title: 'Network Vault Reserves',
      value: `₹${stats.totalWalletBalance.toLocaleString()}`,
      change: 'Escrow backed',
      icon: Wallet,
      link: '/admin/wallets'
    },
    {
      title: 'Total Appointments',
      value: stats.totalBookings.toLocaleString(),
      change: `${stats.completedBookings} completed`,
      icon: Calendar,
      link: '/admin'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#0B3048]">
        <div className="w-10 h-10 border-2 border-[rgba(242,240,233,0.15)] border-t-[#B9F12F] rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-[#F2F0E9]">Syncing Administration HQ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans antialiased text-[#F2F0E9]">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(242,240,233,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B9F12F]/10 border border-[#B9F12F]/30 text-[#B9F12F] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-[#B9F12F]" />
            MAKEMYHAIR Global Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-[#F2F0E9] tracking-tight">
            Platform Overview & Operations
          </h1>
          <p className="text-xs text-[#F2F0E9]/60 font-sans mt-1">Real-time health telemetry across all studio locations</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="group bg-[#0e3854] p-6 rounded-2xl border border-[rgba(242,240,233,0.12)] hover:border-[#B9F12F]/50 shadow-md hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#072132] text-[#B9F12F] group-hover:bg-[#B9F12F] group-hover:text-[#0B3048] transition-all border border-[rgba(242,240,233,0.1)]">
                  <Icon size={18} />
                </div>
                <ArrowUpRight size={16} className="text-[#F2F0E9]/30 group-hover:text-[#B9F12F] transition-colors" />
              </div>

              <h3 className="text-3xl font-poppins font-bold text-[#F2F0E9] tracking-tight">{card.value}</h3>
              <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-[#F2F0E9]/60 mt-1">{card.title}</p>
              <span className="text-[11px] text-[#B9F12F] mt-3 block font-sans font-medium">{card.change}</span>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#0e3854] rounded-2xl p-6 sm:p-8 border border-[rgba(242,240,233,0.12)] shadow-md space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(242,240,233,0.08)]">
          <div>
            <h3 className="text-sm font-poppins font-bold text-[#F2F0E9] uppercase tracking-wider">
              Critical Telemetry & Real-Time Log
            </h3>
            <p className="text-xs text-[#F2F0E9]/60 mt-0.5 font-sans">Live stream of appointments, applications, and partners</p>
          </div>
          <span className="text-[11px] font-poppins font-bold text-[#B9F12F] bg-[#B9F12F]/10 px-3 py-1 rounded-full border border-[#B9F12F]/30">
            Live Stream
          </span>
        </div>

        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-center justify-between p-4 rounded-xl bg-[#072132] border border-[rgba(242,240,233,0.1)] hover:border-[#B9F12F]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-[#0e3854] text-[#B9F12F] shrink-0 border border-[rgba(242,240,233,0.1)]">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="font-poppins font-semibold text-xs sm:text-sm text-[#F2F0E9]">{act.title}</h4>
                      <p className="text-xs text-[#F2F0E9]/60 font-sans">{act.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-sans text-[#F2F0E9]/40 shrink-0">{act.time}</span>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-[#F2F0E9]/40 font-sans py-4 text-center">No recent activity logs.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
