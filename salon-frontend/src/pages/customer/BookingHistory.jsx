import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Scissors, User, Loader, 
  AlertCircle, Navigation, CheckCircle, ArrowRight, Sparkles 
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    try {
      await bookingService.updateAppointmentStatus(bookingId, newStatus);
      toast.success(newStatus === 'en_route' ? "Stylist notified: You are on your way!" : "Status updated");
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancelling(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">Confirmed</span>;
      case 'en_route':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center gap-1"><Navigation size={11} /> En Route</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#1e1e4f] text-white/70 border border-[rgba(163,163,204,0.15)]">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-950/60 text-red-400 border border-red-800/60">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-yellow-950/60 text-yellow-300 border border-yellow-800/60">Pending</span>;
    }
  };

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), 'EEEE, dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#292966]">
        <div className="w-10 h-10 border-2 border-[rgba(163,163,204,0.2)] border-t-[#CCCCFF] rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider text-[#CCCCFF]">Loading Reservations...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#292966] text-white min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[rgba(163,163,204,0.12)] mb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs text-white/60 uppercase tracking-wider mb-2">
              <Link to="/" className="hover:text-[#CCCCFF]">Home</Link>
              <span>/</span>
              <span className="text-white font-bold">Client Account</span>
            </nav>
            <span className="bloxic-sub-title">Reservations</span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              My Appointments
            </h1>
          </div>

          <Link
            to="/search"
            className="bloxic-btn-primary py-2.5 px-6 text-xs"
          >
            <span>Book New Appointment</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-[#363675] border border-[rgba(163,163,204,0.12)] p-12 text-center">
            <Calendar className="h-12 w-12 text-[#CCCCFF]/40 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">No Active Reservations</h3>
            <p className="text-white/70 text-xs max-w-sm mx-auto mb-6">
              You haven't scheduled any salon visits yet. Explore top studios in your city.
            </p>
            <Link to="/search" className="bloxic-btn-primary text-xs py-2.5 px-6">
              Find Studios
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#363675] border border-[rgba(163,163,204,0.12)] hover:border-[#CCCCFF] transition-all p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {b.salon_name || b.salon?.name || 'TechMasters Salon & Grooming Atelier'}
                    </h3>
                    <p className="text-xs text-[#CCCCFF] font-semibold mt-0.5">
                      {b.service_name || b.service?.name || 'Signature Grooming Treatment'}
                    </p>
                  </div>
                  <div>{getStatusBadge(b.status)}</div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[rgba(163,163,204,0.12)] text-xs">
                  <div>
                    <span className="text-white/60 block uppercase tracking-wider text-[10px]">Date</span>
                    <span className="font-bold text-white mt-0.5 block">{formatDate(b.appointment_date)}</span>
                  </div>
                  <div>
                    <span className="text-white/60 block uppercase tracking-wider text-[10px]">Slot Time</span>
                    <span className="font-bold text-[#CCCCFF] mt-0.5 block">{b.appointment_time}</span>
                  </div>
                  <div>
                    <span className="text-white/60 block uppercase tracking-wider text-[10px]">Stylist</span>
                    <span className="font-bold text-white mt-0.5 block">{b.staff_name || b.staff?.name || 'Senior Stylist'}</span>
                  </div>
                  <div>
                    <span className="text-white/60 block uppercase tracking-wider text-[10px]">Treatment Fee</span>
                    <span className="font-black text-sm text-[#CCCCFF] mt-0.5 block">
                      ₹{b.service_price || b.service?.price || '1,450'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-wrap items-center justify-end gap-3">
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(b.id, 'en_route')}
                      disabled={updating === b.id}
                      className="px-4 py-2 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <Navigation size={12} className={updating === b.id ? 'animate-spin' : ''} />
                      <span>I'm On My Way</span>
                    </button>
                  )}

                  {['pending', 'confirmed'].includes(b.status) && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancelling === b.id}
                      className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:underline disabled:opacity-50"
                    >
                      {cancelling === b.id ? 'Cancelling...' : 'Cancel Appointment'}
                    </button>
                  )}

                  {b.status === 'en_route' && (
                    <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 border border-amber-800/60 flex items-center gap-1">
                      <Navigation size={12} />
                      Barber Notified: Heading to Studio
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingHistory;
