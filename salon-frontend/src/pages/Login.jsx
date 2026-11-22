import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { XCircle, Scissors, ArrowRight, ShieldCheck, UserCheck, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
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

  const handleQuickFill = async (role) => {
    let email = '';
    const password = 'Fri10Feb@2023';

    if (role === 'customer') {
      email = 'sachin@email.com';
    } else if (role === 'owner') {
      email = 'techmastersinnovations@gmail.com';
    } else if (role === 'admin') {
      email = 'admin@makemyhair.com';
    }

    setValue('email', email);
    setValue('password', password);

    setLoginError(null);
    const result = await login({ email, password });
    if (result.success) {
      toast.success(`Signed in as ${role.toUpperCase()} via secure API`);
    } else {
      setLoginError(result.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-ivory text-ink">
      <div className="max-w-md w-full bg-surface border border-line p-8 sm:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-blush border border-rose-300 flex items-center justify-center text-ink">
              <Scissors size={20} className="text-rose-600" />
            </div>
            <span className="font-display text-[1.7rem] tracking-[0.06em] text-ink">
              MAKEMY<span className="text-rose-600">HAIR</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-ink">Client & Partner Sign In</h2>
          <p className="text-xs text-body mt-1">Access your bookings and studio management</p>
        </div>

        {/* Error Notification */}
        {loginError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-800/60 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-700">Authentication Error</p>
              <p className="text-xs text-red-700 mt-0.5">{loginError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1">
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
              className="w-full px-4 py-3 bg-white border border-line text-xs font-semibold text-ink placeholder:text-neutral-400 focus:outline-none focus:border-rose-400"
              placeholder="name@domain.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-700 font-semibold">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-body">
                Password
              </label>
            </div>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-3 bg-white border border-line text-xs font-semibold text-ink placeholder:text-neutral-400 focus:outline-none focus:border-rose-400"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-700 font-semibold">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-ink hover:bg-rose-600 text-ivory text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Platform Test Credentials */}
        <div className="mt-8 pt-6 border-t border-line">
          <div className="bg-blush border border-line p-3.5 rounded-none mb-4 text-left">
            <p className="text-[10px] font-poppins font-bold uppercase tracking-wider text-rose-600 mb-1">
              Verified Platform Accounts
            </p>
            <div className="text-xs space-y-1 font-sans text-body">
              <p><span className="font-semibold text-ink">Merchant:</span> techmastersinnovations@gmail.com</p>
              <p><span className="font-semibold text-ink">Client:</span> sachin@email.com</p>
              <p><span className="font-semibold text-ink">Password:</span> Fri10Feb@2023</p>
            </div>
          </div>

          <span className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-muted block mb-2.5 text-center">
            One-Click Verified Sign-In
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('customer')}
              className="py-2 text-xs font-poppins font-semibold border border-line bg-blush text-ink hover:bg-ink hover:text-ivory transition-colors flex items-center justify-center gap-1"
            >
              <UserCheck size={12} />
              <span>Client</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('owner')}
              className="py-2 text-xs font-poppins font-semibold border border-line bg-blush text-ink hover:bg-ink hover:text-ivory transition-colors flex items-center justify-center gap-1"
            >
              <Store size={12} />
              <span>Merchant</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-2 text-xs font-poppins font-semibold border border-line bg-blush text-ink hover:bg-ink hover:text-ivory transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck size={12} />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted">
          New to MakeMyHair?{' '}
          <Link to="/register" className="font-bold text-rose-600 hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
