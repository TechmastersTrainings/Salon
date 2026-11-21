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
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-[#0B3048] text-[#F2F0E9]">
      <div className="max-w-md w-full bg-[#0e3854] border border-[rgba(242,240,233,0.12)] p-8 sm:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#072132] border border-[#B9F12F]/40 flex items-center justify-center text-white">
              <Scissors size={20} className="text-[#B9F12F]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-[#F2F0E9]">
              MAKEMY<span className="text-[#B9F12F]">HAIR</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-[#F2F0E9]">Client & Partner Sign In</h2>
          <p className="text-xs text-[#F2F0E9]/70 mt-1">Access your bookings and studio management</p>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 mb-1">
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
              className="w-full px-4 py-3 bg-[#072132] border border-[rgba(242,240,233,0.15)] text-xs font-semibold text-[#F2F0E9] placeholder:text-[#F2F0E9]/40 focus:outline-none focus:border-[#B9F12F]"
              placeholder="name@domain.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400 font-semibold">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80">
                Password
              </label>
            </div>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-3 bg-[#072132] border border-[rgba(242,240,233,0.15)] text-xs font-semibold text-[#F2F0E9] placeholder:text-[#F2F0E9]/40 focus:outline-none focus:border-[#B9F12F]"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400 font-semibold">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#B9F12F] hover:bg-[#a6db24] text-[#0B3048] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Platform Test Credentials */}
        <div className="mt-8 pt-6 border-t border-[rgba(242,240,233,0.12)]">
          <div className="bg-[#072132] border border-[rgba(242,240,233,0.12)] p-3.5 rounded-none mb-4 text-left">
            <p className="text-[10px] font-poppins font-bold uppercase tracking-wider text-[#B9F12F] mb-1">
              Verified Platform Accounts
            </p>
            <div className="text-xs space-y-1 font-sans text-[#F2F0E9]/80">
              <p><span className="font-semibold text-[#F2F0E9]">Merchant:</span> techmastersinnovations@gmail.com</p>
              <p><span className="font-semibold text-[#F2F0E9]">Client:</span> sachin@email.com</p>
              <p><span className="font-semibold text-[#F2F0E9]">Password:</span> Fri10Feb@2023</p>
            </div>
          </div>

          <span className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-[#F2F0E9]/50 block mb-2.5 text-center">
            One-Click Verified Sign-In
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('customer')}
              className="py-2 text-xs font-poppins font-semibold border border-[rgba(242,240,233,0.15)] bg-[#072132] text-[#F2F0E9] hover:bg-[#B9F12F] hover:text-[#0B3048] transition-colors flex items-center justify-center gap-1"
            >
              <UserCheck size={12} />
              <span>Client</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('owner')}
              className="py-2 text-xs font-poppins font-semibold border border-[rgba(242,240,233,0.15)] bg-[#072132] text-[#F2F0E9] hover:bg-[#B9F12F] hover:text-[#0B3048] transition-colors flex items-center justify-center gap-1"
            >
              <Store size={12} />
              <span>Merchant</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-2 text-xs font-poppins font-semibold border border-[rgba(242,240,233,0.15)] bg-[#072132] text-[#F2F0E9] hover:bg-[#B9F12F] hover:text-[#0B3048] transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck size={12} />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#F2F0E9]/60">
          New to MakeMyHair?{' '}
          <Link to="/register" className="font-bold text-[#B9F12F] hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
