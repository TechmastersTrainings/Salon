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
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-[#0B3048] text-[#F2F0E9]">
      <div className="max-w-md w-full bg-[#0e3854] border border-[rgba(242,240,233,0.12)] p-8 sm:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#072132] border border-[#B9F12F]/40 flex items-center justify-center text-white">
              <Scissors size={20} className="text-[#B9F12F]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-[#F2F0E9]">
              MAKEMY<span className="text-[#B9F12F]">HAIR</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-[#F2F0E9]">Create Account</h2>
          <p className="text-xs text-[#F2F0E9]/70 mt-1">Join the premier salon & grooming network</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Role Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 mb-1.5">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2.5 text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-colors ${
                  role === 'customer'
                    ? 'bg-[#B9F12F] text-[#0B3048] border-[#B9F12F] font-bold'
                    : 'bg-[#072132] text-[#F2F0E9]/70 border-[rgba(242,240,233,0.15)] hover:border-[#B9F12F]'
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
                    ? 'bg-[#B9F12F] text-[#0B3048] border-[#B9F12F] font-bold'
                    : 'bg-[#072132] text-[#F2F0E9]/70 border-[rgba(242,240,233,0.15)] hover:border-[#B9F12F]'
                }`}
              >
                <Store size={14} />
                <span>Salon Owner</span>
              </button>
            </div>
          </div>

          {/* Email */}
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
              className="w-full px-4 py-2.5 bg-[#072132] border border-[rgba(242,240,233,0.15)] text-xs font-semibold text-[#F2F0E9] placeholder:text-[#F2F0E9]/40 focus:outline-none focus:border-[#B9F12F]"
              placeholder="you@domain.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400 font-semibold">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 mb-1">
              Telephone
            </label>
            <input
              type="tel"
              {...register('phone', { required: 'Phone number is required' })}
              className="w-full px-4 py-2.5 bg-[#072132] border border-[rgba(242,240,233,0.15)] text-xs font-semibold text-[#F2F0E9] placeholder:text-[#F2F0E9]/40 focus:outline-none focus:border-[#B9F12F]"
              placeholder="+91 98807 68222"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-400 font-semibold">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 mb-1">
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
              className="w-full px-4 py-2.5 bg-[#072132] border border-[rgba(242,240,233,0.15)] text-xs font-semibold text-[#F2F0E9] placeholder:text-[#F2F0E9]/40 focus:outline-none focus:border-[#B9F12F]"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400 font-semibold">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#F2F0E9]/80 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              className="w-full px-4 py-2.5 bg-[#072132] border border-[rgba(242,240,233,0.15)] text-xs font-semibold text-[#F2F0E9] placeholder:text-[#F2F0E9]/40 focus:outline-none focus:border-[#B9F12F]"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400 font-semibold">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#B9F12F] hover:bg-[#a6db24] text-[#0B3048] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg"
          >
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#F2F0E9]/60">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#B9F12F] hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
