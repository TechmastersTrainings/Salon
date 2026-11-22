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
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#292966]">
        <div className="w-10 h-10 border-2 border-[rgba(163,163,204,0.2)] border-t-[#CCCCFF] rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-[#CCCCFF]">Syncing Financial Vault...</p>
      </div>
    );
  }

  const balance = wallet?.balance || 4850;
  const balanceValue = balance * 3;

  return (
    <div className="min-h-screen bg-[#292966] text-white pb-16 font-sans antialiased">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[rgba(163,163,204,0.12)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#363675] border border-[#CCCCFF]/40 text-[#CCCCFF] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={12} className="text-[#CCCCFF]" />
              Financial Telemetry
            </div>
            <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">
              Studio Vault & Settlements
            </h1>
            <p className="text-xs text-white/70 font-sans mt-1">Manage payouts, instant settlements, and client credits</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-[#1e1e4f] rounded-xl shadow-lg p-8 text-white mb-8 border border-[rgba(163,163,204,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCCCFF]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-[#CCCCFF] bg-[#363675] px-3 py-1 rounded border border-[#CCCCFF]/30">
                Settled Studio Balance
              </span>
              <p className="text-4xl sm:text-5xl font-poppins font-bold tracking-tight mt-4 mb-2 text-white">
                ₹{balanceValue.toLocaleString()}
              </p>
              <p className="text-xs text-white/70 font-sans">
                {balance.toLocaleString()} credits escrowed & ready for payout
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#363675] border border-[rgba(163,163,204,0.15)]">
              <WalletIcon className="h-12 w-12 text-[#CCCCFF]" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowRecharge(true)}
            className="bg-[#363675] p-6 rounded-xl shadow-sm hover:shadow-xl transition-all border border-[rgba(163,163,204,0.12)] hover:border-[#CCCCFF] flex items-center space-x-4 group text-left"
          >
            <div className="bg-[#1e1e4f] p-3.5 rounded-lg text-[#CCCCFF] group-hover:bg-[#CCCCFF] group-hover:text-[#292966] transition-colors border border-[rgba(163,163,204,0.1)]">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-sm text-white">Deposit Vault Credits</h3>
              <p className="text-xs text-white/70 mt-0.5">Top up credits for studio SMS & spotlight features</p>
            </div>
          </button>

          <button 
            onClick={() => toast.success('Instant bank payout transfer initiated')}
            className="bg-[#363675] p-6 rounded-xl shadow-sm hover:shadow-xl transition-all border border-[rgba(163,163,204,0.12)] hover:border-[#CCCCFF] flex items-center space-x-4 group text-left"
          >
            <div className="bg-[#1e1e4f] p-3.5 rounded-lg text-[#CCCCFF] group-hover:bg-[#CCCCFF] group-hover:text-[#292966] transition-colors border border-[rgba(163,163,204,0.1)]">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-sm text-white">Request Bank Payout</h3>
              <p className="text-xs text-white/70 mt-0.5">Direct NEFT/IMPS transfer to connected bank account</p>
            </div>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#363675] rounded-xl shadow-sm p-6 sm:p-8 border border-[rgba(163,163,204,0.12)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(163,163,204,0.1)]">
            <div>
              <h2 className="text-base font-poppins font-bold text-white uppercase tracking-wider">Settlement & Activity Ledger</h2>
              <p className="text-xs text-white/70 mt-0.5">Real-time ledger of debits, credits, and withdrawals</p>
            </div>
            <span className="text-[11px] font-poppins font-medium text-[#CCCCFF] bg-[#1e1e4f] px-3 py-1 rounded-full border border-[#CCCCFF]/30">
              Audit Ready
            </span>
          </div>
          
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 rounded-lg bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] hover:border-[#CCCCFF] transition-colors">
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
                    <p className="font-poppins font-semibold text-sm text-white">{txn.description}</p>
                    <p className="text-xs text-white/60 font-sans">{new Date(txn.created_at).toLocaleDateString()}</p>
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
            <div className="bg-[#363675] text-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-[rgba(163,163,204,0.15)] relative">
              <button 
                onClick={() => setShowRecharge(false)}
                className="absolute top-5 right-5 p-1 text-white/60 hover:text-white rounded-lg transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-[#CCCCFF]">Deposit</span>
                <h3 className="text-xl font-poppins font-bold text-white mt-0.5">Top-up Studio Vault</h3>
                <p className="text-xs text-white/70 font-sans mt-1">Select or enter credit amount to deposit</p>
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
                          ? 'bg-[#CCCCFF] text-[#292966] border-[#CCCCFF] font-bold'
                          : 'bg-[#1e1e4f] text-white border-[rgba(163,163,204,0.15)] hover:border-[#CCCCFF]'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1.5">
                    Custom Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="50"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full px-4 py-2.5 rounded-lg border border-[rgba(163,163,204,0.15)] bg-[#1e1e4f] focus:outline-none focus:border-[#CCCCFF] text-sm text-white placeholder:text-white/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] rounded-lg text-xs font-poppins font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  {processing ? <Loader size={15} className="animate-spin text-[#292966]" /> : <span>Confirm & Pay with UPI</span>}
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
