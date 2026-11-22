import { Link } from 'react-router-dom';
import { 
  Scissors, Mail, Phone, MapPin, ShieldCheck, 
  Sparkles, Clock, ArrowRight, Instagram, Facebook, Twitter, Check
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for subscribing to MakeMyHair Gazette!');
    setEmail('');
  };

  return (
    <footer className="bg-footer text-ivory mt-auto">
      
      {/* 1. NEWSLETTER STRIP */}
      <div className="border-b border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 reveal">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-rose-300 block mb-2">
              Stay in the Know
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-ivory">
              Subscribe to Our Seasonal Newsletter
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 font-light">
              Get secret promotional codes, curated styling guides, and early access to salon chairs.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md flex flex-col sm:flex-row gap-0">
            <input 
              type="email" 
              placeholder="Your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 text-ivory placeholder:text-neutral-400 focus:outline-none focus:border-rose-400 text-xs font-medium"
            />
            <button 
              type="submit" 
              className="px-7 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* 2. MAIN 4-COLUMN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 reveal-stagger">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/5 border border-rose-300/50 rounded-full flex items-center justify-center text-rose-300">
                <Scissors size={18} />
              </div>
              <span className="font-display text-2xl tracking-[0.06em] text-ivory uppercase">
                MAKEMY<span className="text-rose-300">HAIR</span>
              </span>
            </Link>

            <p className="text-neutral-400 text-xs leading-relaxed">
              India's premier digital salon network. Connect with master barbers, award-winning hair architects, and certified stylists in top cities.
            </p>

            <div className="space-y-2 pt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-rose-300" />
                <span className="text-ivory font-semibold">+91 98807 68222</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-rose-300" />
                <span>Techmasterstrainings@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-ivory pb-1 border-b border-white/10">
              Quick Exploration
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li><Link to="/search" className="hover:text-ivory transition-colors">Find a Studio</Link></li>
              <li><Link to="/search?category=Haircut" className="hover:text-ivory transition-colors">Precision Haircraft</Link></li>
              <li><Link to="/search?category=Beard" className="hover:text-ivory transition-colors">Beard Sculpting & Shave</Link></li>
              <li><Link to="/search?category=Color" className="hover:text-ivory transition-colors">Balayage & Hair Color</Link></li>
              <li><Link to="/search?category=Spa" className="hover:text-ivory transition-colors">Scalp Reflexology Spa</Link></li>
            </ul>
          </div>

          {/* Column 3: Atelier Studios */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-ivory pb-1 border-b border-white/10">
              Atelier Cities
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li><Link to="/search?location=Bangalore" className="hover:text-ivory transition-colors">Bangalore (Lavelle Road, Indiranagar)</Link></li>
              <li><Link to="/search?location=Mumbai" className="hover:text-ivory transition-colors">Mumbai (Bandra West, Colaba)</Link></li>
              <li><Link to="/search?location=Delhi" className="hover:text-ivory transition-colors">New Delhi (Connaught Place, GK II)</Link></li>
              <li><Link to="/search?location=Hyderabad" className="hover:text-ivory transition-colors">Hyderabad (Jubilee Hills)</Link></li>
              <li><Link to="/search?location=Chennai" className="hover:text-ivory transition-colors">Chennai (Nungambakkam)</Link></li>
            </ul>
          </div>

          {/* Column 4: Salon Partners & Trust */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-ivory pb-1 border-b border-white/10">
              Partner With Us
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you a salon owner or independent hair artist? List your business on MakeMyHair and receive booking guarantees.
            </p>
            <div className="pt-2">
              <Link 
                to="/register" 
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-300 hover:underline"
              >
                <span>Salon Owner Registration</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM COPYRIGHT STRIP */}
      <div className="border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 MakeMyHair Digital Network. Designed in Bloxic Aesthetic.</p>
          <div className="flex items-center gap-6">
            <Link to="/search" className="hover:text-ivory transition-colors">Privacy Policy</Link>
            <Link to="/search" className="hover:text-ivory transition-colors">Terms of Service</Link>
            <Link to="/search" className="hover:text-ivory transition-colors">Security & Trust</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
