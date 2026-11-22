import { FileCheck, ShieldCheck, Scale, AlertCircle } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#292966] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="border-b border-[rgba(163,163,204,0.18)] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1e1e4f] border border-[#CCCCFF]/30 text-[#CCCCFF] text-xs font-bold uppercase tracking-wider mb-4">
            <Scale size={14} />
            <span>Master Merchant & Patron Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Terms of Service & Atelier Agreement
          </h1>
          <p className="text-sm text-[#CCCCFF]/80">
            Governed by the Information Technology Act, 2000 & Consumer Protection Act, 2019
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">1</span>
            Acceptance of Platform Terms
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            By creating an account, booking an atelier service, or registering as a salon merchant on MakeMyHair (&quot;Platform&quot;), you enter into a legally binding contract with MakeMyHair Digital Network Pvt. Ltd. If you disagree with any portion of these terms, you must refrain from using the platform services immediately.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">2</span>
            Customer Booking Protocol & Punctuality
          </h2>
          <ul className="text-xs text-white/80 space-y-2 list-disc pl-5">
            <li><span className="font-semibold text-white">Confirmed Time Slots:</span> An appointment is confirmed only upon system slot assignment and payment initiation/verification.</li>
            <li><span className="font-semibold text-white">Grace Period:</span> Customers are requested to arrive 10 minutes prior to the booked time. A grace window of 15 minutes is observed, after which salons reserve the right to mark the booking as a no-show to avoid delaying subsequent clients.</li>
            <li><span className="font-semibold text-white">Service Customization:</span> Any additional treatments requested in the salon chair must be paid according to standard atelier tariffs.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">3</span>
            Merchant Obligations & Salon Partner Charter
          </h2>
          <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.12)] p-5 space-y-3">
            <p className="text-xs text-white/80 leading-relaxed">
              Every salon partner listed on MakeMyHair agrees to uphold premier luxury salon standards:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-white/70">
              <div className="p-3 bg-[#363675] border border-[rgba(163,163,204,0.1)]">
                <span className="font-bold text-white block mb-1">Hygiene & Sanitation</span>
                Sterilization of shear tools, clean capes, and sanitized styling stations between client sessions.
              </div>
              <div className="p-3 bg-[#363675] border border-[rgba(163,163,204,0.1)]">
                <span className="font-bold text-white block mb-1">Certified Specialists</span>
                Assigning certified professionals possessing verified domain experience.
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">4</span>
            Intellectual Property & Copyrights
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            All proprietary styling concepts, platform source code, graphic designs, Bloxic visual styling, typography, brand names, and logos (&quot;MakeMyHair&quot;) are exclusive intellectual properties of MakeMyHair Digital Network Pvt. Ltd. Unauthorized reverse-engineering, scraping, or branding imitation is prohibited by law.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">5</span>
            Governing Law & Dispute Resolution
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            These terms are governed exclusively by the laws of India. Any legal dispute, arbitration, or statutory claim arising from platform transactions shall fall under the sole jurisdiction of competent courts in Bangalore, Karnataka.
          </p>
        </div>

      </div>
    </div>
  );
};

export default TermsOfService;
