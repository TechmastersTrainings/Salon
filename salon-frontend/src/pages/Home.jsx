import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Scissors, Clock, ShieldCheck, Sparkles, 
  ArrowRight, MapPin, Search as SearchIcon, Star, CheckCircle, 
  Heart, Eye, Calendar, Award, PhoneCall, ChevronRight, Check, Store
} from 'lucide-react';
import { statsService } from '../services/statsService';
import { salonService } from '../services/salonService';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [salons, setSalons] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({ location: '', service: '' });
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [statsData, salonsData] = await Promise.allSettled([
          statsService.getPlatformStats(),
          salonService.getAll()
        ]);

        if (statsData.status === 'fulfilled') {
          setStats(statsData.value);
        }
        if (salonsData.status === 'fulfilled') {
          const list = Array.isArray(salonsData.value) ? salonsData.value : salonsData.value?.results || [];
          setSalons(list);
        } else {
          setSalons([]);
        }
      } catch (err) {
        setSalons([]);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.location) params.set('location', searchQuery.location);
    if (searchQuery.service) params.set('service', searchQuery.service);
    navigate(`/search?${params.toString()}`);
  };

  const toggleWishlist = (salonId) => {
    setWishlist(prev => {
      const next = { ...prev, [salonId]: !prev[salonId] };
      toast.success(next[salonId] ? 'Saved to your wishlist' : 'Removed from wishlist');
      return next;
    });
  };

  // Filtered salons by tab
  const filteredSalons = salons.filter(s => {
    if (activeTab === 'all') return true;
    if (activeTab === 'top') return (s.rating || 5.0) >= 4.9;
    if (activeTab === 'barber') return s.tags?.some(t => t.toLowerCase().includes('barber') || t.toLowerCase().includes('fade')) || s.name?.toLowerCase().includes('barber');
    if (activeTab === 'color') return s.tags?.some(t => t.toLowerCase().includes('color') || t.toLowerCase().includes('balayage')) || s.name?.toLowerCase().includes('atelier');
    return true;
  });

  return (
    <div className="bg-ivory text-ink min-h-screen">
      
      {/* =========================================
          1. HERO BANNER
      ========================================= */}
      <section className="bg-ivory border-b border-line py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Sub-Title Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface border border-rose-300 text-rose-600 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm">
                <Sparkles size={13} />
                <span>Modern Grooming Living</span>
              </div>

              {/* Main Headline */}
              <h1 className="display-hero text-ink">
                Discover Minimalist Grooming & Master Artistry
              </h1>

              {/* Description */}
              <p className="text-body text-sm sm:text-base leading-relaxed max-w-xl font-normal font-body">
                Upgrade your personal style with handcrafted haircuts, straight-razor detailing, and botanical hair therapy. Certified salons with direct calendar synchronization.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/search" className="bloxic-btn-primary">
                  <span>Explore Studios</span>
                  <ArrowRight size={15} />
                </Link>
                <Link to="/search?category=Haircut" className="bloxic-btn-outline">
                  <span>View Treatments</span>
                </Link>
              </div>

              {/* Integrated Search Widget */}
              <div className="pt-6">
                <form 
                  onSubmit={handleSearch}
                  className="bg-surface p-2.5 border border-line shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl"
                >
                  <div className="flex-1 flex items-center px-4 py-3 bg-white border border-line focus-within:border-rose-400 transition-colors">
                    <MapPin size={16} className="text-rose-600 mr-2.5 shrink-0" />
                    <input 
                      type="text"
                      placeholder="City (e.g. Bangalore, Mumbai)"
                      value={searchQuery.location}
                      onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
                      className="w-full bg-transparent text-xs font-semibold text-ink placeholder:text-neutral-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex-1 flex items-center px-4 py-3 bg-white border border-line focus-within:border-rose-400 transition-colors">
                    <Scissors size={16} className="text-rose-600 mr-2.5 shrink-0" />
                    <input 
                      type="text"
                      placeholder="Service (e.g. Balayage, Royal Fade)"
                      value={searchQuery.service}
                      onChange={(e) => setSearchQuery({ ...searchQuery, service: e.target.value })}
                      className="w-full bg-transparent text-xs font-semibold text-ink placeholder:text-neutral-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-ink hover:bg-rose-600 text-ivory text-xs font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-2"
                  >
                    <SearchIcon size={14} />
                    <span>Search</span>
                  </button>
                </form>
              </div>

            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 bg-surface p-3 border border-line shadow-2xl">
                <div className="relative overflow-hidden aspect-[4/5] bg-blush">
                  <img 
                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80" 
                    alt="Modern Grooming Living"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-blush border border-rose-300 text-rose-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                    Verified Atelier
                  </div>
                </div>

                {/* Floating Trust Card */}
                <div className="absolute -bottom-6 -left-6 bg-blush p-4 border border-line shadow-2xl max-w-xs flex items-center gap-3">
                  <div className="w-10 h-10 bg-ink text-ivory flex items-center justify-center shrink-0">
                    <Star size={20} className="fill-ivory" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-ink block">Verified Atelier Network</span>
                    <span className="text-[11px] text-body">Direct Calendar Reservations</span>
                  </div>
                </div>
              </div>

              {/* Decorative accent background box */}
              <div className="absolute -top-4 -right-4 w-full h-full bg-rose-500/15 -z-0" />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          2. 4-PILLAR SERVICE HIGHLIGHT STRIP
      ========================================= */}
      <section className="border-b border-line py-10 bg-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Scissors,
                title: "Certified Master Stylists",
                desc: "All technicians are accredited with verified portfolios."
              },
              {
                icon: Clock,
                title: "Zero Waiting Time",
                desc: "Real-time calendar slot reservation guaranteed."
              },
              {
                icon: ShieldCheck,
                title: "Transparent Pricing",
                desc: "Zero hidden charges. Itemized receipts provided."
              },
              {
                icon: PhoneCall,
                title: "Dedicated Concierge",
                desc: "Instant booking assistance 7 days a week."
              }
            ].map((pillar, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface border border-line flex items-center justify-center text-rose-600 shrink-0">
                  <pillar.icon size={22} className="text-rose-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-body mt-1 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          3. CATEGORY GRID / SERVICE SHOWCASE
      ========================================= */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="bloxic-sub-title">Signature Collections</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Curated Hair & Grooming Categories
            </h2>
            <p className="text-body text-xs sm:text-sm mt-2">
              Browse by craft category and discover specialists certified in modern technique.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Precision Haircraft",
                img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80",
                query: "Haircut"
              },
              {
                name: "Beard Architecture",
                img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
                query: "Beard"
              },
              {
                name: "Balayage & Color Lab",
                img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
                query: "Color"
              },
              {
                name: "Scalp Detox & Spa",
                img: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&q=80",
                query: "Spa"
              }
            ].map((cat, idx) => (
              <div 
                key={idx}
                onClick={() => navigate(`/search?service=${encodeURIComponent(cat.query)}`)}
                className="group cursor-pointer bg-surface border border-line hover:border-rose-400 transition-all duration-300 relative overflow-hidden"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-blush">
                  <img 
                    src={cat.img} 
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
                  
                  <div className="absolute bottom-5 left-5 right-5 text-ivory">
                    <h3 className="text-2xl text-ivory mt-0.5 group-hover:text-rose-200 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ivory/80 mt-2 uppercase tracking-wider group-hover:translate-x-1 transition-transform group-hover:text-rose-200">
                      <span>Explore Category</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================
          4. TABBED PRODUCT/STUDIO SHOWCASE
      ========================================= */}
      <section className="py-20 bg-blush border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="bloxic-sub-title">Popular Studios</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                Trending Salons & Barbershops
              </h2>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Studios' },
                { id: 'top', label: 'Top Rated' },
                { id: 'barber', label: 'Barbershops' },
                { id: 'color', label: 'Color & Balayage' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                    activeTab === tab.id
                      ? 'bg-ink text-ivory border-ivory/40'
                      : 'bg-surface text-body border-line hover:border-rose-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredSalons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSalons.slice(0, 6).map((salon) => (
                <div 
                  key={salon.id}
                  className="group bg-surface border border-line hover:border-rose-400 hover:shadow-bloxic-hover transition-all duration-300 relative flex flex-col justify-between"
                >
                  <div>
                    {/* Card Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-blush">
                      <img 
                        src={salon.images?.[0]?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'} 
                        alt={salon.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Badge */}
                      <span className="absolute top-3 left-3 bg-blush border border-rose-300 text-rose-600 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
                        Verified
                      </span>

                      {/* Floating Hover Action Bar */}
                      <div className="absolute -bottom-12 group-hover:bottom-3 left-3 right-3 flex items-center justify-center gap-2 transition-all duration-300 z-10">
                        <button
                          onClick={(e) => { e.preventDefault(); toggleWishlist(salon.id); }}
                          className={`w-9 h-9 bg-blush border border-line shadow-md flex items-center justify-center transition-colors ${
                            wishlist[salon.id] ? 'text-red-700' : 'text-ink hover:text-rose-600'
                          }`}
                          title="Save to Wishlist"
                        >
                          <Heart size={16} className={wishlist[salon.id] ? 'fill-red-400' : ''} />
                        </button>
                        
                        <Link
                          to={`/salon/${salon.id}`}
                          className="flex-1 py-2 bg-ink hover:bg-rose-600 text-ivory text-[11px] font-bold uppercase tracking-wider text-center shadow-md transition-colors"
                        >
                          Book Appointment
                        </Link>

                        <Link
                          to={`/salon/${salon.id}`}
                          className="w-9 h-9 bg-blush border border-line shadow-md flex items-center justify-center text-ink hover:text-rose-600 transition-colors"
                          title="Quick View"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-6">
                      <div className="flex items-center justify-between text-xs text-muted mb-1.5 font-medium">
                        <span>{salon.city || 'Bangalore'}</span>
                        <div className="flex items-center gap-1 text-rose-600 font-semibold">
                          <Star size={13} className="fill-rose-500" />
                          <span>{salon.rating || 5.0}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-rose-600 transition-colors leading-snug">
                        <Link to={`/salon/${salon.id}`}>{salon.name}</Link>
                      </h3>

                      <p className="text-body text-xs line-clamp-2 leading-relaxed mb-4">
                        {salon.description || 'Modern grooming atelier providing precision scissor cuts, hot towel shaves, and hair treatments.'}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(salon.tags || ['Master Stylist', 'Private Suite']).slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-blush border border-line text-body">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Bar */}
                  <div className="px-6 py-4 border-t border-line bg-blush flex items-center justify-between text-xs text-ink">
                    <div className="flex items-center gap-1.5 text-body">
                      <Clock size={13} className="text-rose-600" />
                      <span>{salon.opening_time || '09:00'} - {salon.closing_time || '21:00'}</span>
                    </div>
                    <span className="font-bold text-rose-600">
                      {salon.service_count ? `${salon.service_count} Treatments` : 'Featured'}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-line bg-surface p-8 max-w-xl mx-auto">
              <Store size={40} className="mx-auto text-rose-600 mb-3 opacity-60" />
              <h3 className="text-base font-bold text-ink uppercase tracking-wider">No Studios Listed Yet</h3>
              <p className="text-xs text-muted mt-1 max-w-md mx-auto">
                Verified studio partners will appear here once approved by administration.
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/search" className="bloxic-btn-outline">
              <span>Explore All Studios</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================
          5. PROMOTIONAL SPOTLIGHT BANNER
      ========================================= */}
      <section className="py-20 bg-blush text-ink border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-rose-600 block">
                Exclusive Spotlight Offer
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-tight">
                The Executive Royal Grooming Suite
              </h2>
              <p className="text-body text-sm leading-relaxed font-light">
                Indulge in a bespoke transformation: signature architectural scissor cut, cedarwood hot towel straight-razor shave, and organic scalp detox therapy.
              </p>

              <div className="pt-4 flex items-center gap-4">
                <Link to="/search?service=Royal" className="bloxic-btn-primary">
                  <span>Explore Offerings</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative border-4 border-line shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80" 
                  alt="Spotlight Grooming" 
                  className="w-full h-[380px] object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
