import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, Clock, User, Scissors, Loader, 
  ChevronLeft, CheckCircle2, ShieldCheck, Star, 
  Sparkles, Check, ArrowRight, Store
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { bookingService } from '../services/bookingService';
import { salonService } from '../services/salonService';
import { format, addDays, startOfToday, isSameDay, parseISO } from 'date-fns';
import { triggerHaptic } from '../services/nativeService';

const Booking = () => {
  const { salonId } = useParams();
  const [searchParams] = useSearchParams();
  const preSelectedServiceId = searchParams.get('serviceId');
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  const [ui, setUi] = useState({ loading: true, submitting: false, step: 1 });
  const [data, setData] = useState({ salon: null, services: [], allStaff: [], userBookings: [] });
  const [selection, setSelection] = useState({ service: null, date: '', time: '', staff: null });
  const [availability, setAvailability] = useState({ staff: [], slots: [] });

  const dateOptions = useMemo(() => 
    [0, 1, 2, 3, 4, 5, 6].map(offset => {
      const d = addDays(startOfToday(), offset);
      return { 
        value: format(d, 'yyyy-MM-dd'), 
        dayName: offset === 0 ? 'Today' : format(d, 'EEE'),
        dateNum: format(d, 'dd MMM') 
      };
    }), []);

  useEffect(() => {
    if (!token && !user) {
      return navigate('/login', { state: { from: `/booking/${salonId}` } });
    }
    
    const init = async () => {
      try {
        const [s, srv, stf, hist] = await Promise.all([
          salonService.getById(salonId),
          bookingService.getServices(salonId),
          bookingService.getStaff(salonId),
          bookingService.getBookingHistory()
        ]);

        const servicesList = Array.isArray(srv) ? srv : srv?.results || [];
        const staffList = Array.isArray(stf) ? stf : stf?.results || [];

        setData({
          salon: s,
          services: servicesList,
          allStaff: staffList,
          userBookings: Array.isArray(hist) ? hist : hist?.results || []
        });

        if (preSelectedServiceId) {
          const match = servicesList.find(item => item.id === parseInt(preSelectedServiceId));
          if (match) {
            setSelection(prev => ({ ...prev, service: match, date: format(startOfToday(), 'yyyy-MM-dd') }));
            setUi(prev => ({ ...prev, step: 2 }));
          }
        }
      } catch (e) {
        toast.error('Could not connect to salon services');
      } finally {
        setUi(prev => ({ ...prev, loading: false }));
      }
    };
    init();
  }, [salonId, token, user, navigate, preSelectedServiceId]);

  useEffect(() => {
    if (!selection.date) return;
    const now = new Date();
    const isToday = isSameDay(parseISO(selection.date), now);
    const times = [];

    for (let h = 9; h <= 20; h++) {
      ['00', '30'].forEach(m => {
        const slot = `${h.toString().padStart(2, '0')}:${m}`;
        const isPast = isToday && (h < now.getHours() || (h === now.getHours() && parseInt(m) <= now.getMinutes() + 15));
        
        const isUserBooked = data.userBookings.some(b => 
          b.appointment_date === selection.date && 
          b.appointment_time && b.appointment_time.startsWith(slot) && 
          !['cancelled', 'completed'].includes(b.status)
        );

        times.push({ 
          time: slot, 
          disabled: isPast || isUserBooked, 
          conflict: isUserBooked 
        });
      });
    }
    setAvailability(prev => ({ ...prev, slots: times }));
  }, [selection.date, data.userBookings]);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!selection.service || !selection.date || !selection.time) return;
      try {
        const available = await bookingService.getAvailableStaff(
          salonId, 
          selection.service.id, 
          selection.date, 
          selection.time
        );
        const list = Array.isArray(available) ? available : available?.results || [];
        setAvailability(prev => ({ ...prev, staff: list.length > 0 ? list : data.allStaff }));
      } catch (err) {
        setAvailability(prev => ({ ...prev, staff: data.allStaff }));
      }
    };
    fetchStaff();
  }, [salonId, selection.service, selection.date, selection.time, data.allStaff]);

  const handleBooking = async () => {
    setUi(prev => ({ ...prev, submitting: true }));
    try {
      const payload = {
        salon_id: parseInt(salonId),
        service_id: selection.service.id,
        appointment_date: selection.date,
        appointment_time: selection.time,
        payment_method: 'cash',
        staff_id: selection.staff?.id || (data.allStaff[0]?.id || null)
      };

      await bookingService.createBooking(payload);
      triggerHaptic();
      toast.success('Your studio appointment has been confirmed!');
      navigate('/bookings');
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.detail || 'Failed to complete appointment reservation.';
      toast.error(msg);
    } finally {
      setUi(prev => ({ ...prev, submitting: false }));
    }
  };

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(p || 0);

  if (ui.loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-ivory">
      <div className="w-10 h-10 border-2 border-line border-t-rose-500 rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-bold uppercase tracking-widest text-rose-600">Loading Studio Scheduling...</p>
    </div>
  );

  return (
    <div className="bg-ivory text-ink min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Breadcrumb Header */}
        <div className="mb-8 text-center">
          <nav className="flex items-center justify-center gap-2 text-xs text-muted uppercase tracking-wider mb-2">
            <Link to="/" className="hover:text-rose-600">Home</Link>
            <span>/</span>
            <Link to={`/salon/${salonId}`} className="hover:text-rose-600">{data.salon?.name || 'Studio'}</Link>
            <span>/</span>
            <span className="text-ink font-bold">Checkout</span>
          </nav>
          <span className="bloxic-sub-title">Reservation</span>
          <h1 className="text-3xl font-bold text-ink tracking-tight">
            Book Appointment
          </h1>
          <p className="text-body text-xs mt-1">
            Studio: <strong className="text-rose-600">{data.salon?.name}</strong> • {data.salon?.city}
          </p>
        </div>

        {/* 4-Step Progress Bar */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-8 sm:mb-10 text-center">
          {[
            { step: 1, label: 'Treatment', short: 'Treatment' },
            { step: 2, label: 'Date & Time', short: 'Time' },
            { step: 3, label: 'Specialist', short: 'Stylist' },
            { step: 4, label: 'Confirm', short: 'Confirm' }
          ].map(item => (
            <div 
              key={item.step}
              className={`py-2.5 px-1 sm:px-2 border-b-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${
                ui.step === item.step
                  ? 'border-rose-400 text-rose-600'
                  : ui.step > item.step
                  ? 'border-rose-300 text-rose-500'
                  : 'border-line text-neutral-400'
              }`}
            >
              <span className="sm:hidden">{item.step}. {item.short}</span>
              <span className="hidden sm:inline">{item.step}. {item.label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: SERVICE SELECTION */}
        {ui.step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink mb-4">
              Select Your Required Service
            </h2>

            <div className="space-y-3">
              {data.services.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => {
                    triggerHaptic();
                    setSelection(p => ({ ...p, service: srv, date: p.date || format(startOfToday(), 'yyyy-MM-dd') }));
                    setUi(p => ({ ...p, step: 2 }));
                  }}
                  className="p-4 sm:p-5 bg-surface border border-line hover:border-rose-400 hover:shadow-bloxic cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="pr-4">
                    <h3 className="font-bold text-sm text-ink">{srv.name}</h3>
                    <p className="text-xs text-body mt-1 line-clamp-1">{srv.description || 'Professional salon treatment'}</p>
                    <span className="text-xs text-rose-600 mt-2 block font-medium">
                      Duration: {srv.duration_minutes} Minutes
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-bold text-rose-600 block mb-2">{formatPrice(srv.price)}</span>
                    <span className="px-3 py-1 bg-ink text-ivory text-[10px] font-bold uppercase tracking-wider">
                      Select
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: DATE & TIME */}
        {ui.step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
                  Choose Date & Time Slot
                </h2>
                <p className="text-xs text-body mt-0.5">Selected: <strong className="text-rose-600">{selection.service?.name}</strong> ({formatPrice(selection.service?.price)})</p>
              </div>
              <button
                onClick={() => {
                  triggerHaptic();
                  setUi(p => ({ ...p, step: 1 }));
                }}
                className="text-xs font-bold uppercase tracking-wider text-rose-600 hover:underline"
              >
                Change Service
              </button>
            </div>

            {/* Date Pickers */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Available Dates</span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {dateOptions.map(d => (
                  <button
                    key={d.value}
                    onClick={() => {
                      triggerHaptic();
                      setSelection(p => ({ ...p, date: d.value }));
                    }}
                    className={`py-3 px-2 text-center border transition-all text-xs ${
                      selection.date === d.value
                        ? 'bg-ink text-ivory border-ivory/40 font-bold'
                        : 'bg-surface border-line text-ink hover:border-rose-400'
                    }`}
                  >
                    <span className={`block text-[10px] uppercase font-semibold ${selection.date === d.value ? 'text-ivory/70' : 'text-muted'}`}>{d.dayName}</span>
                    <span className="block font-bold mt-0.5">{d.dateNum}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Pickers */}
            {selection.date && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Select Preferred Hour</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availability.slots.map(s => (
                    <button
                      key={s.time}
                      disabled={s.disabled}
                      onClick={() => {
                        triggerHaptic();
                        setSelection(p => ({ ...p, time: s.time }));
                        setUi(p => ({ ...p, step: 3 }));
                      }}
                      className={`py-3 px-2 text-xs font-bold border transition-colors ${
                        s.conflict
                          ? 'bg-red-50 text-red-700 border-red-800/40 cursor-not-allowed'
                          : s.disabled
                          ? 'bg-blush text-neutral-400 border-line cursor-not-allowed'
                          : selection.time === s.time
                          ? 'bg-ink text-ivory border-ivory/40 font-bold'
                          : 'bg-surface border-line text-ink hover:border-rose-400'
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: PICK SPECIALIST */}
        {ui.step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
                  Choose Stylist / Specialist
                </h2>
                <p className="text-xs text-body mt-0.5">Slot: {selection.date} at {selection.time}</p>
              </div>
              <button
                onClick={() => {
                  triggerHaptic();
                  setUi(p => ({ ...p, step: 2 }));
                }}
                className="text-xs font-bold uppercase tracking-wider text-rose-600 hover:underline"
              >
                Change Time
              </button>
            </div>

            <div className="space-y-3">
              {availability.staff.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    triggerHaptic();
                    setSelection(p => ({ ...p, staff: m }));
                    setUi(p => ({ ...p, step: 4 }));
                  }}
                  className="p-4 bg-surface border border-line hover:border-rose-400 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blush border border-rose-300 flex items-center justify-center font-bold text-sm text-rose-600">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-ink">{m.name}</h4>
                      <p className="text-xs text-rose-600 font-semibold">{m.role || 'Senior Specialist'}</p>
                      <span className="text-[10px] text-muted">{m.experience_years || 5}+ Years Experience</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-ink text-ivory text-[10px] font-bold uppercase tracking-wider">
                    Select
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: ORDER SUMMARY & CONFIRMATION */}
        {ui.step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-surface border border-line p-8 shadow-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 block mb-1">
                Order Review
              </span>
              <h2 className="text-2xl font-bold text-ink mb-6">
                Appointment Summary
              </h2>

              <div className="space-y-3 py-4 border-y border-line text-xs">
                <div className="flex justify-between">
                  <span className="text-body">Salon Studio:</span>
                  <span className="font-bold text-ink">{data.salon?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body">Treatment:</span>
                  <span className="font-bold text-ink">{selection.service?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body">Specialist:</span>
                  <span className="font-bold text-ink">{selection.staff?.name || 'Assigned Senior Stylist'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body">Date & Slot:</span>
                  <span className="font-bold text-rose-600">{selection.date} at {selection.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body">Payment Option:</span>
                  <span className="font-semibold text-ink">Pay at Studio (Cash, Card, UPI)</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-body">Total Treatment Price</span>
                <span className="text-2xl font-bold text-rose-600">
                  {formatPrice(selection.service?.price)}
                </span>
              </div>

              <button
                onClick={handleBooking}
                disabled={ui.submitting}
                className="w-full bloxic-btn-primary py-4 text-xs font-bold uppercase tracking-wider shadow-lg"
              >
                {ui.submitting ? 'Confirming Appointment...' : 'Confirm Reservation'}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setUi(p => ({ ...p, step: 1 }))}
                className="text-xs font-bold uppercase tracking-wider text-muted hover:text-rose-600 transition-colors"
              >
                Restart Booking
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Booking;
