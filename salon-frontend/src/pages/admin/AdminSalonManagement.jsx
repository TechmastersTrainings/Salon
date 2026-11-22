import { useState, useEffect } from 'react';
import { 
  Store, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Phone, 
  Mail, 
  Loader, 
  Sparkles 
} from 'lucide-react';
import { adminSalonService } from '../../services/adminSalonService';
import toast from 'react-hot-toast';

const SalonManagement = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    setLoading(true);
    try {
      const data = await adminSalonService.getSalons();
      setSalons(data);
    } catch (error) {
      toast.error('Failed to fetch salons');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await adminSalonService.deleteSalon(id);
      toast.success('Salon deleted successfully');
      fetchSalons();
    } catch (error) {
      toast.error('Failed to delete salon');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminSalonService.toggleSalonStatus(id);
      toast.success(`Salon ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchSalons();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredSalons = salons.filter(salon => 
    salon.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#292966]">
        <div className="w-10 h-10 border-2 border-[rgba(163,163,204,0.15)] border-t-[#CCCCFF] rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-white">Loading Salons...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans antialiased text-white">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-[rgba(163,163,204,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCCCFF]/10 border border-[#CCCCFF]/30 text-[#CCCCFF] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-[#CCCCFF]" />
            Studio Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">Salon Management</h1>
          <p className="text-white/60 text-xs font-sans mt-0.5">Directory overview of all registered salons</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <input
          type="text"
          placeholder="Search salons by name, city, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white placeholder:text-white/40"
        />
      </div>

      {/* Salons Table */}
      <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] overflow-hidden">
        <table className="min-w-full divide-y divide-[rgba(163,163,204,0.08)]">
          <thead className="bg-[#1e1e4f]">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Salon</th>
              <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(163,163,204,0.06)] bg-[#363675]">
            {filteredSalons.map((salon) => (
              <tr key={salon.id} className="hover:bg-[#1e1e4f]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#1e1e4f] text-[#CCCCFF] border border-[rgba(163,163,204,0.15)] rounded-xl flex items-center justify-center font-poppins font-bold text-xs shrink-0">
                      <Store className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <div className="font-poppins font-bold text-xs text-white">{salon.name}</div>
                      <div className="text-[11px] text-white/40 font-sans">ID #{salon.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-xs text-white/70 font-sans">
                    <MapPin className="h-3.5 w-3.5 text-[#CCCCFF] mr-1.5 shrink-0" />
                    <span>{salon.city || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-0.5 text-xs text-white/70 font-sans">
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 text-white/40 mr-1.5 shrink-0" />
                      <span>{salon.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 text-white/40 mr-1.5 shrink-0" />
                      <span className="truncate max-w-[200px]">{salon.email || 'N/A'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleStatus(salon.id, salon.is_active)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider border ${
                      salon.is_active 
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {salon.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right space-x-1.5">
                  <button onClick={() => window.open(`/salon/${salon.id}`, '_blank')} className="p-2 rounded-xl bg-[#1e1e4f] text-white/70 hover:text-[#CCCCFF] border border-[rgba(163,163,204,0.1)] transition-colors" title="View">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(salon.id, salon.name)}
                    className="p-2 rounded-xl bg-[#1e1e4f] text-rose-400 hover:text-rose-300 border border-[rgba(163,163,204,0.1)] transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalonManagement;
