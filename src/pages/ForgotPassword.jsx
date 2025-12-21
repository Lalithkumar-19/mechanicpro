import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, ArrowRight, ArrowLeft, Key } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosinstance';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMechanic = searchParams.get('type') === 'mechanic';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();

    if (!formData.phone) {
      toast.error('Please enter your phone number');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post('/auth/forgot-password', {
        phone: formData.phone,
        type: isMechanic ? 'mechanic' : 'user'
      });

      toast.success(data.message);
      setStep(2);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      toast.error('Please enter the OTP');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post('/auth/verify-otp', {
        phone: formData.phone,
        otp: formData.otp,
        type: isMechanic ? 'mechanic' : 'user'
      });

      toast.success(data.message);
      setStep(3);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post('/auth/reset-password', {
        phone: formData.phone,
        otp: formData.otp,
        type: isMechanic ? 'mechanic' : 'user',
        newPassword: formData.newPassword
      });

      toast.success(data.message);
      setTimeout(() => {
        navigate(isMechanic ? '/mechanic-login' : '/login');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(isMechanic ? '/mechanic-login' : '/login');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-md mx-auto">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Reset Password {isMechanic && <span className="text-orange-500">(Mechanic)</span>}
              </h1>
              <p className="text-gray-400 text-md">
                {step === 1 && "Enter your phone number to receive an OTP"}
                {step === 2 && "Enter the OTP sent to your phone"}
                {step === 3 && "Enter your new password"}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === step 
                      ? 'w-12 bg-orange-500' 
                      : s < step 
                      ? 'w-8 bg-orange-400' 
                      : 'w-8 bg-gray-700'
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Phone Number */}
            {step === 1 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRequestOTP}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full cursor-pointer group relative py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </motion.button>
              </motion.form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOTP}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium text-gray-300">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      maxLength="6"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                  </div>
                  <p className="text-sm text-gray-400 text-center">
                    OTP sent to {formData.phone}
                  </p>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full cursor-pointer group relative py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Verify OTP</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </motion.button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleRequestOTP}
                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium text-gray-300">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="••••••••"
                      minLength="6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="••••••••"
                      minLength="6"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full cursor-pointer group relative py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </motion.button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
