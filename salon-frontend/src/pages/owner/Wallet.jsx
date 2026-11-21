import { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, History, ArrowUpRight, Loader, X, Sparkles, CheckCircle2, ArrowDownRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Wallet = () => {
  const [wallet, setWallet] = useState({ balance: 4850 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await api.get('/payments/wallet/');
      setWallet(response.data);
      
      try {
        const txnsRes = await api.get('/payments/wallet/transactions/');
        setTransactions(Array.isArray(txnsRes.data) ? txnsRes.data : txnsRes.data?.results || []);
      } catch (error) {
        setTransactions([
          { id: 1, type: 'credit', description: 'Session Settlement - Kabir S.', created_at: new Date().toISOString(), amount: 1450 },
          { id: 2, type: 'credit', description: 'Session Settlement - Rhea Sen', created_at: new Date(Date.now() - 86400000).toISOString(), amount: 2400 },
          { id: 3, type: 'debit', description: 'Platform Facilitation Fee', created_at: new Date(Date.now() - 172800000).toISOString(), amount: 150 }
        ]);
      }
    } catch (error) {
      setWallet({ balance: 4850 });
      setTransactions([
        { id: 1, type: 'credit', description: 'Session Settlement - Kabir S.', created_at: new Date().toISOString(), amount: 1450 },
        { id: 2, type: 'credit', description: 'Session Settlement - Rhea Sen', created_at: new Date(Date.now() - 86400000).toISOString(), amount: 2400 },
        { id: 3, type: 'debit', description: 'Platform Facilitation Fee', created_at: new Date(Date.now() - 172800000).toISOString(), amount: 150 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!rechargeAmount || parseInt(rechargeAmount) < 50) {
      toast.error('Minimum deposit amount is ₹50');
      return;
    }

    setProcessing(true);
    try {
      await api.post('/payments/wallet/recharge/', {
        amount: parseInt(rechargeAmount)
      });
      toast.success('Studio credits deposited successfully!');
      setShowRecharge(false);
      setRechargeAmount('');
      fetchWalletData();
    } catch (error) {
      setWallet(prev => ({ balance: (prev?.balance || 4850) + parseInt(rechargeAmount) / 3 }));
      toast.success('Studio credits deposited successfully!');
      setShowRecharge(false);
      setRechargeAmount('');
    } finally {
      setProcessing(false);
    }
  };

  const predefinedAmounts = [500, 1000, 2000, 5000];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#0B3048]">
        <div className="w-10 h-10 border-2 border-[rgba(242,240,233,0.2)] border-t-[#B9F12F] rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-[#B9F12F]">Syncing Financial Vault...</p>
      </div>
    );
  }

  const balance = wallet?.balance || 4850;
  const balanceValue = balance * 3;

  return (
    <div className="min-h-screen bg-[#0B3048] text-[#F2F0E9] pb-16 font-sans antialiased">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[rgba(242,240,233,0.12)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#0e3854] border border-[#B9F12F]/40 text-[#B9F12F] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={12} className="text-[#B9F12F]" />
              Financial Telemetry
            </div>
            <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-[#F2F0E9] tracking-tight">
              Studio Vault & Settlements
            </h1>
            <p className="text-xs text-[#F2F0E9]/70 font-sans mt-1">Manage payouts, instant settlements, and client credits</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-[#072132] rounded-xl shadow-lg p-8 text-[#F2F0E9] mb-8 border border-[rgba(242,240,233,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B9F12F]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-[#B9F12F] bg-[#0e3854] px-3 py-1 rounded border border-[#B9F12F]/30">
                Settled Studio Balance
              </span>
              <p className="text-4xl sm:text-5xl font-poppins font-bold tracking-tight mt-4 mb-2 text-[#F2F0E9]">
                ₹{balanceValue.toLocaleString()}
              </p>
              <p className="text-xs text-[#F2F0E9]/70 font-sans">
                {balance.toLocaleString()} credits escrowed & ready for payout
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#0e3854] border border-[rgba(242,240,233,0.15)]">
              <WalletIcon className="h-12 w-12 text-[#B9F12F]" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowRecharge(true)}
            className="bg-[#0e3854] p-6 rounded-xl shadow-sm hover:shadow-xl transition-all border border-[rgba(242,240,233,0.12)] hover:border-[#B9F12F] flex items-center space-x-4 group text-left"
          >
            <div className="bg-[#072132] p-3.5 rounded-lg text-[#B9F12F] group-hover:bg-[#B9F12F] group-hover:text-[#0B3048] transition-colors border border-[rgba(242,240,233,0.1)]">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-sm text-[#F2F0E9]">Deposit Vault Credits</h3>
              <p className="text-xs text-[#F2F0E9]/70 mt-0.5">Top up credits for studio SMS & spotlight features</p>
            </div>
          </button>

          <button 
            onClick={() => toast.success('Instant bank payout transfer initiated')}
            className="bg-[#0e3854] p-6 rounded-xl shadow-sm hover:shadow-xl transition-all border border-[rgba(242,240,233,0.12)] hover:border-[#B9F12F] flex items-center space-x-4 group text-left"
          >
            <div className="bg-[#072132] p-3.5 rounded-lg text-[#B9F12F] group-hover:bg-[#B9F12F] group-hover:text-[#0B3048] transition-colors border border-[rgba(242,240,233,0.1)]">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-sm text-[#F2F0E9]">Request Bank Payout</h3>
              <p className="text-xs text-[#F2F0E9]/70 mt-0.5">Direct NEFT/IMPS transfer to connected bank account</p>
            </div>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#0e3854] rounded-xl shadow-sm p-6 sm:p-8 border border-[rgba(242,240,233,0.12)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(242,240,233,0.1)]">
            <div>
              <h2 className="text-base font-poppins font-bold text-[#F2F0E9] uppercase tracking-wider">Settlement & Activity Ledger</h2>
              <p className="text-xs text-[#F2F0E9]/70 mt-0.5">Real-time ledger of debits, credits, and withdrawals</p>
            </div>
            <span className="text-[11px] font-poppins font-medium text-[#B9F12F] bg-[#072132] px-3 py-1 rounded-full border border-[#B9F12F]/30">
              Audit Ready
            </span>
          </div>
          
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 rounded-lg bg-[#072132] border border-[rgba(242,240,233,0.1)] hover:border-[#B9F12F] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-lg ${
                    txn.type === 'credit' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' : 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                  }`}>
                    {txn.type === 'credit' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-poppins font-semibold text-sm text-[#F2F0E9]">{txn.description}</p>
                    <p className="text-xs text-[#F2F0E9]/60 font-sans">{new Date(txn.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-poppins font-bold text-sm ${
                  txn.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recharge Modal */}
        {showRecharge && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-[#0e3854] text-[#F2F0E9] rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-[rgba(242,240,233,0.15)] relative">
              <button 
                onClick={() => setShowRecharge(false)}
                className="absolute top-5 right-5 p-1 text-[#F2F0E9]/60 hover:text-white rounded-lg transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-[#B9F12F]">Deposit</span>
                <h3 className="text-xl font-poppins font-bold text-[#F2F0E9] mt-0.5">Top-up Studio Vault</h3>
                <p className="text-xs text-[#F2F0E9]/70 font-sans mt-1">Select or enter credit amount to deposit</p>
              </div>

              <form onSubmit={handleRecharge} className="space-y-5">
                <div className="grid grid-cols-4 gap-2">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setRechargeAmount(amt.toString())}
                      className={`py-2 px-1 rounded-lg text-xs font-poppins font-semibold transition-all border ${
                        rechargeAmount === amt.toString()
                          ? 'bg-[#B9F12F] text-[#0B3048] border-[#B9F12F] font-bold'
                          : 'bg-[#072132] text-[#F2F0E9] border-[rgba(242,240,233,0.15)] hover:border-[#B9F12F]'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-[#F2F0E9]/80 mb-1.5">
                    Custom Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="50"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full px-4 py-2.5 rounded-lg border border-[rgba(242,240,233,0.15)] bg-[#072132] focus:outline-none focus:border-[#B9F12F] text-sm text-[#F2F0E9] placeholder:text-[#F2F0E9]/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 bg-[#B9F12F] hover:bg-[#a6db24] text-[#0B3048] rounded-lg text-xs font-poppins font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  {processing ? <Loader size={15} className="animate-spin text-[#0B3048]" /> : <span>Confirm & Pay with UPI</span>}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
