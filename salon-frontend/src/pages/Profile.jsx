import { useAuthStore } from '../store/authStore';
import { 
  User, Mail, Phone, Calendar, ShieldCheck, 
  MapPin, Edit3, Camera, Settings, CreditCard, 
  Clock, Sparkles, CheckCircle, Store, Shield
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('+91 98807 68222');
  const [city, setCity] = useState('Bangalore, India');

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile details updated successfully');
  };

  return (
    <div className="bg-ivory text-ink min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line mb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs text-muted uppercase tracking-wider mb-2">
              <Link to="/" className="hover:text-rose-600">Home</Link>
              <span>/</span>
              <span className="text-ink font-bold">My Account</span>
            </nav>
            <span className="bloxic-sub-title">Profile</span>
            <h1 className="text-3xl font-bold text-ink tracking-tight">
              Account Overview
            </h1>
          </div>

          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bloxic-btn-primary py-2.5 px-6 text-xs"
          >
            <Edit3 size={14} />
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Meta */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface border border-line p-6 text-center shadow-lg">
              <div className="w-20 h-20 bg-blush text-rose-600 flex items-center justify-center text-3xl font-bold mx-auto mb-4 border border-rose-300 shadow-inner">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>

              <h2 className="text-lg font-bold text-ink">{user?.username || 'Verified Client'}</h2>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-blush border border-rose-300 text-rose-600">
                {user?.role || 'Client'} Tier
              </span>

              <div className="mt-6 pt-6 border-t border-line grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-base font-bold text-ink block">14</span>
                  <span className="text-[10px] uppercase text-muted">Bookings</span>
                </div>
                <div>
                  <span className="text-base font-bold text-ink block">6</span>
                  <span className="text-[10px] uppercase text-muted">Reviews</span>
                </div>
                <div>
                  <span className="text-base font-bold text-rose-600 block">VIP</span>
                  <span className="text-[10px] uppercase text-muted">Level</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-surface border border-line divide-y divide-line text-xs font-semibold text-ink">
              <Link to="/bookings" className="p-3.5 flex items-center justify-between hover:bg-rose-50 hover:text-rose-600 transition-colors">
                <span>My Reservations</span>
                <span className="text-rose-600">→</span>
              </Link>
              <button onClick={() => toast.success('Payment methods active')} className="w-full p-3.5 flex items-center justify-between hover:bg-rose-50 hover:text-rose-600 transition-colors text-left">
                <span>Saved Payment Methods</span>
                <span className="text-rose-600">→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-line p-8 shadow-lg">
              <h3 className="text-base font-bold text-ink uppercase tracking-wider mb-6 pb-2 border-b border-line">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="text-muted block uppercase tracking-wider text-[10px]">Username</span>
                  <span className="font-bold text-ink text-sm mt-0.5 block">{user?.username}</span>
                </div>

                <div>
                  <span className="text-muted block uppercase tracking-wider text-[10px]">Email Address</span>
                  <span className="font-bold text-ink text-sm mt-0.5 block">{user?.email || 'client@makemyhair.com'}</span>
                </div>

                <div>
                  <span className="text-muted block uppercase tracking-wider text-[10px]">Contact Telephone</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)}
                      className="mt-1 p-2 bg-white border border-line text-xs font-semibold text-ink focus:outline-none focus:border-rose-400 w-full"
                    />
                  ) : (
                    <span className="font-bold text-ink text-sm mt-0.5 block">{phone}</span>
                  )}
                </div>

                <div>
                  <span className="text-muted block uppercase tracking-wider text-[10px]">City Location</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={city} 
                      onChange={e => setCity(e.target.value)}
                      className="mt-1 p-2 bg-white border border-line text-xs font-semibold text-ink focus:outline-none focus:border-rose-400 w-full"
                    />
                  ) : (
                    <span className="font-bold text-ink text-sm mt-0.5 block">{city}</span>
                  )}
                </div>
              </div>

              {/* VIP Membership Card Strip */}
              <div className="mt-8 p-5 bg-blush border border-line text-ink flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 block">
                    Active Membership
                  </span>
                  <h4 className="font-bold text-sm text-ink mt-0.5">Priority Booking Privileges</h4>
                  <p className="text-[11px] text-muted">Guaranteed priority chair access across all partner studios</p>
                </div>
                <span className="px-2.5 py-1 bg-ink text-ivory text-[10px] font-bold uppercase">
                  Verified
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
