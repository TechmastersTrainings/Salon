import { useState, useEffect } from 'react';
import { 
  Store, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Scissors, 
  Eye, 
  Edit, 
  Plus, 
  X, 
  CheckCircle, 
  XCircle, 
  Loader, 
  Clock,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SalonManagement = () => {
  const [salons, setSalons] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSalon, setEditingSalon] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    opening_time: '09:00',
    closing_time: '20:00',
    owner: ''
  });

  useEffect(() => {
    fetchSalons();
    fetchOwners();
  }, []);

  const fetchSalons = async () => {
    try {
      const response = await api.get('/salons/');
      const salonsData = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setSalons(salonsData);
    } catch (error) {
      console.error('Error fetching salons:', error);
      toast.error('Failed to fetch salons');
      setSalons([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await api.get('/accounts/users/?role=owner');
      const usersData = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setOwners(usersData);
    } catch (error) {
      console.error('Error fetching owners:', error);
    }
  };

  const handleToggleSalonStatus = async (salonId, currentStatus) => {
    try {
      await api.patch(`/salons/${salonId}/`, {
        is_active: !currentStatus
      });
      toast.success(`Salon ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchSalons();
    } catch (error) {
      toast.error('Failed to update salon status');
    }
  };

  const handleDeleteSalon = async (salonId, salonName) => {
    if (!window.confirm(`Are you sure you want to delete "${salonName}"?`)) return;
    
    try {
      await api.delete(`/salons/${salonId}/`);
      toast.success('Salon deleted successfully');
      fetchSalons();
    } catch (error) {
      toast.error('Failed to delete salon');
    }
  };

  const handleEdit = (salon) => {
    setEditingSalon(salon);
    setFormData({
      name: salon.name || '',
      description: salon.description || '',
      phone: salon.phone || '',
      email: salon.email || '',
      address: salon.address || '',
      city: salon.city || '',
      state: salon.state || '',
      postal_code: salon.postal_code || '',
      opening_time: salon.opening_time || '09:00',
      closing_time: salon.closing_time || '20:00',
      owner: salon.owner || ''
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingSalon(null);
    setFormData({
      name: '',
      description: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      opening_time: '09:00',
      closing_time: '20:00',
      owner: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSalon) {
        await api.patch(`/salons/${editingSalon.id}/`, formData);
        toast.success('Salon updated successfully');
      } else {
        await api.post('/salons/', formData);
        toast.success('Salon created successfully');
      }
      setShowModal(false);
      fetchSalons();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message || 
                      (editingSalon ? 'Failed to update salon' : 'Failed to create salon');
      toast.error(errorMsg);
      console.error('Submit error:', error.response?.data);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const cities = [...new Set(salons.map(s => s.city).filter(Boolean))];

  const filteredSalons = (salons || []).filter(salon => {
    const matchesSearch = 
      (salon.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (salon.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (salon.phone || '').includes(searchTerm);
    
    const matchesCity = cityFilter === 'all' || salon.city === cityFilter;

    return matchesSearch && matchesCity;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#292966]">
        <div className="w-10 h-10 border-2 border-[rgba(163,163,204,0.15)] border-t-[#CCCCFF] rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-white">Loading Studio Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans antialiased text-white">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-[rgba(163,163,204,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCCCFF]/10 border border-[#CCCCFF]/30 text-[#CCCCFF] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-[#CCCCFF]" />
            Studio Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">Salon Management</h1>
          <p className="text-white/60 text-xs font-sans mt-0.5">Manage all registered salons, store locations, and owner assignments</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] px-5 py-2.5 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shrink-0 shadow-lg shadow-[#CCCCFF]/10 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Salon</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by salon name, city, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white placeholder:text-white/40"
            />
          </div>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
          >
            <option value="all" className="bg-[#1e1e4f]">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city} className="bg-[#1e1e4f]">{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Salon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSalons.length > 0 ? (
          filteredSalons.map((salon) => (
            <div key={salon.id} className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] hover:border-[#CCCCFF]/40 transition-all overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="h-48 bg-[#1e1e4f] relative overflow-hidden">
                  {salon.images && salon.images[0] ? (
                    <img src={salon.images[0].image} alt={salon.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1e1e4f]">
                      <Store className="h-14 w-14 text-[#CCCCFF]/30" />
                    </div>
                  )}
                  <div className="absolute top-3.5 right-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider border ${
                      salon.is_active 
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}>
                      {salon.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-poppins font-bold text-white mb-2">{salon.name}</h3>
                  
                  <div className="space-y-1.5 mb-4 text-xs text-white/70 font-sans">
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-2 text-[#CCCCFF] shrink-0" />
                      <span className="truncate">{salon.address ? `${salon.address.substring(0, 30)}...` : 'N/A'}, {salon.city || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-2 text-white/40 shrink-0" />
                      <span>{salon.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-2 text-white/40 shrink-0" />
                      <span>{salon.opening_time} - {salon.closing_time}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 mr-2 text-white/40 shrink-0" />
                      <span>Owner: {salon.owner_name || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between pt-4 border-t border-[rgba(163,163,204,0.08)]">
                  <div className="flex space-x-4">
                    <div className="text-left">
                      <span className="text-[10px] font-poppins font-medium uppercase tracking-wider text-white/40 block">Staff</span>
                      <span className="text-xs font-poppins font-bold text-[#CCCCFF]">{salon.staff_count || 0} specialists</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-poppins font-medium uppercase tracking-wider text-white/40 block">Services</span>
                      <span className="text-xs font-poppins font-bold text-[#CCCCFF]">{salon.service_count || 0} treatments</span>
                    </div>
                  </div>

                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => window.open(`/salon/${salon.id}`, '_blank')}
                      className="p-2 rounded-xl bg-[#1e1e4f] text-white/70 hover:text-[#CCCCFF] border border-[rgba(163,163,204,0.1)] transition-colors"
                      title="View Public Page"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(salon)}
                      className="p-2 rounded-xl bg-[#1e1e4f] text-white/70 hover:text-[#CCCCFF] border border-[rgba(163,163,204,0.1)] transition-colors"
                      title="Edit Salon"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleSalonStatus(salon.id, salon.is_active)}
                      className={`p-2 rounded-xl bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] transition-colors ${
                        salon.is_active ? 'text-amber-400 hover:text-amber-300' : 'text-[#CCCCFF] hover:text-[#b8b8f5]'
                      }`}
                      title={salon.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {salon.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-16 text-white/40 font-sans text-xs">
            <Store className="h-10 w-10 mx-auto mb-2 text-white/30" />
            <p>No salons matching current filters</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1e1e4f]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#363675] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[rgba(163,163,204,0.15)]">
            <div className="p-6 border-b border-[rgba(163,163,204,0.1)] sticky top-0 bg-[#363675] flex justify-between items-center z-10">
              <div>
                <span className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-[#CCCCFF]">Salon Registry</span>
                <h2 className="text-lg font-poppins font-bold text-white">
                  {editingSalon ? 'Edit Salon Details' : 'Establish New Salon'}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-white/60 hover:text-white rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Salon Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Owner Partner *</label>
                  <select
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                  >
                    <option value="" className="bg-[#1e1e4f]">Select Partner Account</option>
                    {owners.map(owner => (
                      <option key={owner.id} value={owner.id} className="bg-[#1e1e4f]">
                        {owner.username || owner.email} {!owner.is_owner_approved ? '(Pending KYC)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-sans focus:outline-none focus:border-[#CCCCFF] text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 col-span-2">
                  <div>
                    <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Opening Time *</label>
                    <input
                      type="time"
                      name="opening_time"
                      value={formData.opening_time}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Closing Time *</label>
                    <input
                      type="time"
                      name="closing_time"
                      value={formData.closing_time}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[rgba(163,163,204,0.1)]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[rgba(163,163,204,0.2)] text-white/70 rounded-xl text-xs font-poppins font-medium hover:bg-[#1e1e4f] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  {editingSalon ? 'Update Salon' : 'Create Salon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonManagement;
