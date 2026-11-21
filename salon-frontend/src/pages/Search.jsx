import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search as SearchIcon, MapPin, SlidersHorizontal, 
  Star, Heart, Eye, ArrowRight, Check, X, Navigation 
} from 'lucide-react';
import { salonService } from '../services/salonService';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'Haircut', label: 'Precision Haircraft' },
  { id: 'Beard', label: 'Beard Sculpture & Shaves' },
  { id: 'Color', label: 'Balayage & Color Lab' },
  { id: 'Spa', label: 'Scalp & Hair Spa' },
  { id: 'Treatments', label: 'Keratin & Treatments' },
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('rating');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [geoLocating, setGeoLocating] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const loc = searchParams.get('location') || '';
    const cat = searchParams.get('category') || 'all';
    const srv = searchParams.get('service') || '';

    setSearchTerm(q || srv);
    setLocation(loc);
    setSelectedCategory(cat);

    executeSearch(q || srv, loc, cat);
  }, [searchParams]);

  const executeSearch = async (term, loc, cat) => {
    setLoading(true);
    try {
      const params = {};
      if (term) params.q = term;
      if (loc) params.city = loc;
      if (cat && cat !== 'all') params.category = cat;

      const data = await salonService.search(params);
      let list = Array.isArray(data) ? data : data?.results || [];

      if (sortBy === 'rating') {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === 'name') {
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      }

      setSalons(list);
    } catch (err) {
      setSalons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (searchTerm) newParams.q = searchTerm;
    if (location) newParams.location = location;
    if (selectedCategory && selectedCategory !== 'all') newParams.category = selectedCategory;
    setSearchParams(newParams);
    executeSearch(searchTerm, location, selectedCategory);
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    const newParams = {};
    if (searchTerm) newParams.q = searchTerm;
    if (location) newParams.location = location;
    if (catId !== 'all') newParams.category = catId;
    setSearchParams(newParams);
    executeSearch(searchTerm, location, catId);
    setMobileFiltersOpen(false);
  };

  const toggleWishlist = (salonId) => {
    setWishlist(prev => {
      const next = { ...prev, [salonId]: !prev[salonId] };
      toast.success(next[salonId] ? 'Saved to your wishlist' : 'Removed from wishlist');
      return next;
    });
  };

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const data = await salonService.getNearby(latitude, longitude, 50);
          const list = Array.isArray(data) ? data : data?.results || [];
          setSalons(list);
          if (list.length > 0) {
            toast.success(`Found ${list.length} nearby studios`);
          } else {
            toast.error('No studios found near your coordinates');
          }
        } catch (err) {
          setSalons([]);
        } finally {
          setGeoLocating(false);
        }
      },
      () => {
        setGeoLocating(false);
        toast.error('Location permission denied.');
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="bg-[#292966] text-white min-h-screen">
      
      {/* 1. BREADCRUMB & PAGE HEADER */}
      <div className="bg-[#1e1e4f] border-b border-[rgba(163,163,204,0.12)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="bloxic-sub-title">Verified Directory</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Studio Directory & Barber Search
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleFindNearby}
                disabled={geoLocating}
                className="flex items-center gap-2 px-4 py-2 bg-[#363675] border border-[rgba(163,163,204,0.15)] hover:border-[#CCCCFF] text-xs font-bold uppercase tracking-wider text-white transition-colors"
              >
                <Navigation size={13} className={geoLocating ? 'animate-spin text-[#CCCCFF]' : 'text-[#CCCCFF]'} />
                <span>{geoLocating ? 'Locating...' : 'Near Me (GPS)'}</span>
              </button>

              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#CCCCFF] text-[#292966] text-xs font-bold uppercase tracking-wider"
              >
                <SlidersHorizontal size={13} />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STICKY SEARCH BAR */}
      <div className="bg-[#363675] border-b border-[rgba(163,163,204,0.12)] py-4 sticky top-16 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center px-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] focus-within:border-[#CCCCFF] transition-colors">
              <SearchIcon size={16} className="text-[#CCCCFF] mr-2 shrink-0" />
              <input 
                type="text"
                placeholder="Search by studio name or treatment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder:text-white/45 focus:outline-none font-medium"
              />
            </div>

            <div className="flex-1 flex items-center px-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] focus-within:border-[#CCCCFF] transition-colors">
              <MapPin size={16} className="text-[#CCCCFF] mr-2 shrink-0" />
              <input 
                type="text"
                placeholder="Location (e.g. Bangalore, Lavelle Road)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder:text-white/45 focus:outline-none font-medium"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] text-xs font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <SearchIcon size={14} />
              <span>Filter Results</span>
            </button>
          </form>
        </div>
      </div>

      {/* 3. MAIN CONTENT: SIDEBAR + RESULTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block space-y-8">
            
            {/* Category Filter */}
            <div className="bg-[#363675] p-6 border border-[rgba(163,163,204,0.12)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 pb-2 border-b border-[rgba(163,163,204,0.1)]">
                Craft Category
              </h3>
              <ul className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between border ${
                        selectedCategory === cat.id
                          ? 'bg-[#CCCCFF] text-[#292966] font-bold border-[#CCCCFF]'
                          : 'bg-[#1e1e4f] text-white/80 border-[rgba(163,163,204,0.1)] hover:border-[#CCCCFF]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {selectedCategory === cat.id && <Check size={13} className="text-[#292966]" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quality Standard Card */}
            <div className="bg-[#1e1e4f] p-6 border border-[rgba(163,163,204,0.12)] space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#CCCCFF] block">
                Verification Protocol
              </span>
              <h4 className="text-sm font-bold text-white">100% Verified Partners</h4>
              <p className="text-xs text-white/70 leading-relaxed font-body">
                Every studio in our directory is inspected for sanitation, artisan certification, and punctual calendar handling.
              </p>
            </div>

          </aside>

          {/* MAIN RESULTS FEED */}
          <main className="lg:col-span-3">
            
            {/* Top Toolbar */}
            <div className="bg-[#363675] px-5 py-3 border border-[rgba(163,163,204,0.12)] mb-6 flex items-center justify-between text-xs">
              <span className="text-white/80">
                Found <strong className="text-[#CCCCFF]">{salons.length}</strong> active studios
              </span>

              <div className="flex items-center gap-2">
                <span className="text-white/70 font-semibold">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    executeSearch(searchTerm, location, selectedCategory);
                  }}
                  className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] text-xs font-semibold text-white px-3 py-1.5 focus:outline-none focus:border-[#CCCCFF]"
                >
                  <option value="rating">Top Rated</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Salons Grid */}
            {salons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {salons.map((salon) => (
                  <div 
                    key={salon.id}
                    className="group bg-[#363675] border border-[rgba(163,163,204,0.12)] hover:border-[#CCCCFF] hover:shadow-bloxic-hover transition-all duration-300 relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Photo Container */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#1e1e4f]">
                        <img 
                          src={salon.images?.[0]?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'} 
                          alt={salon.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <span className="absolute top-3 left-3 bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                          Verified
                        </span>

                        {/* Slide-Up Action Bar */}
                        <div className="absolute -bottom-12 group-hover:bottom-3 left-3 right-3 flex items-center justify-center gap-2 transition-all duration-300 z-10">
                          <button
                            onClick={() => toggleWishlist(salon.id)}
                            className={`w-9 h-9 bg-[#1e1e4f] border border-[rgba(163,163,204,0.2)] shadow-md flex items-center justify-center transition-colors ${
                              wishlist[salon.id] ? 'text-red-400' : 'text-white hover:text-[#CCCCFF]'
                            }`}
                            title="Save to Wishlist"
                          >
                            <Heart size={16} className={wishlist[salon.id] ? 'fill-red-400' : ''} />
                          </button>
                          
                          <Link
                            to={`/salon/${salon.id}`}
                            className="flex-1 py-2 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] text-[11px] font-bold uppercase tracking-wider text-center shadow-md transition-colors"
                          >
                            Book Appointment
                          </Link>

                          <Link
                            to={`/salon/${salon.id}`}
                            className="w-9 h-9 bg-[#1e1e4f] border border-[rgba(163,163,204,0.2)] shadow-md flex items-center justify-center text-white hover:text-[#CCCCFF] transition-colors"
                            title="Quick View"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin size={12} className="text-[#CCCCFF]" />
                            <span>{salon.city || 'Bangalore'}</span>
                          </span>
                          <div className="flex items-center gap-1 text-[#CCCCFF] font-semibold">
                            <Star size={12} className="fill-[#CCCCFF]" />
                            <span>{salon.rating || 5.0}</span>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-[#CCCCFF] transition-colors mb-1.5 leading-snug">
                          <Link to={`/salon/${salon.id}`}>{salon.name}</Link>
                        </h3>

                        <p className="text-white/70 text-xs line-clamp-2 leading-relaxed mb-3">
                          {salon.description || 'Master grooming atelier offering precision cuts and styling.'}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {(salon.tags || ['Master Stylist', 'Private Suite']).slice(0, 2).map((t, idx) => (
                            <span key={idx} className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.12)] text-white/75">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-[rgba(163,163,204,0.12)] bg-[#1e1e4f] flex items-center justify-between text-xs">
                      <span className="text-white/60 font-medium">Daily {salon.opening_time || '09:00'} - {salon.closing_time || '21:00'}</span>
                      <span className="font-bold text-[#CCCCFF]">{salon.service_count ? `${salon.service_count} Treatments` : 'Open'}</span>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-[rgba(163,163,204,0.12)] bg-[#363675] p-8 max-w-xl mx-auto w-full">
                <MapPin size={40} className="mx-auto text-[#CCCCFF] mb-3 opacity-60" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">No Studios Found</h3>
                <p className="text-xs text-white/60 mt-1 max-w-md mx-auto font-sans">
                  No salons matched your search parameters. Try searching for a different city or service title.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setLocation(''); setSelectedCategory('all'); setSearchParams({}); executeSearch('', '', 'all'); }}
                  className="mt-4 px-5 py-2.5 bg-[#CCCCFF] text-[#292966] text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* 4. MOBILE FILTER BOTTOM SHEET DRAWER */}
      {mobileFiltersOpen && (
        <div data-mobile-modal="open" className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative bg-[#363675] text-white w-full max-h-[85vh] overflow-y-auto p-6 border-t border-[rgba(163,163,204,0.15)] shadow-2xl z-10 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(163,163,204,0.12)] mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#CCCCFF]" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Filter & Sort Studios</h3>
              </div>
              <button 
                data-modal-close="true"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sort Section */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-white/60 block mb-2">Sort Results</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setSortBy('rating'); executeSearch(searchTerm, location, selectedCategory); }}
                  className={`py-2 px-3 text-xs font-semibold border ${
                    sortBy === 'rating' ? 'bg-[#CCCCFF] text-[#292966] border-[#CCCCFF]' : 'bg-[#1e1e4f] text-white/80 border-[rgba(163,163,204,0.15)]'
                  }`}
                >
                  Top Rated
                </button>
                <button
                  type="button"
                  onClick={() => { setSortBy('name'); executeSearch(searchTerm, location, selectedCategory); }}
                  className={`py-2 px-3 text-xs font-semibold border ${
                    sortBy === 'name' ? 'bg-[#CCCCFF] text-[#292966] border-[#CCCCFF]' : 'bg-[#1e1e4f] text-white/80 border-[rgba(163,163,204,0.15)]'
                  }`}
                >
                  Alphabetical
                </button>
              </div>
            </div>

            {/* Category Section */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-white/60 block mb-2">Select Category</label>
              <div className="space-y-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-medium border flex items-center justify-between ${
                      selectedCategory === cat.id ? 'bg-[#CCCCFF] text-[#292966] font-bold border-[#CCCCFF]' : 'bg-[#1e1e4f] text-white/80 border-[rgba(163,163,204,0.1)]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Search;
