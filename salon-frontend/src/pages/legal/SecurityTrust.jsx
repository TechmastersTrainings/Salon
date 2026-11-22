import { ShieldCheck, Lock, Key, Server, Cpu, CheckCircle } from 'lucide-react';

const SecurityTrust = () => {
  return (
    <div className="min-h-screen bg-[#292966] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="border-b border-[rgba(163,163,204,0.18)] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1e1e4f] border border-[#CCCCFF]/30 text-[#CCCCFF] text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} />
            <span>Enterprise Security Whitepaper</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Security Architecture & Trust
          </h1>
          <p className="text-sm text-[#CCCCFF]/80">
            Defensive engineering, OWASP Top 10 mitigation, cryptographic guarantees, and data isolation
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.12)] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#363675] text-[#CCCCFF] flex items-center justify-center mb-2">
              <Lock size={16} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Zero IDOR / BOLA Architecture</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Every appointment, salon asset, and payment record is validated with strict tenant and role boundaries. Authenticated users cannot inspect or tamper with records belonging to other patrons.
            </p>
          </div>

          <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.12)] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#363675] text-[#CCCCFF] flex items-center justify-center mb-2">
              <Key size={16} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cryptographic Tokenization</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              JWT authentication uses HMAC-SHA256 signatures with short-lived access tokens (60 min) and rotating refresh tokens. Sensitive credentials are never stored in client localStorage unprotected.
            </p>
          </div>

          <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.12)] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#363675] text-[#CCCCFF] flex items-center justify-center mb-2">
              <Server size={16} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Transport Layer Security (TLS 1.3)</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              All communications between web clients, mobile runtimes, and API clusters enforce HTTP Strict Transport Security (HSTS), Content-Type No-Sniff, and clickjacking X-Frame protections.
            </p>
          </div>

          <div className="bg-[#1e1e4f] border border-[rgba(163,163,204,0.12)] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#363675] text-[#CCCCFF] flex items-center justify-center mb-2">
              <Cpu size={16} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Anti-Abuse Throttling</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Intelligent rate-limiting middleware mitigates credential stuffing, automated slot exhaustion, and distributed denial-of-service attempts.
            </p>
          </div>
        </div>

        {/* Responsible Disclosure */}
        <div className="bg-[#1e1e4f] border border-[#CCCCFF]/30 p-6 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#CCCCFF]">Responsible Security Disclosure</h3>
          <p className="text-xs text-white/80 leading-relaxed">
            We welcome independent security researchers and ethical hackers to identify and responsibly report vulnerabilities. If you believe you have discovered a security defect in our platform:
          </p>
          <ul className="text-xs text-white/70 space-y-1.5 list-disc pl-5">
            <li>Email our emergency security desk at <span className="text-[#CCCCFF] font-mono">security@makemyhair.com</span>.</li>
            <li>Provide reproduction steps and proof-of-concept without exposing client records or disrupting production services.</li>
            <li>Our engineering security team will review and acknowledge all disclosures within 24 hours.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default SecurityTrust;
