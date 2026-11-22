import { useState, useEffect } from 'react';
import { 
  Scissors, 
  Search, 
  Clock, 
  IndianRupee, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Loader, 
  Store,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [salonFilter, setSalonFilter] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services/');
      const servicesData = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      await api.patch(`/services/${serviceId}/`, {
        is_active: !currentStatus
      });
      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchServices();
    } catch (error) {
      toast.error('Failed to update service status');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/services/${serviceId}/`);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const uniqueSalons = [...new Set(services.map(s => s.salon_name).filter(Boolean))];

  const filteredServices = (services || []).filter(service => {
    const matchesSearch = 
      (service.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.salon_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSalon = salonFilter === 'all' || service.salon_name === salonFilter;

    return matchesSearch && matchesSalon;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#292966]">
        <div className="w-10 h-10 border-2 border-[rgba(163,163,204,0.15)] border-t-[#CCCCFF] rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-white">Loading Service Directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans antialiased text-white">
      <div className="pb-6 border-b border-[rgba(163,163,204,0.12)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCCCFF]/10 border border-[#CCCCFF]/30 text-[#CCCCFF] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
          <Sparkles size={12} className="text-[#CCCCFF]" />
          Treatments & Services
        </div>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">Service Catalog Directory</h1>
        <p className="text-white/60 text-xs font-sans mt-0.5">Global overview of all services, pricing tiers, and durations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">Total Services</p>
              <p className="text-2xl font-poppins font-bold text-white mt-1">{services.length}</p>
            </div>
            <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] p-3 rounded-xl text-[#CCCCFF]">
              <Scissors className="h-5 w-5 text-[#CCCCFF]" />
            </div>
          </div>
        </div>

        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">Active Services</p>
              <p className="text-2xl font-poppins font-bold text-emerald-400 mt-1">
                {services.filter(s => s.is_active).length}
              </p>
            </div>
            <div className="bg-emerald-500/15 border border-emerald-500/30 p-3 rounded-xl text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-white/60">Avg. Ticket Price</p>
              <p className="text-2xl font-poppins font-bold text-[#CCCCFF] mt-1">
                ₹{services.length > 0 
                  ? Math.round(services.reduce((sum, s) => sum + parseFloat(s.price || 0), 0) / services.length)
                  : 0}
              </p>
            </div>
            <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] p-3 rounded-xl text-[#CCCCFF]">
              <IndianRupee className="h-5 w-5 text-[#CCCCFF]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search services by title or salon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white placeholder:text-white/40"
            />
          </div>

          <select
            value={salonFilter}
            onChange={(e) => setSalonFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
          >
            <option value="all" className="bg-[#1e1e4f]">All Salons</option>
            {uniqueSalons.map(salon => (
              <option key={salon} value={salon} className="bg-[#1e1e4f]">{salon}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[rgba(163,163,204,0.08)]">
            <thead className="bg-[#1e1e4f]">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Salon</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#363675] divide-y divide-[rgba(163,163,204,0.06)]">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-[#1e1e4f]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-9 h-9 bg-[#1e1e4f] text-[#CCCCFF] border border-[rgba(163,163,204,0.15)] rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                          <Scissors className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <div className="font-poppins font-bold text-xs text-white">{service.name}</div>
                          {service.description && (
                            <div className="text-[11px] text-white/50 truncate max-w-xs font-sans">{service.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-xs text-white/70 font-sans">
                        <Store className="h-3.5 w-3.5 text-white/40 mr-1.5 shrink-0" />
                        <span>{service.salon_name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-xs text-white/70 font-sans">
                        <Clock className="h-3.5 w-3.5 text-white/40 mr-1.5 shrink-0" />
                        <span>{service.duration_minutes} mins</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-poppins font-bold text-xs text-[#CCCCFF]">
                        ₹{parseFloat(service.price || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider border ${
                        service.is_active 
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleToggleServiceStatus(service.id, service.is_active)}
                          className={`p-2 rounded-xl bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] transition-colors ${
                            service.is_active ? 'text-amber-400 hover:text-amber-300' : 'text-[#CCCCFF] hover:text-[#b8b8f5]'
                          }`}
                          title={service.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {service.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 rounded-xl bg-[#1e1e4f] text-rose-400 hover:text-rose-300 border border-[rgba(163,163,204,0.1)] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-white/40 font-sans text-xs">
                    No services found matching filters
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

export default AdminServices;
