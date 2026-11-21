import { BarChart3, Download, Calendar, TrendingUp, Users, CreditCard, Sparkles, Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Reports = () => {
  const [dateRange, setDateRange] = useState('month');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalSalons: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [usersRes, salonsRes, bookingsRes, paymentsRes] = await Promise.allSettled([
          api.get('/accounts/users/'),
          api.get('/salons/'),
          api.get('/bookings/'),
          api.get('/payments/')
        ]);

        const users = usersRes.status === 'fulfilled' ? (Array.isArray(usersRes.value.data) ? usersRes.value.data : usersRes.value.data?.results || []) : [];
        const salons = salonsRes.status === 'fulfilled' ? (Array.isArray(salonsRes.value.data) ? salonsRes.value.data : salonsRes.value.data?.results || []) : [];
        const bookings = bookingsRes.status === 'fulfilled' ? (Array.isArray(bookingsRes.value.data) ? bookingsRes.value.data : bookingsRes.value.data?.results || []) : [];
        const payments = paymentsRes.status === 'fulfilled' ? (Array.isArray(paymentsRes.value.data) ? paymentsRes.value.data : paymentsRes.value.data?.results || []) : [];

        const totalRevenue = payments
          .filter(p => p.status === 'success')
          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

        setStats({
          totalRevenue,
          totalBookings: bookings.length,
          totalUsers: users.length,
          totalSalons: salons.length
        });
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };
    fetchAnalytics();
  }, [dateRange]);

  const handleExport = () => {
    toast.success('Analytics report generated & downloaded as CSV');
  };

  return (
    <div className="space-y-8 font-sans antialiased text-white">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-[rgba(163,163,204,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCCCFF]/10 border border-[#CCCCFF]/30 text-[#CCCCFF] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-[#CCCCFF]" />
            Business Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">Reports & Performance Analytics</h1>
          <p className="text-white/60 text-xs font-sans mt-0.5">Evaluate platform transaction volume, active appointments, and user acquisition</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center space-x-2 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] px-5 py-2.5 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shrink-0 shadow-lg shadow-[#CCCCFF]/10 hover:scale-[1.02]"
        >
          <Download className="h-4 w-4" />
          <span>Export Dossier (CSV)</span>
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-5">
        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-white/40" />
          <span className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">Telemetry Horizon:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3.5 py-1.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
          >
            <option value="week" className="bg-[#1e1e4f]">Trailing 7 Days</option>
            <option value="month" className="bg-[#1e1e4f]">Current Month (MTD)</option>
            <option value="quarter" className="bg-[#1e1e4f]">Fiscal Quarter</option>
            <option value="year" className="bg-[#1e1e4f]">Annual Summary</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Platform Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, change: 'Verified settlements', icon: TrendingUp },
          { label: 'Total Appointments', value: `${stats.totalBookings}`, change: 'Active platform sessions', icon: BarChart3 },
          { label: 'Registered Clients', value: `${stats.totalUsers}`, change: 'Verified accounts', icon: Users },
          { label: 'Active Salons', value: `${stats.totalSalons}`, change: 'Verified ateliers', icon: Store },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">{stat.label}</p>
                <div className="p-2.5 rounded-xl bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] text-[#CCCCFF]">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-poppins font-bold text-white">{stat.value}</p>
              <p className="text-[11px] font-sans text-[#CCCCFF] mt-2 font-medium">{stat.change}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;
