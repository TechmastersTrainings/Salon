import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#292966] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="border-b border-[rgba(163,163,204,0.18)] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1e1e4f] border border-[#CCCCFF]/30 text-[#CCCCFF] text-xs font-bold uppercase tracking-wider mb-4">
            <Shield size={14} />
            <span>DPDP Act 2023 & GDPR Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Privacy Policy & Data Governance
          </h1>
          <p className="text-sm text-[#CCCCFF]/80">
            Last updated: November 2026 • Effective Date: January 1, 2026 • MakeMyHair Digital Network Pvt. Ltd.
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">1</span>
            Data Protection Commitment
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            MakeMyHair (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates India&apos;s digital atelier salon network. We are committed to safeguarding your personal information in strict compliance with the Digital Personal Data Protection (DPDP) Act 2023 of India and international data governance principles. This policy governs how we collect, process, store, and protect information when you book services or list ateliers on our platform.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">2</span>
            Information We Collect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.12)] p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#CCCCFF] mb-2">A. Information You Provide</h3>
              <ul className="text-xs text-white/70 space-y-1.5 list-disc pl-4">
                <li>Full Name, Contact Phone Number, and Verified Email Address</li>
                <li>Salon booking preferences, service selection, and appointment timings</li>
                <li>Merchant documentation (GSTIN, salon registration, stylist profiles)</li>
                <li>Customer feedback, reviews, and atelier ratings</li>
              </ul>
            </div>
            <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.12)] p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#CCCCFF] mb-2">B. Automated Data Collection</h3>
              <ul className="text-xs text-white/70 space-y-1.5 list-disc pl-4">
                <li>Device information and secure authentication session tokens (JWT)</li>
                <li>Coarse geographical coordinates (used exclusively to suggest nearest ateliers)</li>
                <li>Transactional logs and cryptographic signature verifications for payments</li>
                <li>No financial card data or UPI PINs are ever stored on our servers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">3</span>
            Purpose of Processing & Legal Basis
          </h2>
          <div className="space-y-2 text-sm text-white/80 leading-relaxed">
            <p>We process personal data solely for lawful, specified purposes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#363675] border border-[rgba(163,163,204,0.15)]">
                <CheckCircle2 size={16} className="text-[#CCCCFF] mb-1.5" />
                <h4 className="text-xs font-bold text-white mb-1">Appointment Fulfillment</h4>
                <p className="text-[11px] text-white/70">Connecting patrons with confirmed salon slots and stylist schedules.</p>
              </div>
              <div className="p-3 bg-[#363675] border border-[rgba(163,163,204,0.15)]">
                <Lock size={16} className="text-[#CCCCFF] mb-1.5" />
                <h4 className="text-xs font-bold text-white mb-1">Fraud Prevention</h4>
                <p className="text-[11px] text-white/70">Throttling brute-force attacks, enforcing RBAC, and securing payment intent.</p>
              </div>
              <div className="p-3 bg-[#363675] border border-[rgba(163,163,204,0.15)]">
                <Eye size={16} className="text-[#CCCCFF] mb-1.5" />
                <h4 className="text-xs font-bold text-white mb-1">Merchant Verification</h4>
                <p className="text-[11px] text-white/70">Vetting salon licenses, stylist certifications, and sanitary standards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">4</span>
            Data Principal Rights (DPDP Act & GDPR)
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            As a registered user, you hold complete autonomy over your personal data:
          </p>
          <ul className="text-xs text-white/80 space-y-2 list-disc pl-5">
            <li><span className="font-semibold text-white">Right to Access:</span> Request a full summary of personal data held and processing activities.</li>
            <li><span className="font-semibold text-white">Right to Correction & Erasure:</span> Update inaccurate details or request permanent account deletion via our Profile center.</li>
            <li><span className="font-semibold text-white">Right of Grievance Redressal:</span> Reach our appointed Data Protection Officer within 48 hours.</li>
            <li><span className="font-semibold text-white">Right to Nominate:</span> Designate a legal representative to exercise rights in unforeseen circumstances.</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-none bg-[#1e1e4f] border border-[#CCCCFF]/40 text-[#CCCCFF] flex items-center justify-center text-xs">5</span>
            Grievance Officer & Official Communications
          </h2>
          <div className="bg-[#1e1e4f] border border-[#CCCCFF]/20 p-5 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#CCCCFF]">Resident Grievance Officer</p>
            <p className="text-sm text-white font-medium">MakeMyHair Legal & Compliance Cell</p>
            <p className="text-xs text-white/70">Lavelle Road, Near UB City, Bangalore, Karnataka 560001, India</p>
            <p className="text-xs text-white/70">Direct Email: <span className="text-[#CCCCFF] font-mono">privacy@makemyhair.com</span></p>
            <p className="text-[11px] text-white/50 pt-2">All grievances are formally acknowledged within 24 hours and addressed within 15 business days.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
