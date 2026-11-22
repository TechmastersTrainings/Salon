import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Scissors, ArrowRight, UserCheck, Store } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [role, setRole] = useState('customer');

  const password = watch('password');

  const onSubmit = async (data) => {
    const registrationData = {
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirm_password: data.confirmPassword,
      role: role
    };
    
    const result = await registerUser(registrationData);
    if (result.success) {
      toast.success('Registration successful! Welcome to MakeMyHair.');
      navigate('/login');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-ivory text-ink">
      <div className="max-w-md w-full bg-surface border border-line p-8 sm:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-blush border border-rose-300 flex items-center justify-center text-ink">
              <Scissors size={20} className="text-rose-600" />
            </div>
            <span className="font-display text-[1.7rem] tracking-[0.06em] text-ink">
              MAKEMY<span className="text-rose-600">HAIR</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-ink">Create Account</h2>
          <p className="text-xs text-body mt-1">Join the premier salon & grooming network</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Role Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1.5">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2.5 text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-colors ${
                  role === 'customer'
                    ? 'bg-ink text-ivory border-ivory/40 font-bold'
                    : 'bg-blush text-body border-line hover:border-rose-400'
                }`}
              >
                <UserCheck size={14} />
                <span>Client</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`py-2.5 text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-colors ${
                  role === 'owner'
                    ? 'bg-ink text-ivory border-ivory/40 font-bold'
                    : 'bg-blush text-body border-line hover:border-rose-400'
                }`}
              >
                <Store size={14} />
                <span>Salon Owner</span>
              </button>
            </div>
          </div>

          {/* Email */}
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
              className="w-full px-4 py-2.5 bg-white border border-line text-xs font-semibold text-ink placeholder:text-neutral-400 focus:outline-none focus:border-rose-400"
              placeholder="you@domain.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-700 font-semibold">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1">
              Telephone
            </label>
            <input
              type="tel"
              {...register('phone', { required: 'Phone number is required' })}
              className="w-full px-4 py-2.5 bg-white border border-line text-xs font-semibold text-ink placeholder:text-neutral-400 focus:outline-none focus:border-rose-400"
              placeholder="+91 98807 68222"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-700 font-semibold">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1">
              Password
            </label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className="w-full px-4 py-2.5 bg-white border border-line text-xs font-semibold text-ink placeholder:text-neutral-400 focus:outline-none focus:border-rose-400"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-700 font-semibold">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-body mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              className="w-full px-4 py-2.5 bg-white border border-line text-xs font-semibold text-ink placeholder:text-neutral-400 focus:outline-none focus:border-rose-400"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-700 font-semibold">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-ink hover:bg-rose-600 text-ivory text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg"
          >
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-rose-600 hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
