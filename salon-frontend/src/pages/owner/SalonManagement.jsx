import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Clock, Phone, Mail, Save, Loader, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SalonManagement = () => {
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasSalon, setHasSalon] = useState(false);
  const navigate = useNavigate();

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
    latitude: null,
    longitude: null
  });

  useEffect(() => {
    fetchSalon();
    captureLocation();
  }, []);

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.log('Location permission denied during salon creation:', error);
        }
      );
    }
  };

  const fetchSalon = async () => {
    setLoading(true);
    try {
      const response = await api.get('/salons/my-salons/');
      const salons = Array.isArray(response.data) ? response.data : response.data?.results || [];
      
      if (salons.length === 0) {
        setHasSalon(false);
        setLoading(false);
        return;
      }

      setHasSalon(true);
      const existingSalon = salons[0];
      setSalon(existingSalon);
      setFormData({
        name: existingSalon.name || '',
        description: existingSalon.description || '',
        phone: existingSalon.phone || '',
        email: existingSalon.email || '',
        address: existingSalon.address || '',
        city: existingSalon.city || '',
        state: existingSalon.state || '',
        postal_code: existingSalon.postal_code || '',
        opening_time: existingSalon.opening_time || '09:00',
        closing_time: existingSalon.closing_time || '20:00',
        latitude: existingSalon.latitude || formData.latitude,
        longitude: existingSalon.longitude || formData.longitude
      });
    } catch (error) {
      console.error('Error fetching salon:', error);
      toast.error('Failed to load salon data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (hasSalon) {
        const response = await api.put(`/salons/${salon.id}/`, formData);
        toast.success('Salon profile updated!');
        fetchSalon();
      } else {
        const response = await api.post('/salons/create/', formData);
        toast.success('Studio registered successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to save salon details');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-ivory">
        <div className="w-10 h-10 border-2 border-line border-t-rose-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-rose-600">Loading Studio Dossier...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pb-16 font-sans antialiased text-ink">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-line">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-surface border border-rose-300 text-rose-600 text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-rose-600" />
            Studio Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-ink tracking-tight">
            {hasSalon ? 'Studio Details & Operating Profile' : 'Establish New Salon Studio'}
          </h1>
          <p className="text-xs text-body font-sans mt-1">
            Update your public listing, consultation hours, and geographic coordinates
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-surface rounded-xl shadow-lg p-6 sm:p-8 space-y-8 border border-line">
          
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <Store className="h-5 w-5 text-rose-600" />
              <h2 className="text-base font-poppins font-bold text-ink uppercase tracking-wider">
                Basic Credentials
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                  Salon Brand Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-line rounded-lg text-sm font-sans focus:outline-none focus:border-rose-400 text-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                  Direct Contact Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-line rounded-lg text-sm font-sans focus:outline-none focus:border-rose-400 text-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                  Official Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-line rounded-lg text-sm font-sans focus:outline-none focus:border-rose-400 text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-line rounded-lg text-sm font-sans focus:outline-none focus:border-rose-400 text-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                  State / Region
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-line rounded-lg text-sm font-sans focus:outline-none focus:border-rose-400 text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-line rounded-lg text-sm font-sans focus:outline-none focus:border-rose-400 text-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                Studio Philosophy & Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 bg-white border border-line rounded-lg text-sm font-sans focus:outline-none focus:border-rose-400 text-ink"
                placeholder="Highlight your studio ambiance, signature expertise, and guest hospitality..."
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4 pt-4 border-t border-line">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <MapPin className="h-5 w-5 text-rose-600" />
              <h2 className="text-base font-poppins font-bold text-ink uppercase tracking-wider">
                Location & Coordinates
              </h2>
            </div>
            
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                Physical Street Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2.5 bg-white border border-line rounded-lg text-sm font-sans focus:outline-none focus:border-rose-400 text-ink"
                required
              />
            </div>
            {formData.latitude && formData.longitude && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5 bg-blush border border-rose-300 p-2.5 rounded-lg w-fit">
                <CheckCircle2 size={14} className="text-rose-600" />
                <span>Exact GPS Coordinates locked: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
              </p>
            )}
          </div>

          {/* Working Hours */}
          <div className="space-y-4 pt-4 border-t border-line">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <Clock className="h-5 w-5 text-rose-600" />
              <h2 className="text-base font-poppins font-bold text-ink uppercase tracking-wider">
                Operating Schedule
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                  Opening Time *
                </label>
                <input
                  type="time"
                  name="opening_time"
                  value={formData.opening_time}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-line rounded-lg text-sm font-sans focus:outline-none focus:border-rose-400 text-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                  Closing Time *
                </label>
                <input
                  type="time"
                  name="closing_time"
                  value={formData.closing_time}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-line rounded-lg text-sm font-sans focus:outline-none focus:border-rose-400 text-ink"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center space-x-2 w-full bg-ink hover:bg-rose-600 text-ivory py-3.5 px-4 rounded-lg text-xs font-poppins font-bold uppercase tracking-wider disabled:opacity-50 transition-colors shadow-lg"
          >
            {saving ? (
              <Loader className="h-4 w-4 animate-spin text-ivory" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saving ? 'Saving...' : hasSalon ? 'Save Studio Profile' : 'Establish Studio'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SalonManagement;
