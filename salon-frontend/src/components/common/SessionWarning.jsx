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
      <div className="bg-surface border-l-4 border-rose-400 rounded-2xl shadow-2xl p-4 max-w-md border border-line">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-poppins font-bold text-ink">
              Session expiring soon
            </p>
            <div className="mt-1 text-xs text-body font-sans">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-rose-600" />
                <span>Your session will expire in {timeLeft} minutes</span>
              </div>
            </div>
            <div className="mt-3 flex space-x-3">
              <button
                onClick={handleStayLoggedIn}
                className="bg-ink hover:bg-rose-600 text-ivory px-4 py-2 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-blush hover:bg-blush/80 text-ink px-4 py-2 rounded-xl text-xs font-poppins font-semibold uppercase tracking-wider border border-line transition-colors"
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
