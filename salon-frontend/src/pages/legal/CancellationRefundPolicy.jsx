import { RefreshCw, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';

const CancellationRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-[#292966] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="border-b border-[rgba(163,163,204,0.18)] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1e1e4f] border border-[#CCCCFF]/30 text-[#CCCCFF] text-xs font-bold uppercase tracking-wider mb-4">
            <RefreshCw size={14} />
            <span>Fair Commerce & Refund Guarantees</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Cancellation & Refund Policy
          </h1>
          <p className="text-sm text-[#CCCCFF]/80">
            Clear, transparent refund timelines for client appointments and salon wallet deposits
          </p>
        </div>

        {/* Timeframe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] p-5">
            <div className="text-2xl font-black text-[#CCCCFF] mb-1">100% Refund</div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-2">Free Cancellation</p>
            <p className="text-xs text-white/70 leading-relaxed">
              Cancel up to 2 hours prior to scheduled appointment start time with zero cancellation charges.
            </p>
          </div>
          <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] p-5">
            <div className="text-2xl font-black text-[#CCCCFF] mb-1">Free Reschedule</div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-2">Flexible Slot Move</p>
            <p className="text-xs text-white/70 leading-relaxed">
              Reschedule with the same salon specialist anytime up to 1 hour before appointment with no deduction.
            </p>
          </div>
          <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] p-5">
            <div className="text-2xl font-black text-[#CCCCFF] mb-1">Salon No-Show</div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-2">100% Protected</p>
            <p className="text-xs text-white/70 leading-relaxed">
              If an atelier fails to honor your confirmed appointment slot, you receive an immediate full refund.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">1</span>
            Refund Processing Timelines
          </h2>
          <div className="space-y-3 text-xs text-white/80 leading-relaxed">
            <p>
              Once a cancellation is initiated and verified by the platform, refunds are dispatched through the original payment rails:
            </p>
            <div className="bg-[#363675] border border-[rgba(163,163,204,0.12)] p-4 space-y-2">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="font-semibold text-white">Direct UPI Payment</span>
                <span className="text-[#CCCCFF] font-mono font-bold">Instant to 2 Hours</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="font-semibold text-white">Salon Owner Wallet Recharges</span>
                <span className="text-[#CCCCFF] font-mono font-bold">Instant Credit Rollback</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">Debit / Credit Cards & Net Banking</span>
                <span className="text-[#CCCCFF] font-mono font-bold">2 - 5 Business Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">2</span>
            How to Request a Cancellation or Refund
          </h2>
          <ul className="text-xs text-white/80 space-y-2 list-disc pl-5">
            <li>Log into your MakeMyHair account and navigate to <span className="text-[#CCCCFF] font-semibold">My Bookings</span>.</li>
            <li>Locate the active booking and click the <span className="text-white font-semibold">Cancel Appointment</span> button.</li>
            <li>The system will automatically compute refund eligibility based on the timestamp and trigger the credit to your source account.</li>
            <li>For escalated queries, email our billing desk at <span className="text-[#CCCCFF] font-mono">support@makemyhair.com</span> with your Booking ID.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default CancellationRefundPolicy;

