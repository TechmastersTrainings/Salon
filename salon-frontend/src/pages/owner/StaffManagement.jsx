import { useState, useEffect } from 'react';
import { 
  UserPlus, Edit, Trash2, Loader, CheckCircle, XCircle, 
  Briefcase, Mail, BadgeCheck, X, Sparkles, User 
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [salonServices, setSalonServices] = useState([]);
  const [salonId, setSalonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  
  const [formData, setFormData] = useState({ 
    first_name: '', last_name: '', email: '', password: '', 
    bio: '', experience_years: '', services: [] 
  });

  useEffect(() => {
    fetchSalonAndStaff();
  }, []);

  const fetchSalonAndStaff = async () => {
    try {
      const salonRes = await api.get('/salons/my-salons/');
      const salons = salonRes.data?.results || salonRes.data || [];
      if (salons.length === 0) {
        setSalonId(null);
        setStaff([]);
        setSalonServices([]);
        return;
      }

      const currentSalon = salons[0];
      setSalonId(currentSalon.id);

      const [staffRes, servicesRes] = await Promise.allSettled([
        api.get(`/staff/salon/${currentSalon.id}/`),
        api.get(`/services/salon/${currentSalon.id}/`)
      ]);

      const staffData = staffRes.status === 'fulfilled' ? (staffRes.value.data?.results || staffRes.value.data || []) : [];
      const srvData = servicesRes.status === 'fulfilled' ? (servicesRes.value.data?.results || servicesRes.value.data || []) : [];

      setStaff(staffData);
      setSalonServices(srvData);
    } catch (error) {
      console.error('Error fetching salon staff:', error);
      setStaff([]);
      setSalonServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salonId) {
      toast.error('Please create your studio profile first before adding staff');
      return;
    }
    try {
      if (editingStaff) {
        await api.put(`/staff/${editingStaff.id}/`, {
          bio: formData.bio,
          experience_years: parseInt(formData.experience_years) || 0,
          services: formData.services
        });
        toast.success('Specialist updated');
      } else {
        await api.post('/staff/create/', { ...formData, salon_id: salonId });
        toast.success('Specialist added');
      }
      setShowForm(false);
      fetchSalonAndStaff();
    } catch (error) {
      toast.error(editingStaff ? 'Failed to update specialist' : 'Failed to add specialist');
    }
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    const names = (member.name || '').split(' ');
    setFormData({
      first_name: member.user_details?.first_name || names[0] || '',
      last_name: member.user_details?.last_name || names.slice(1).join(' ') || '',
      email: member.user_details?.email || '',
      bio: member.bio || member.role || '',
      experience_years: member.experience_years?.toString() || '5',
      services: member.services_details?.map(s => s.id) || []
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center bg-ivory">
        <div className="w-10 h-10 border-2 border-line border-t-rose-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-ink">Loading Specialist Roster...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pb-16 font-sans antialiased text-ink">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-200 text-rose-600 text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={12} className="text-rose-600" />
              Artisan Talent
            </div>
            <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-ink tracking-tight">Specialists & Stylists</h1>
            <p className="text-muted text-xs font-sans mt-0.5">Active Resident Artisans: <span className="text-rose-600 font-bold">{staff.length}</span></p>
          </div>
          
          <button 
            onClick={() => { 
              setEditingStaff(null); 
              setFormData({ first_name: '', last_name: '', email: '', password: '', bio: '', experience_years: '', services: [] });
              setShowForm(true); 
            }}
            className="bg-ink hover:bg-rose-600 text-ivory px-5 py-3 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 shadow-lg shadow-rose-200/40 hover:scale-[1.02]"
          >
            <UserPlus size={16} /> 
            <span>Add Specialist</span>
          </button>
        </div>

        {/* Compact Grid */}
        {staff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <div key={member.id} className="bg-surface rounded-2xl border border-line p-6 shadow-md hover:border-rose-300 transition-all group relative overflow-hidden flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blush text-rose-600 border border-line flex items-center justify-center font-poppins text-lg font-bold shadow-sm shrink-0">
                      {(member.name || member.user_details?.first_name || member.user_details?.username || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-poppins font-bold text-ink text-base leading-tight">
                        {member.name || `${member.user_details?.first_name || ''} ${member.user_details?.last_name || ''}`.trim() || member.user_details?.username || 'Specialist'}
                      </h3>
                      <p className="text-rose-600 text-xs font-poppins font-medium mt-0.5">
                        {member.role || member.bio || 'Resident Stylist'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-5 text-xs text-body font-sans">
                    <div className="flex items-center gap-2">
                      <BadgeCheck size={14} className="text-rose-600 shrink-0" /> 
                      <span>{member.experience_years || 5} Years Mastery</span>
                    </div>
                    {member.user_details?.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-neutral-400 shrink-0" /> 
                        <span className="truncate">{member.user_details.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-line flex gap-2">
                  <button 
                    onClick={() => handleEdit(member)}
                    className="flex-1 py-2.5 bg-blush border border-line text-ink hover:bg-ink hover:text-ivory hover:border-rose-400 rounded-xl font-poppins font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Edit Profile
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-line bg-surface p-8 max-w-xl mx-auto rounded-2xl">
            <User size={40} className="mx-auto text-rose-600 mb-3 opacity-60" />
            <h3 className="text-base font-bold text-ink uppercase tracking-wider">No Specialists Added</h3>
            <p className="text-xs text-muted mt-1 max-w-md mx-auto">
              Add your master stylists, barbers, and technicians to let customers book them.
            </p>
          </div>
        )}

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-blush/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-surface rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-line">
              <div className="px-6 py-5 flex justify-between items-center border-b border-line">
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-rose-600">Roster Management</span>
                  <h2 className="text-lg font-poppins font-bold text-ink">
                    {editingStaff ? 'Edit Specialist' : 'Add New Specialist'}
                  </h2>
                </div>
                <button onClick={() => setShowForm(false)} className="p-1.5 text-muted hover:text-ink rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-poppins font-medium uppercase tracking-wider text-body block mb-1">First Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-medium text-ink focus:border-rose-400 outline-none" 
                      value={formData.first_name} 
                      onChange={e => setFormData({...formData, first_name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-poppins font-medium uppercase tracking-wider text-body block mb-1">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-medium text-ink focus:border-rose-400 outline-none" 
                      value={formData.last_name} 
                      onChange={e => setFormData({...formData, last_name: e.target.value})} 
                      required 
                    />
                  </div>
                </div>

                {!editingStaff && (
                  <div>
                    <label className="text-xs font-poppins font-medium uppercase tracking-wider text-body block mb-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="stylist@example.com"
                      className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-medium text-ink focus:border-rose-400 outline-none" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      required 
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-poppins font-medium uppercase tracking-wider text-body block mb-1">Title / Specialty</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Master Barber & Colorist"
                    className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-medium text-ink focus:border-rose-400 outline-none placeholder:text-neutral-400" 
                    value={formData.bio} 
                    onChange={e => setFormData({...formData, bio: e.target.value})} 
                    required 
                  />
                </div>

                <div>
                  <label className="text-xs font-poppins font-medium uppercase tracking-wider text-body block mb-1">Experience (Years)</label>
                  <input 
                    type="number" 
                    className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-medium text-ink focus:border-rose-400 outline-none" 
                    value={formData.experience_years} 
                    onChange={e => setFormData({...formData, experience_years: e.target.value})} 
                    required 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full mt-2 bg-ink hover:bg-rose-600 text-ivory py-3 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  {editingStaff ? 'Save Changes' : 'Add to Studio Roster'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StaffManagement;
