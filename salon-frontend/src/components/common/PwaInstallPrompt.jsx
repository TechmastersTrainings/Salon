import { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import { isNative, triggerHaptic } from '../../services/nativeService';

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // If running inside Capacitor native APK, don't show PWA prompt
    if (isNative) return;

    // Check if dismissed before in session
    if (sessionStorage.getItem('pwa_dismissed')) return;

    const handler = (e) => {
      // Prevent browser default install mini-infobar
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    triggerHaptic();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    triggerHaptic();
    setShowPrompt(false);
    sessionStorage.setItem('pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-3 left-4 right-4 z-50 md:hidden animate-slideDown">
      <div className="bg-[#0e3854] text-[#F2F0E9] p-3.5 shadow-2xl border border-[#B9F12F]/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-[#B9F12F] flex items-center justify-center shrink-0">
            <Download size={18} className="text-[#0B3048]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold truncate">Install MakeMyHair</p>
            <p className="text-[10px] text-[#F2F0E9]/70 truncate">Fast appointments right from your home screen</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstall}
            className="px-3 py-1.5 bg-[#B9F12F] hover:bg-[#a6db24] text-[#0B3048] text-[10px] font-bold uppercase tracking-wider transition-colors active:scale-95"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss install banner"
            className="p-1 text-[#F2F0E9]/70 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;

