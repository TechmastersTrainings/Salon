import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';

const AuthRedirect = ({ children }) => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!token;

  useEffect(() => {
    if (isAuthenticated) {
      // Check if there is a 'redirect' parameter in the current URL
      const params = new URLSearchParams(location.search);
      const redirectTo = params.get('redirect');

      if (redirectTo) {
        // PRIORITY: If a redirect path exists (like /booking/5), go there!
        console.log('AuthRedirect: Redirecting to intended destination:', redirectTo);
        navigate(redirectTo, { replace: true });
      } else {
        // FALLBACK: Original role-based logic if no redirect is present
        if (user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (user?.role === 'owner') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    }
  }, [isAuthenticated, user, navigate, location.search]);

  if (isAuthenticated) {
    return null; // Don't render children, let useEffect handle the navigation
  }

  return children;
};

export default AuthRedirect;