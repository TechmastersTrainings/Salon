import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { XCircle, Scissors, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, user } = useAuthStore();
  
  const [loginError, setLoginError] = useState(null);

  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirect');

  useEffect(() => {
    if (user) {
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'owner') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate, redirectTo]);

  const onSubmit = async (data) => {
    setLoginError(null);
    const result = await login({
      email: data.email,
      password: data.password
    });
    
    if (result.success) {
      toast.success('Welcome back!');
    } else {
      const rawError = result.error;
      let displayError = "Login failed. Please check your credentials.";
      if (typeof rawError === 'string') {
        displayError = rawError;
      } else if (typeof rawError === 'object' && rawError !== null) {
        displayError = rawError.detail || rawError.non_field_errors?.[0] || JSON.stringify(rawError);
      }
      setLoginError(displayError);
    }
  };


  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-[#292966] text-white">
      <div className="max-w-md w-full bg-[#363675] border border-[rgba(163,163,204,0.12)] p-8 sm:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#1e1e4f] border border-[#CCCCFF]/40 flex items-center justify-center text-white">
              <Scissors size={20} className="text-[#CCCCFF]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-white">
              MAKEMY<span className="text-[#CCCCFF]">HAIR</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Client & Partner Sign In</h2>
          <p className="text-xs text-white/70 mt-1">Access your bookings and studio management</p>
        </div>

        {/* Error Notification */}
        {loginError && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-800/60 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-300">Authentication Error</p>
              <p className="text-xs text-red-400 mt-0.5">{loginError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full px-4 py-3 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] text-xs font-semibold text-white placeholder:text-white/40 focus:outline-none focus:border-[#CCCCFF]"
              placeholder="name@domain.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400 font-semibold">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Password
              </label>
            </div>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-3 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] text-xs font-semibold text-white placeholder:text-white/40 focus:outline-none focus:border-[#CCCCFF]"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400 font-semibold">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight size={14} />
          </button>
        </form>



        <div className="mt-6 text-center text-xs text-white/60">
          New to MakeMyHair?{' '}
          <Link to="/register" className="font-bold text-[#CCCCFF] hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
