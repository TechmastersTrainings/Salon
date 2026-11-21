import { useState, useEffect } from 'react';
import { 
  Wallet,
  Search,
  IndianRupee,
  TrendingUp,
  Users,
  RefreshCw,
  Eye,
  Loader,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const WalletManagement = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await api.get('/admin/wallets/');
      const walletsData = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setWallets(walletsData);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      setWallets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredWallets = (wallets || []).filter(w => 
    (w.owner_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (w.owner_email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBalance = filteredWallets.reduce((sum, w) => sum + (w.balance || 0) * 3, 0);
  const totalCredits = filteredWallets.reduce((sum, w) => sum + (w.balance || 0), 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#292966]">
        <div className="w-10 h-10 border-2 border-[rgba(163,163,204,0.15)] border-t-[#CCCCFF] rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-white">Auditing Vault Balances...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans antialiased text-white">
      <div className="pb-6 border-b border-[rgba(163,163,204,0.12)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCCCFF]/10 border border-[#CCCCFF]/30 text-[#CCCCFF] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
          <Sparkles size={12} className="text-[#CCCCFF]" />
          Escrow Telemetry
        </div>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">Wallet & Vault Oversight</h1>
        <p className="text-white/60 text-xs font-sans mt-0.5">Audit studio owner escrow balances, credit deposits, and booking redemptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">Escrow Value Backing</p>
              <p className="text-2xl font-poppins font-bold text-white mt-1">₹{totalBalance.toLocaleString()}</p>
            </div>
            <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] p-3 rounded-xl text-[#CCCCFF]">
              <IndianRupee className="h-5 w-5 text-[#CCCCFF]" />
            </div>
          </div>
        </div>

        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">Active Studio Wallets</p>
              <p className="text-2xl font-poppins font-bold text-white mt-1">{filteredWallets.length}</p>
            </div>
            <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] p-3 rounded-xl text-[#CCCCFF]">
              <Users className="h-5 w-5 text-[#CCCCFF]" />
            </div>
          </div>
        </div>

        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">Total Credits Circulating</p>
              <p className="text-2xl font-poppins font-bold text-[#CCCCFF] mt-1">{totalCredits.toLocaleString()}</p>
            </div>
            <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] p-3 rounded-xl text-[#CCCCFF]">
              <Wallet className="h-5 w-5 text-[#CCCCFF]" />
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
            placeholder="Search by studio owner name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Wallets Table */}
      <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[rgba(163,163,204,0.08)]">
            <thead className="bg-[#1e1e4f]">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Owner Partner</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Settled Value</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Total Recharged</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Sessions Cleared</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Last Top-up</th>
              </tr>
            </thead>
            <tbody className="bg-[#363675] divide-y divide-[rgba(163,163,204,0.06)]">
              {filteredWallets.length > 0 ? (
                filteredWallets.map((wallet) => (
                  <tr key={wallet.id} className="hover:bg-[#1e1e4f]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-9 h-9 bg-[#1e1e4f] text-[#CCCCFF] border border-[rgba(163,163,204,0.15)] rounded-xl flex items-center justify-center font-poppins font-bold text-xs shrink-0">
                          {(wallet.owner_name || 'O').charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="font-poppins font-bold text-xs text-white">{wallet.owner_name || 'Atelier Partner'}</p>
                          <p className="text-[11px] text-white/50 font-sans">{wallet.owner_email || 'partner@makemyhair.com'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-poppins font-bold text-sm text-[#CCCCFF]">{wallet.balance || 0}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-poppins font-bold text-xs text-[#CCCCFF] bg-[#CCCCFF]/10 border border-[#CCCCFF]/30 px-2.5 py-0.5 rounded-full">
                        ₹{((wallet.balance || 0) * 3).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-poppins text-xs text-white/70">
                      ₹{parseFloat(wallet.total_recharged || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-poppins text-xs text-white">
                      {wallet.total_bookings_used || 0} sessions
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-white/40 font-sans">
                      {wallet.last_recharged_at 
                        ? new Date(wallet.last_recharged_at).toLocaleDateString()
                        : 'Recent'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-white/40 font-sans text-xs">
                    No studio wallets found
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

export default WalletManagement;
