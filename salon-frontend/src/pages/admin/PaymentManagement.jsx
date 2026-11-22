import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  IndianRupee, 
  User, 
  Store, 
  Eye, 
  Loader, 
  Sparkles, 
  TrendingUp, 
  Receipt 
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/');
      const paymentsData = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'success': 
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'pending': 
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'failed': 
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'refunded': 
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      default: 
        return 'bg-[#1e1e4f] text-white/70 border border-[rgba(163,163,204,0.1)]';
    }
  };

  const filteredPayments = (payments || []).filter(p => 
    (p.transaction_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = (payments || [])
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const totalCommission = totalRevenue * 0.01;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#292966]">
        <div className="w-10 h-10 border-2 border-[rgba(163,163,204,0.15)] border-t-[#CCCCFF] rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-white">Auditing Financial Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans antialiased text-white">
      <div className="pb-6 border-b border-[rgba(163,163,204,0.12)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCCCFF]/10 border border-[#CCCCFF]/30 text-[#CCCCFF] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
          <Sparkles size={12} className="text-[#CCCCFF]" />
          Financial Settlements
        </div>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">Payment Operations</h1>
        <p className="text-white/60 text-xs font-sans mt-0.5">Track, audit, and reconcile client settlements across all studios</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">Gross Settlement Value</p>
              <p className="text-2xl font-poppins font-bold text-white mt-1">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] p-3 rounded-xl text-[#CCCCFF]">
              <IndianRupee className="h-5 w-5 text-[#CCCCFF]" />
            </div>
          </div>
        </div>

        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">Platform Facilitation (1%)</p>
              <p className="text-2xl font-poppins font-bold text-[#CCCCFF] mt-1">₹{totalCommission.toLocaleString()}</p>
            </div>
            <div className="bg-[#CCCCFF]/15 border border-[#CCCCFF]/30 p-3 rounded-xl text-[#CCCCFF]">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">Total Transactions</p>
              <p className="text-2xl font-poppins font-bold text-white mt-1">{payments.length}</p>
            </div>
            <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] p-3 rounded-xl text-[#CCCCFF]">
              <Receipt className="h-5 w-5 text-[#CCCCFF]" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search transactions by reference ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[rgba(163,163,204,0.08)]">
            <thead className="bg-[#1e1e4f]">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Salon</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-[#363675] divide-y divide-[rgba(163,163,204,0.06)]">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[#1e1e4f]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-[#CCCCFF]">
                      {payment.transaction_id || `TXN-${payment.id}8291`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-xs font-medium text-white">
                        <User className="h-3.5 w-3.5 text-white/40 mr-2 shrink-0" />
                        <span>{payment.customer_name || 'Guest Client'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-xs text-white/70 font-sans">
                        <Store className="h-3.5 w-3.5 text-white/40 mr-2 shrink-0" />
                        <span>{payment.salon_name || 'TechMasters Salon & Grooming Atelier'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-poppins font-bold text-xs text-white">
                        ₹{parseFloat(payment.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-xs text-white/70 font-sans">{payment.method || 'UPI / Gateway'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider border ${getStatusBadge(payment.status)}`}>
                        {payment.status || 'success'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-white/50 font-sans">
                      {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'Today'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-white/40 font-sans text-xs">
                    No transactions matching search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
