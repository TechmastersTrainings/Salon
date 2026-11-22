import { useState, useEffect } from 'react';
import { Scissors, Plus, Trash2, Edit, Clock, IndianRupee, Loader, X, Sparkles } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salonId, setSalonId] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isCustomService, setIsCustomService] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: '',
    price: ''
  });

  const suggestions = [
    "Signature Royal Scissor Cut", "Beard Sculpting & Hot Shave", 
    "French Balayage & Gloss", "Scalp Detox Mist Therapy", 
    "Charcoal Rejuvenation Facial", "Keratin Silk Infusion"
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const salonRes = await api.get('/salons/my-salons/');
      const salons = Array.isArray(salonRes.data) ? salonRes.data : salonRes.data?.results || [];
      if (salons.length === 0) {
        setSalonId(null);
        setServices([]);
        return;
      }
      const activeSalon = salons[0];
      setSalonId(activeSalon.id);

      const res = await api.get(`/services/salon/${activeSalon.id}/`);
      const srvList = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setServices(srvList);
    } catch (e) {
      console.error('Error fetching services:', e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salonId) {
      toast.error('Please create your studio profile first before publishing services');
      return;
    }
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}/`, formData);
        toast.success('Service updated!');
      } else {
        await api.post('/services/create/', { ...formData, salon: salonId });
        toast.success('Service published to menu!');
      }
      setShowModal(false);
      fetchServices();
    } catch (e) { 
      toast.error(editingService ? 'Failed to update service' : 'Failed to publish service');
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center bg-ivory">
        <div className="w-10 h-10 border-2 border-line border-t-rose-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-ink">Loading Services Menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pb-16 font-sans antialiased text-ink">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-200 text-rose-600 text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={12} className="text-rose-600" />
              Studio Offerings
            </div>
            <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-ink tracking-tight">Services & Treatments</h1>
            <p className="text-muted text-xs font-sans mt-1">Configure treatments, consultation durations, and session pricing</p>
          </div>
          
          <button 
            onClick={() => { 
              setEditingService(null); 
              setIsCustomService(false); 
              setFormData({ name: '', description: '', duration_minutes: '', price: '' }); 
              setShowModal(true); 
            }}
            className="bg-ink hover:bg-rose-600 text-ivory px-5 py-3 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 shadow-lg shadow-rose-200/40 hover:scale-[1.02]"
          >
            <Plus size={16} /> 
            <span>Add New Service</span>
          </button>
        </div>

        {/* Services List */}
        {services.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(s => (
              <div key={s.id} className="bg-surface p-6 rounded-2xl border border-line shadow-md hover:border-rose-300 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blush p-3 rounded-xl text-rose-600 border border-line group-hover:scale-105 transition-all">
                      <Scissors size={18} />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingService(s); setFormData(s); setShowModal(true); }} 
                        className="p-2 bg-blush text-ink rounded-xl hover:bg-ink hover:text-ivory transition-colors border border-line"
                        title="Edit Service"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-base font-poppins font-bold text-ink group-hover:text-rose-600 transition-colors">{s.name}</h3>
                  <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed font-sans">{s.description || 'Professional grooming service executed by master artisans.'}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-line flex justify-between items-center">
                  <span className="text-xl font-poppins font-bold text-ink">₹{s.price}</span>
                  <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-200">
                    {s.duration_minutes} Mins
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-line bg-surface p-8 max-w-xl mx-auto rounded-2xl">
            <Scissors size={40} className="mx-auto text-rose-600 mb-3 opacity-60" />
            <h3 className="text-base font-bold text-ink uppercase tracking-wider">No Services Configured</h3>
            <p className="text-xs text-muted mt-1 max-w-md mx-auto">
              Add your salon treatments, session durations, and pricing to build your booking menu.
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-blush/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-surface rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-line">
              <div className="px-6 py-5 flex justify-between items-center border-b border-line">
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-rose-600">Treatment Catalog</span>
                  <h2 className="text-lg font-poppins font-bold text-ink">
                    {editingService ? 'Edit Treatment' : 'Add New Treatment'}
                  </h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1.5 text-muted hover:text-ink rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-poppins font-medium uppercase tracking-wider text-body block mb-1.5">Service Title</label>
                  {!isCustomService ? (
                    <select 
                      className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-medium text-ink focus:border-rose-400 outline-none"
                      value={formData.name}
                      onChange={(e) => {
                        if (e.target.value === 'CUSTOM') setIsCustomService(true);
                        else setFormData({...formData, name: e.target.value});
                      }}
                      required
                    >
                      <option value="">Select a common service...</option>
                      {suggestions.map(opt => <option key={opt} value={opt} className="bg-blush text-ink">{opt}</option>)}
                      <option value="CUSTOM" className="bg-blush text-rose-600">+ Add custom title...</option>
                    </select>
                  ) : (
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="e.g. Keratin Silk Infusion" 
                        className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-medium text-ink focus:border-rose-400 outline-none placeholder:text-neutral-400"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        autoFocus
                        required
                      />
                      <button type="button" onClick={() => setIsCustomService(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-poppins font-semibold text-rose-600">
                        Templates
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-poppins font-medium uppercase tracking-wider text-body block mb-1.5">Price (₹)</label>
                    <input 
                      type="number" 
                      className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-medium text-ink focus:border-rose-400 outline-none" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: e.target.value})} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-poppins font-medium uppercase tracking-wider text-body block mb-1.5">Duration (Mins)</label>
                    <input 
                      type="number" 
                      className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-medium text-ink focus:border-rose-400 outline-none" 
                      value={formData.duration_minutes} 
                      onChange={e => setFormData({...formData, duration_minutes: e.target.value})} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-poppins font-medium uppercase tracking-wider text-body block mb-1.5">Description</label>
                  <textarea 
                    className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-sans focus:border-rose-400 outline-none h-20 resize-none text-ink placeholder:text-neutral-400" 
                    placeholder="Describe treatment procedures, products used, and benefits..." 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-ink hover:bg-rose-600 text-ivory py-3 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  {editingService ? 'Save Changes' : 'Publish to Menu'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;
