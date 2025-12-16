import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Phone, Lock, ArrowRight, User } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../utils/axiosinstance';


const Login = ({ onLoginSuccess }) => {

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    phone: '',
    password: ''
  });
  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');

    if (userInfo) {
      onLoginSuccess();
      setTimeout(() => {
        navigate('/');
      }, 1000)
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.phone || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    

    try {
      setIsLoading(true);
      if (isRegister) {

        const { data } = await axiosInstance.post('/auth/register', {
          fullname: formData.fullname,
          phone: formData.phone,
          password: formData.password
        });

        // Save user info to localStorage
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));

        // Show success message
        toast.success('Register successful!');

        // Redirect to dashboard
        navigate('/');
      } else {

        // Make API call to login
        const { data } = await axiosInstance.post('/auth/login', {
          phone: formData.phone,
          password: formData.password
        });
        console.log(data);
        // Save user info to localStorage
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));

        // Show success message
        toast.success('Login successful!');

        // Redirect to dashboard
        navigate('/');
      }

    } catch (error) {
      // Handle errors
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-coral-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-coral-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-coral-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                {isRegister ? "Register" : "Welcome Back!"}
              </h1>
              <p className="text-gray-400 text-md">
                {isRegister ? "Sign up to create an account" : "Sign in to access your car service dashboard"}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegister && <div className="space-y-2">
                <label htmlFor="fullname" className="text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    required
                    value={formData.fullname}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              }
              {/* Phone Field */}
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
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                    placeholder="••••••••"
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-coral-400 hover:text-coral-300 transition-colors"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full cursor-pointer group relative py-3 px-4 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-coral-500/25 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{isRegister ? "Sign Up" : "Sign In"}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </motion.button>
            </form>

            {/* Sign Up Link */}
            {!isRegister ?
              <div className="text-center mt-6 cursor-pointer" >
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setIsRegister(true) }}
                    className="text-coral-400 cursor-pointer hover:text-coral-300 font-semibold transition-colors"
                  >
                    Sign up now
                  </button>
                </p>
              </div> :
              <div className="text-center mt-6 cursor-pointer">
                <p className="text-gray-400">
                  Already have account?{' '}
                  <button
                    onClick={() => { setIsRegister(false) }}
                    className="text-coral-400 cursor-pointer hover:text-coral-300 font-semibold transition-colors"
                  >
                    Sign In Now
                  </button>
                </p>
              </div>


            }

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;