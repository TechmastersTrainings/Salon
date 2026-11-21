import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle,
  Mail,
  Phone,
  Calendar,
  Loader,
  Clock,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const OwnerApprovals = () => {
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingOwners();
  }, []);

  const fetchPendingOwners = async () => {
    try {
      const response = await api.get('/accounts/users/?role=owner');
      const users = Array.isArray(response.data) ? response.data : response.data?.results || [];
      const pending = users.filter(u => u.role === 'owner' && !u.is_owner_approved);
      setPendingOwners(pending);
    } catch (error) {
      console.error('Error fetching pending owners:', error);
      toast.error('Failed to fetch pending owners');
      setPendingOwners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOwner = async (ownerId) => {
    const previousOwners = [...pendingOwners];
    setPendingOwners(prev => prev.filter(owner => owner.id !== ownerId));
    setProcessingId(ownerId);

    try {
      await api.patch(`/accounts/users/${ownerId}/`, {
        is_owner_approved: true
      });
      toast.success('Owner approved successfully');
    } catch (error) {
      try {
        await api.put(`/accounts/users/${ownerId}/`, {
          is_owner_approved: true
        });
        toast.success('Owner approved successfully');
      } catch (putError) {
        setPendingOwners(previousOwners);
        toast.error('Failed to approve owner. Reverting changes.');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectOwner = async (ownerId) => {
    if (!window.confirm('Are you sure you want to reject this owner?')) return;

    const previousOwners = [...pendingOwners];
    setPendingOwners(prev => prev.filter(owner => owner.id !== ownerId));
    setProcessingId(ownerId);

    try {
      await api.delete(`/accounts/users/${ownerId}/`);
      toast.success('Owner application rejected');
    } catch (error) {
      setPendingOwners(previousOwners);
      toast.error('Failed to reject owner');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#292966]">
        <div className="w-10 h-10 border-2 border-[rgba(163,163,204,0.15)] border-t-[#CCCCFF] rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-white">Verifying Owner Pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans antialiased text-white">
      <div className="pb-6 border-b border-[rgba(163,163,204,0.12)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCCCFF]/10 border border-[#CCCCFF]/30 text-[#CCCCFF] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
          <Sparkles size={12} className="text-[#CCCCFF]" />
          KYC & Governance
        </div>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">Studio Partner Approvals</h1>
        <p className="text-white/60 text-xs font-sans mt-1">Review credentials and activate studio partner commercial storefronts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">Pending Approvals</p>
              <p className="text-3xl font-poppins font-bold text-[#CCCCFF] mt-1">{pendingOwners.length}</p>
            </div>
            <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] p-3.5 rounded-xl text-[#CCCCFF]">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Owners List */}
      <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(163,163,204,0.1)] flex items-center justify-between">
          <h2 className="text-sm font-poppins font-bold text-white uppercase tracking-wider">Verification Queue</h2>
          <span className="text-[11px] font-poppins font-bold text-[#CCCCFF] bg-[#CCCCFF]/10 px-2.5 py-0.5 rounded-full border border-[#CCCCFF]/30">
            {pendingOwners.length} Awaiting Review
          </span>
        </div>

        {pendingOwners.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-[#CCCCFF]/15 border border-[#CCCCFF]/30 text-[#CCCCFF] flex items-center justify-center mx-auto mb-3">
              <Check className="h-6 w-6" />
            </div>
            <p className="font-poppins font-bold text-sm text-white">No pending studio applications</p>
            <p className="text-xs text-white/40 font-sans mt-0.5">All partner registration requests have been cleared</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(163,163,204,0.06)]">
            {pendingOwners.map((owner) => (
              <div key={owner.id} className="p-6 hover:bg-[#1e1e4f]/40 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#1e1e4f] text-[#CCCCFF] border border-[rgba(163,163,204,0.15)] rounded-xl flex items-center justify-center font-poppins font-bold text-sm shrink-0">
                        {(owner.username || owner.email || 'O').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-poppins font-bold text-white">{owner.username || owner.email}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1.5">
                          <div className="flex items-center text-xs text-white/70 font-sans">
                            <Mail className="h-3.5 w-3.5 mr-1.5 text-white/40" />
                            {owner.email}
                          </div>
                          {owner.phone && (
                            <div className="flex items-center text-xs text-white/70 font-sans">
                              <Phone className="h-3.5 w-3.5 mr-1.5 text-white/40" />
                              {owner.phone}
                            </div>
                          )}
                          <div className="flex items-center text-xs text-white/50 font-sans">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-white/40" />
                            Applied: {owner.created_at ? new Date(owner.created_at).toLocaleDateString() : 'Recent'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => handleApproveOwner(owner.id)}
                      disabled={processingId === owner.id}
                      className="flex items-center space-x-2 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] px-4 py-2.5 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-md"
                    >
                      {processingId === owner.id ? (
                        <Loader className="h-4 w-4 animate-spin text-[#292966]" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-[#292966]" />
                      )}
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleRejectOwner(owner.id)}
                      disabled={processingId === owner.id}
                      className="flex items-center space-x-2 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] text-rose-400 hover:bg-rose-500/10 px-4 py-2.5 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {processingId === owner.id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerApprovals;
