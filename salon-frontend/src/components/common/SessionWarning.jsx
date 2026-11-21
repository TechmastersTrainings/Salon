import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { AlertTriangle, Clock } from 'lucide-react';

const SessionWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const { sessionExpiry, refreshAccessToken } = useAuthStore();

  useEffect(() => {
    const checkSession = () => {
      if (!sessionExpiry) return;

      const now = Date.now();
      const timeUntilExpiry = sessionExpiry - now;

      // Show warning when less than 5 minutes left
      if (timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000) {
        const minutes = Math.floor(timeUntilExpiry / 60000);
        const seconds = Math.floor((timeUntilExpiry % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }

      // Auto logout when expired
      if (timeUntilExpiry <= 0) {
        window.location.href = '/login?session=expired';
      }
    };

    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  const handleStayLoggedIn = async () => {
    await refreshAccessToken();
    setShowWarning(false);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideUp">
      <div className="bg-[#363675] border-l-4 border-[#CCCCFF] rounded-2xl shadow-2xl p-4 max-w-md border border-[rgba(163,163,204,0.15)]">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-[#CCCCFF]" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-poppins font-bold text-white">
              Session expiring soon
            </p>
            <div className="mt-1 text-xs text-white/70 font-sans">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-[#CCCCFF]" />
                <span>Your session will expire in {timeLeft} minutes</span>
              </div>
            </div>
            <div className="mt-3 flex space-x-3">
              <button
                onClick={handleStayLoggedIn}
                className="bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] px-4 py-2 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-[#1e1e4f] hover:bg-[#1e1e4f]/80 text-white px-4 py-2 rounded-xl text-xs font-poppins font-semibold uppercase tracking-wider border border-[rgba(163,163,204,0.2)] transition-colors"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;
