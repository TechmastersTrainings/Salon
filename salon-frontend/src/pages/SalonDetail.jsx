import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, Phone, Star, Calendar, Loader, Scissors, 
  Users, Store, ShieldCheck, Sparkles, MessageSquare, 
  Send, ChevronRight, CheckCircle2, Heart, Share2, Award, Check
} from 'lucide-react';
import { salonService } from '../services/salonService';
import { reviewService } from '../services/reviewService';
import { useAuthStore } from '../store/authStore';
import api from '../services/api'; 
import toast from 'react-hot-toast';

const SalonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('services');
  
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  
  // Review submission
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchSalonData();
  }, [id]);

  const fetchSalonData = async () => {
    setLoading(true);
    try {
      const [salonData, srvRes, staffRes, revData] = await Promise.allSettled([
        salonService.getById(id),
        api.get(`/services/salon/${id}/`),
        api.get(`/staff/salon/${id}/`),
        reviewService.getSalonReviews(id)
      ]);

      if (salonData.status === 'fulfilled' && salonData.value) {
        setSalon(salonData.value);
        if (salonData.value.services && salonData.value.services.length > 0) {
          setServices(salonData.value.services);
        }
        if (salonData.value.staff && salonData.value.staff.length > 0) {
          setStaff(salonData.value.staff);
        }
      }

      if (srvRes.status === 'fulfilled') {
        const srvList = Array.isArray(srvRes.value.data) ? srvRes.value.data : srvRes.value.data?.results || [];
        if (srvList.length > 0) setServices(srvList);
      }

      if (staffRes.status === 'fulfilled') {
        const staffList = Array.isArray(staffRes.value.data) ? staffRes.value.data : staffRes.value.data?.results || [];
        if (staffList.length > 0) setStaff(staffList);
      }

      if (revData.status === 'fulfilled' && Array.isArray(revData.value)) {
        setReviews(revData.value);
      } else if (salonData.status === 'fulfilled' && salonData.value?.reviews) {
        setReviews(salonData.value.reviews);
      }
    } catch (error) {
      console.error('Error fetching salon page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = (serviceId = null) => {
    if (!user) {
      toast.error('Please sign in to reserve an appointment');
      navigate('/login', { state: { from: `/salon/${id}` } });
      return;
    }
    const query = serviceId ? `?serviceId=${serviceId}` : '';
    navigate(`/booking/${id}${query}`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave a verified review');
      navigate('/login');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Please enter review remarks');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        salon_id: id,
        rating: newRating,
        comment: newComment
      });
      toast.success('Review posted successfully');
      setNewComment('');
      // refresh reviews
      const revData = await reviewService.getSalonReviews(id);
      if (Array.isArray(revData)) setReviews(revData);
    } catch (e) {
      toast.error('Could not post review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#292966]">
        <div className="w-10 h-10 border-2 border-[rgba(163,163,204,0.2)] border-t-[#CCCCFF] rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#CCCCFF]">Entering Atelier Suite...</p>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 bg-[#292966] text-white">
        <h2 className="text-2xl font-bold text-white mb-2">Studio Not Found</h2>
        <p className="text-white/70 text-xs mb-6">The salon you are seeking has relocated or is temporarily offline.</p>
        <Link to="/search" className="bloxic-btn-primary">Browse Studios</Link>
      </div>
    );
  }

  const galleryImages = salon.images && salon.images.length > 0 
    ? salon.images 
    : [
        { id: 1, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80' },
        { id: 2, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80' },
        { id: 3, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80' }
      ];

  return (
    <div className="bg-[#292966] text-white min-h-screen pb-16">
      
      {/* 1. BREADCRUMBS */}
      <div className="bg-[#1e1e4f] border-b border-[rgba(163,163,204,0.12)] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-white/60 uppercase tracking-wider">
            <Link to="/" className="hover:text-[#CCCCFF]">Home</Link>
            <span>/</span>
            <Link to="/search" className="hover:text-[#CCCCFF]">Studios</Link>
            <span>/</span>
            <span className="text-white font-bold">{salon.name}</span>
          </nav>
        </div>
      </div>

      {/* 2. DETAIL HERO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT 7 COLS: PHOTO GALLERY */}
          <div className="lg:col-span-7 space-y-4">
            {/* Active Feature View */}
            <div className="relative aspect-[4/3] bg-[#1e1e4f] overflow-hidden border border-[rgba(163,163,204,0.15)] shadow-2xl">
              <img 
                src={galleryImages[activeImage]?.image} 
                alt={salon.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                Certified Atelier
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-[4/3] overflow-hidden border transition-all ${
                    activeImage === idx ? 'border-2 border-[#CCCCFF]' : 'border-[rgba(163,163,204,0.2)] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.image} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT 5 COLS: STUDIO SPECIFICATIONS & DIRECT BOOKING CARD */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#CCCCFF] font-bold uppercase tracking-widest mb-1.5">
                <Sparkles size={13} />
                <span>Luxury Grooming Partner</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                {salon.name}
              </h1>
              
              {/* Rating and Reviews Counter */}
              <div className="flex items-center gap-3 mt-3 pb-4 border-b border-[rgba(163,163,204,0.12)]">
                <div className="flex items-center gap-1 text-[#CCCCFF]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#CCCCFF]" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">4.98</span>
                <span className="text-xs text-white/60">({reviews.length} verified reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed font-body">
              {salon.description || 'Modern artisan atelier combining classical shear craft with botanical scalp rituals and precision detailing.'}
            </p>

            {/* Meta Specifications */}
            <div className="bg-[#363675] border border-[rgba(163,163,204,0.12)] p-5 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#CCCCFF] shrink-0" />
                <span className="text-white font-medium">{salon.address}, {salon.city}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[#CCCCFF] shrink-0" />
                <span className="text-white font-medium">Daily {salon.opening_time} – {salon.closing_time}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#CCCCFF] shrink-0" />
                <span className="text-white font-medium">{salon.phone}</span>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2 pt-2 text-xs text-white/80">
              {['Guaranteed Punctual Chair Seating', 'Sanitized Hospital-Grade Instruments', 'Complimentary Consult & Beverage'].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={14} className="text-[#CCCCFF] shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Instant Booking Action */}
            <div className="pt-4 border-t border-[rgba(163,163,204,0.12)] space-y-3">
              <button
                onClick={() => handleBookingClick(services[0]?.id)}
                className="w-full py-4 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar size={16} className="text-[#292966]" />
                <span>Book Appointment Session</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 3. TABS SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="border-b border-[rgba(163,163,204,0.12)] flex items-center justify-center gap-4 sm:gap-10 text-xs sm:text-sm font-bold uppercase tracking-wider">
          {[
            { id: 'services', label: 'Treatment Menu', count: services.length },
            { id: 'staff', label: 'Specialists', count: staff.length },
            { id: 'reviews', label: 'Patron Reviews', count: reviews.length },
            { id: 'amenities', label: 'Atelier Amenities', count: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 border-b-2 transition-colors relative ${
                activeTab === tab.id 
                  ? 'border-[#CCCCFF] text-[#CCCCFF]' 
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="ml-1.5 text-[10px] font-semibold text-[#CCCCFF]">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="py-10">
          
          {/* TAB 1: SERVICES MENU */}
          {activeTab === 'services' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {services.map(srv => (
                <div 
                  key={srv.id}
                  className="bg-[#363675] border border-[rgba(163,163,204,0.12)] hover:border-[#CCCCFF] p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Scissors size={15} className="text-[#CCCCFF]" />
                      <h4 className="font-bold text-base text-white">{srv.name}</h4>
                    </div>
                    <p className="text-white/70 text-xs max-w-xl font-body leading-relaxed">{srv.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-white/60 font-semibold pt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-[#CCCCFF]" />
                        {srv.duration_minutes} Mins
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[rgba(163,163,204,0.12)]">
                    <span className="text-xl font-extrabold text-[#CCCCFF]">₹{srv.price}</span>
                    <button
                      onClick={() => handleBookingClick(srv.id)}
                      className="px-5 py-2.5 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Reserve Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SPECIALISTS */}
          {activeTab === 'staff' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {staff.map(person => (
                <div 
                  key={person.id}
                  className="bg-[#363675] border border-[rgba(163,163,204,0.12)] hover:border-[#CCCCFF] p-6 text-center space-y-4 transition-all shadow-sm"
                >
                  <div className="w-24 h-24 mx-auto overflow-hidden bg-[#1e1e4f] rounded-full border-2 border-[#CCCCFF]">
                    <img 
                      src={person.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'} 
                      alt={person.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{person.name || person.user_details?.first_name}</h4>
                    <p className="text-xs text-[#CCCCFF] font-semibold mt-0.5">{person.role || person.bio || 'Master Stylist'}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-[#1e1e4f] border border-[rgba(163,163,204,0.12)] text-[10px] font-bold uppercase tracking-wider text-white/70">
                      {person.experience_years || 5} Years Experience
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Write Review Box */}
              <div className="bg-[#363675] border border-[rgba(163,163,204,0.12)] p-6 sm:p-8">
                <h4 className="text-base font-bold text-white mb-2">Leave Verified Patron Feedback</h4>
                <p className="text-xs text-white/70 mb-6">Your honest experience helps our master stylists maintain standards.</p>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={`p-2 border transition-all ${
                            newRating >= star 
                              ? 'bg-[#CCCCFF] text-[#292966] border-[#CCCCFF]' 
                              : 'bg-[#1e1e4f] text-white/40 border-[rgba(163,163,204,0.15)]'
                          }`}
                        >
                          <Star size={16} className={newRating >= star ? 'fill-[#292966]' : ''} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-2">Review Remarks</label>
                    <textarea
                      rows="3"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Detail the consultation, treatment accuracy, and ambiance..."
                      className="w-full p-4 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] text-xs font-medium text-white placeholder:text-white/40 focus:outline-none focus:border-[#CCCCFF]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-7 py-3 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    <span>{submittingReview ? 'Publishing...' : 'Submit Review'}</span>
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev, i) => (
                  <div key={rev.id || i} className="bg-[#363675] border border-[rgba(163,163,204,0.12)] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs font-bold">
                          {(rev.customer?.username || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-white">{rev.customer?.username || 'Verified Client'}</h5>
                          <span className="text-[10px] text-white/50">Verified Appointment</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-[#CCCCFF]">
                        {[...Array(rev.rating || 5)].map((_, s) => (
                          <Star key={s} size={12} className="fill-[#CCCCFF]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed mt-2 font-body">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: AMENITIES */}
          {activeTab === 'amenities' && (
            <div className="max-w-4xl mx-auto bg-[#363675] border border-[rgba(163,163,204,0.12)] p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-white">Studio Standards & Policies</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  'Air Conditioned Suite', 'High Speed Wi-Fi',
                  'Complimentary Beverage Bar', 'Valet Parking Available',
                  'Digital UPI / Cards Accepted', 'Private Styling Rooms'
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#1e1e4f] border border-[rgba(163,163,204,0.12)] flex items-center gap-2 text-xs font-semibold text-white">
                    <Check size={14} className="text-[#CCCCFF]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 4. MOBILE FLOATING ACTION BAR */}
      <div className="fixed bottom-12 left-0 right-0 z-30 md:hidden bg-[#292966]/95 backdrop-blur-md border-t border-[rgba(163,163,204,0.15)] px-4 py-2.5 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] uppercase font-bold text-white/60 block tracking-wider">Starts From</span>
          <span className="text-base font-extrabold text-[#CCCCFF]">
            ₹{services[0]?.price || '650'}
          </span>
        </div>

        <button
          onClick={() => handleBookingClick(services[0]?.id)}
          className="px-6 py-2.5 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Calendar size={13} className="text-[#292966]" />
          <span>Book Session</span>
        </button>
      </div>

    </div>
  );
};

export default SalonDetail;
