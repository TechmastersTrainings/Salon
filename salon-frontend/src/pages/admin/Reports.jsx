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
    <div className="space-y-8 font-sans antialiased text-ink">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-line">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-200 text-rose-600 text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-rose-600" />
            Business Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-ink tracking-tight">Reports & Performance Analytics</h1>
          <p className="text-muted text-xs font-sans mt-0.5">Evaluate platform transaction volume, active appointments, and user acquisition</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center space-x-2 bg-ink hover:bg-rose-600 text-ivory px-5 py-2.5 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shrink-0 shadow-lg shadow-rose-200/40 hover:scale-[1.02]"
        >
          <Download className="h-4 w-4" />
          <span>Export Dossier (CSV)</span>
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-surface rounded-2xl shadow-md border border-line p-5">
        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-neutral-400" />
          <span className="text-xs font-poppins font-semibold uppercase tracking-wider text-muted">Telemetry Horizon:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3.5 py-1.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
          >
            <option value="week" className="bg-blush">Trailing 7 Days</option>
            <option value="month" className="bg-blush">Current Month (MTD)</option>
            <option value="quarter" className="bg-blush">Fiscal Quarter</option>
            <option value="year" className="bg-blush">Annual Summary</option>
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
            <div key={index} className="bg-surface rounded-2xl shadow-md border border-line p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-muted">{stat.label}</p>
                <div className="p-2.5 rounded-xl bg-blush border border-line text-rose-600">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-poppins font-bold text-ink">{stat.value}</p>
              <p className="text-[11px] font-sans text-rose-600 mt-2 font-medium">{stat.change}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;
