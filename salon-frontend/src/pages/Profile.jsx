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
    <div className="bg-[#0B3048] text-[#F2F0E9] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[rgba(242,240,233,0.12)] mb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs text-[#F2F0E9]/60 uppercase tracking-wider mb-2">
              <Link to="/" className="hover:text-[#B9F12F]">Home</Link>
              <span>/</span>
              <span className="text-[#F2F0E9] font-bold">My Account</span>
            </nav>
            <span className="bloxic-sub-title">Profile</span>
            <h1 className="text-3xl font-extrabold text-[#F2F0E9] tracking-tight">
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
            <div className="bg-[#0e3854] border border-[rgba(242,240,233,0.12)] p-6 text-center shadow-lg">
              <div className="w-20 h-20 bg-[#072132] text-[#B9F12F] flex items-center justify-center text-3xl font-black mx-auto mb-4 border border-[#B9F12F]/40 shadow-inner">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>

              <h2 className="text-lg font-bold text-[#F2F0E9]">{user?.username || 'Verified Client'}</h2>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-[#072132] border border-[#B9F12F]/40 text-[#B9F12F]">
                {user?.role || 'Client'} Tier
              </span>

              <div className="mt-6 pt-6 border-t border-[rgba(242,240,233,0.12)] grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-base font-extrabold text-[#F2F0E9] block">14</span>
                  <span className="text-[10px] uppercase text-[#F2F0E9]/60">Bookings</span>
                </div>
                <div>
                  <span className="text-base font-extrabold text-[#F2F0E9] block">6</span>
                  <span className="text-[10px] uppercase text-[#F2F0E9]/60">Reviews</span>
                </div>
                <div>
                  <span className="text-base font-extrabold text-[#B9F12F] block">VIP</span>
                  <span className="text-[10px] uppercase text-[#F2F0E9]/60">Level</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#0e3854] border border-[rgba(242,240,233,0.12)] divide-y divide-[rgba(242,240,233,0.1)] text-xs font-semibold text-[#F2F0E9]">
              <Link to="/bookings" className="p-3.5 flex items-center justify-between hover:bg-[#134567] hover:text-[#B9F12F] transition-colors">
                <span>My Reservations</span>
                <span className="text-[#B9F12F]">→</span>
              </Link>
              <button onClick={() => toast.success('Payment methods active')} className="w-full p-3.5 flex items-center justify-between hover:bg-[#134567] hover:text-[#B9F12F] transition-colors text-left">
                <span>Saved Payment Methods</span>
                <span className="text-[#B9F12F]">→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0e3854] border border-[rgba(242,240,233,0.12)] p-8 shadow-lg">
              <h3 className="text-base font-bold text-[#F2F0E9] uppercase tracking-wider mb-6 pb-2 border-b border-[rgba(242,240,233,0.12)]">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="text-[#F2F0E9]/60 block uppercase tracking-wider text-[10px]">Username</span>
                  <span className="font-bold text-[#F2F0E9] text-sm mt-0.5 block">{user?.username}</span>
                </div>

                <div>
                  <span className="text-[#F2F0E9]/60 block uppercase tracking-wider text-[10px]">Email Address</span>
                  <span className="font-bold text-[#F2F0E9] text-sm mt-0.5 block">{user?.email || 'client@makemyhair.com'}</span>
                </div>

                <div>
                  <span className="text-[#F2F0E9]/60 block uppercase tracking-wider text-[10px]">Contact Telephone</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)}
                      className="mt-1 p-2 bg-[#072132] border border-[rgba(242,240,233,0.15)] text-xs font-semibold text-[#F2F0E9] focus:outline-none focus:border-[#B9F12F] w-full"
                    />
                  ) : (
                    <span className="font-bold text-[#F2F0E9] text-sm mt-0.5 block">{phone}</span>
                  )}
                </div>

                <div>
                  <span className="text-[#F2F0E9]/60 block uppercase tracking-wider text-[10px]">City Location</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={city} 
                      onChange={e => setCity(e.target.value)}
                      className="mt-1 p-2 bg-[#072132] border border-[rgba(242,240,233,0.15)] text-xs font-semibold text-[#F2F0E9] focus:outline-none focus:border-[#B9F12F] w-full"
                    />
                  ) : (
                    <span className="font-bold text-[#F2F0E9] text-sm mt-0.5 block">{city}</span>
                  )}
                </div>
              </div>

              {/* VIP Membership Card Strip */}
              <div className="mt-8 p-5 bg-[#072132] border border-[rgba(242,240,233,0.12)] text-[#F2F0E9] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B9F12F] block">
                    Active Membership
                  </span>
                  <h4 className="font-bold text-sm text-[#F2F0E9] mt-0.5">Priority Booking Privileges</h4>
                  <p className="text-[11px] text-[#F2F0E9]/60">Guaranteed priority chair access across all partner studios</p>
                </div>
                <span className="px-2.5 py-1 bg-[#B9F12F] text-[#0B3048] text-[10px] font-bold uppercase">
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
