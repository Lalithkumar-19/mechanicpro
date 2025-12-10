import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Car, Calendar, Clock, CheckCircle, ArrowRight,
  ArrowLeft, Search, Filter, DollarSign, MessageCircle,
  Settings, Palette, Sparkles, Cog, FileCheck, Shield,
  RotateCcw, FileText, Wrench,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import axiosInstance from '../utils/axiosinstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Icon mapping for service categories
const iconMap = {
  'settings': <Settings className="w-6 h-6" />,
  'palette': <Palette className="w-6 h-6" />,
  'sparkles': <Sparkles className="w-6 h-6" />,
  'wrench': <Wrench className="w-6 h-6" />,
  'cog': <Cog className="w-6 h-6" />,
  'file-check': <FileCheck className="w-6 h-6" />,
  'shield': <Shield className="w-6 h-6" />,
  'rotate-ccw': <RotateCcw className="w-6 h-6" />,
  'file-text': <FileText className="w-6 h-6" />
};

const BookingPage = () => {
  const { id: mechanicId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [odometerReading, setOdometerReading] = useState('');
  const [newCar, setNewCar] = useState({
    name: '',
    model: '',
    year: '',
    licensePlate: ''
  });
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [userCars, setUserCars] = useState([]);
  const [mechanic, setMechanic] = useState(null);
  const [error, setError] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      navigate('/login');
    }
  }, [])

  // Time slots from 9 AM to 5 PM
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  // Fetch mechanic services and user data

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/mechanic/${mechanicId}`);

        setMechanic(response.data.mechanic);
        setServiceCategories(response.data.serviceCategories);
        setUserCars(response.data.userCars);

        // Auto-select first car if available
        if (response.data.userCars.length > 0) {
          setSelectedCar(response.data.userCars[0]);
        }

      } catch (error) {
        console.error('Error fetching booking data:', error);
        setError('Failed to load booking data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (mechanicId) {
      fetchBookingData();
    }
  }, [mechanicId]);

  const handleAddCar = async () => {
    if (newCar.name && newCar.model && newCar.year) {
      try {
        const response = await axiosInstance.post('/user/cars', {
          name: newCar.name,
          model: newCar.model,
          year: newCar.year,
          licensePlate: newCar.licensePlate
        });

        const car = response.data;
        setUserCars(prev => [...prev, car]);
        setSelectedCar(car);
        setNewCar({
          name: '',
          model: '',
          year: '',
          licensePlate: ''
        });
        setShowAddCarForm(false);
      } catch (error) {
        console.error('Error adding car:', error);
        setError('Failed to add car. Please try again.');
      }
    }
  };

  const handleCancelAddCar = () => {
    setNewCar({
      name: '',
      model: '',
      year: '',
      licensePlate: ''
    });
    setShowAddCarForm(false);
  };

  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

  const handleServiceSelect = (service) => {
    const isSelected = selectedServices.find(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookService = async () => {
    try {
      setSubmitting(true);

      // Debug: Check what values you're getting
      console.log('selectedDate:', selectedDate);
      console.log('selectedTime:', selectedTime);

      // Create a robust date parser
      const createValidDate = (dateStr, timeStr) => {
        try {
          // Clean the time string
          const cleanTime = timeStr.trim().toUpperCase();

          // Extract time and period
          const timeMatch = cleanTime.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);

          if (!timeMatch) {
            throw new Error('Invalid time format');
          }

          let [, hours, minutes = '00', period = 'AM'] = timeMatch;
          let hourInt = parseInt(hours, 10);

          // Handle 12-hour format conversion
          if (period === 'PM' && hourInt < 12) {
            hourInt += 12;
          } else if (period === 'AM' && hourInt === 12) {
            hourInt = 0;
          }

          // Format the time components
          const formattedTime = `${hourInt.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
          const dateTimeString = `${dateStr}T${formattedTime}`;

          const finalDate = new Date(dateTimeString);

          if (isNaN(finalDate.getTime())) {
            throw new Error('Invalid date created');
          }

          return finalDate.toISOString();
        } catch (error) {
          console.error('Date parsing error:', error);
          // Fallback: Use current date + 1 hour
          const fallbackDate = new Date();
          fallbackDate.setHours(fallbackDate.getHours() + 1);
          return fallbackDate.toISOString();
        }
      };

      const bookingData = {
        mechanicId,
        carId: selectedCar.id,
        services: selectedServices,
        instructions,
        odometerReading: parseInt(odometerReading),
        dateTime: createValidDate(selectedDate, selectedTime),
        totalPrice
      };

      console.log('Final booking data:', bookingData);

      const response = await axiosInstance.post('/user/booking-create', bookingData);
      if (response.status == 201) {
        toast.success('Service booked successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      }

    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking. Please try again.');
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = serviceCategories
    .filter(category => filterCategory === 'all' || category.id === filterCategory)
    .map(category => ({
      ...category,
      services: category.services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    }))
    .filter(category => category.services.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Error</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Book Your Car Service</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Professional car care with transparent pricing and convenient scheduling
            </p>
            {mechanic && (
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-orange-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">{mechanic.name}</h3>
                  <p className="text-gray-400 text-sm">{mechanic.address}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-xs">Verified</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400 text-xs">{mechanic.totalBookings} bookings</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${currentStep >= step
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'border-gray-600 text-gray-400'
                  }`}>
                  {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-24 h-1 mx-4 transition-all duration-300 ${currentStep > step ? 'bg-orange-500' : 'bg-gray-600'
                    }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <span className={`font-medium ${currentStep >= 1 ? 'text-orange-400' : 'text-gray-500'}`}>Select Car</span>
            <span className={`font-medium ${currentStep >= 2 ? 'text-orange-400' : 'text-gray-500'}`}>Choose Service</span>
            <span className={`font-medium ${currentStep >= 3 ? 'text-orange-400' : 'text-gray-500'}`}>Add Instructions</span>
            <span className={`font-medium ${currentStep >= 4 ? 'text-orange-400' : 'text-gray-500'}`}>Schedule</span>
            <span className={`font-medium ${currentStep >= 5 ? 'text-orange-400' : 'text-gray-500'}`}>Confirm</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 lg:p-8">
                {/* Step 1: Select Car */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Select Your Car</h2>
                      <p className="text-gray-400">Choose from your saved cars or add a new one</p>
                    </div>

                    {showAddCarForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700"
                      >
                        <h3 className="text-lg font-semibold text-white mb-4">Add New Car</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Car Name *
                            </label>
                            <input
                              type="text"
                              value={newCar.name}
                              onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                              placeholder="e.g., My Daily Driver"
                              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Car Model *
                            </label>
                            <input
                              type="text"
                              value={newCar.model}
                              onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                              placeholder="e.g., Honda City"
                              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Manufacture Year *
                            </label>
                            <input
                              type="number"
                              value={newCar.year}
                              onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                              placeholder="e.g., 2022"
                              min="1990"
                              max={new Date().getFullYear()}
                              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              License Plate
                            </label>
                            <input
                              type="text"
                              value={newCar.licensePlate}
                              onChange={(e) => setNewCar({ ...newCar, licensePlate: e.target.value })}
                              placeholder="e.g., MH01AB1234"
                              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                          <button
                            onClick={handleAddCar}
                            disabled={!newCar.name || !newCar.model || !newCar.year}
                            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-300 disabled:cursor-not-allowed"
                          >
                            <Save className="w-4 h-4" />
                            <span>Add Car</span>
                          </button>
                          <button
                            onClick={handleCancelAddCar}
                            className="flex items-center space-x-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-6 py-3 rounded-lg transition-colors duration-300"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userCars.map((car) => (
                        <div
                          key={car.id}
                          onClick={() => setSelectedCar(car)}
                          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedCar?.id === car.id
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-gray-700 hover:border-orange-500/40'
                            }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                              <Car className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{car.name}</h3>
                              <p className="text-gray-400">{car.model} • {car.year}</p>
                              {car.licensePlate && (
                                <p className="text-gray-500 text-sm">{car.licensePlate}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add New Car Option */}
                      <div
                        onClick={() => setShowAddCarForm(true)}
                        className="p-6 rounded-2xl border-2 border-dashed border-gray-600 hover:border-orange-500/40 cursor-pointer transition-all duration-300"
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Car className="w-6 h-6 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">Add New Car</h3>
                          <p className="text-gray-400 text-sm">Register a new vehicle</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Choose Services */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Choose Services</h2>
                      <p className="text-gray-400">Select the services your car needs</p>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="relative flex-1 lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search services..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">All Categories</option>
                        {serviceCategories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Services Grid */}
                    <div className="space-y-4">
                      {filteredServices.map((category) => (
                        <div key={category.id} className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                              {iconMap[category.icon] || <Wrench className="w-6 h-6" />}
                            </div>
                            <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            {category.services.map((service) => (
                              <div
                                key={service.id}
                                onClick={() => handleServiceSelect(service)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedServices.find(s => s.id === service.id)
                                  ? 'border-orange-500 bg-orange-500/10'
                                  : 'border-gray-700 hover:border-orange-500/40'
                                  }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-white mb-1">
                                      {service.name}
                                    </h4>
                                    <p className="text-gray-400 text-sm mb-2">
                                      {service.description}
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm">
                                      <span className="text-orange-400 font-semibold">
                                        ₹{service.price.toLocaleString()}
                                      </span>
                                      <span className="text-gray-500">
                                        {service.duration}
                                      </span>
                                    </div>
                                    <p className="text-amber-400 text-xs mt-2">
                                      * This is an estimated price only, not accurate. Final price may vary.
                                    </p>
                                  </div>
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedServices.find(s => s.id === service.id)
                                    ? 'bg-orange-500 border-orange-500'
                                    : 'border-gray-500'
                                    }`}>
                                    {selectedServices.find(s => s.id === service.id) && (
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Special Instructions */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Special Instructions & Details</h2>
                      <p className="text-gray-400">Add any specific notes and vehicle details</p>
                    </div>

                    <div className="space-y-6">
                      {/* Special Instructions */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="E.g., Please check the AC cooling, there's a strange noise from the front left wheel, or any other specific concerns..."
                          rows={6}
                          className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                        <p className="text-gray-400 text-sm">
                          Your instructions will help the mechanic understand your concerns better and provide more accurate service.
                        </p>
                      </div>

                      {/* Odometer Reading */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Odometer Reading (km) *
                        </label>
                        <input
                          type="number"
                          value={odometerReading}
                          onChange={(e) => setOdometerReading(e.target.value)}
                          placeholder="Enter current odometer reading"
                          min="0"
                          className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <p className="text-gray-400 text-sm">
                          Please provide your current odometer reading for accurate service tracking and maintenance records.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Schedule Service */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Schedule Your Service</h2>
                      <p className="text-gray-400">Choose a convenient date and time for your service</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Date Selection */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-orange-400" />
                          <span>Select Date</span>
                        </h3>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      {/* Time Selection */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-orange-400" />
                          <span>Select Time Slot</span>
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-3 rounded-lg border transition-all duration-300 ${selectedTime === time
                                ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                                : 'border-gray-700 text-gray-400 hover:border-orange-500/40 hover:text-white'
                                }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Service Center Info */}
                    {mechanic && (
                      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Service Center</h3>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                            <Wrench className="w-6 h-6 text-orange-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{mechanic.name}</h4>
                            <p className="text-gray-400 text-sm">{mechanic.address}</p>
                            <p className="text-gray-500 text-sm">Contact: {mechanic.phone}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 5: Booking Summary */}
                {currentStep === 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Booking Summary</h2>
                      <p className="text-gray-400">Review your service booking details</p>
                    </div>

                    <div className="space-y-6">
                      {/* Car Details */}
                      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Vehicle Details</h3>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                            <Car className="w-6 h-6 text-orange-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{selectedCar?.name}</h4>
                            <p className="text-gray-400">{selectedCar?.model} • {selectedCar?.year}</p>
                            {selectedCar?.licensePlate && (
                              <p className="text-gray-500 text-sm">{selectedCar.licensePlate}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Selected Services</h3>
                        <div className="space-y-3">
                          {selectedServices.map((service) => (
                            <div key={service.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                              <div>
                                <h4 className="text-white font-medium">{service.name}</h4>
                                <p className="text-gray-400 text-sm">{service.duration}</p>
                                <p className="text-amber-400 text-xs">* Estimated price</p>
                              </div>
                              <span className="text-orange-400 font-semibold">
                                ₹{service.price.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Schedule Details */}
                      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Schedule & Location</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Date & Time:</span>
                            <span className="text-white font-medium">
                              {selectedDate} at {selectedTime}
                            </span>
                          </div>
                          {odometerReading && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Odometer Reading:</span>
                              <span className="text-white font-medium">{parseInt(odometerReading).toLocaleString()} km</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-400">Service Center:</span>
                            <span className="text-white font-medium">{mechanic?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Address:</span>
                            <span className="text-white text-sm text-right">{mechanic?.address}</span>
                          </div>
                          {instructions && (
                            <div>
                              <span className="text-gray-400 block mb-1">Special Instructions:</span>
                              <p className="text-white text-sm bg-gray-700/50 rounded-lg p-3">
                                {instructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Total Cost */}
                      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-400">Total Amount:</span>
                          <span className="text-orange-400 font-bold text-xl">
                            ₹{totalPrice.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-amber-400 text-sm mt-2">
                          * This is an estimated total. Final amount may vary based on actual service requirements.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t border-gray-800">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-orange-500 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  {currentStep < 5 ? (
                    <button
                      onClick={handleNext}
                      disabled={
                        (currentStep === 1 && !selectedCar) ||
                        (currentStep === 2 && selectedServices.length === 0) ||
                        (currentStep === 3 && !odometerReading) ||
                        (currentStep === 4 && (!selectedDate || !selectedTime))
                      }
                      className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleBookService}
                      disabled={submitting}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>{submitting ? 'Booking...' : 'Confirm Booking'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-white mb-6">Booking Summary</h3>

                <div className="space-y-4">
                  {/* Selected Car */}
                  {selectedCar && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                      <Car className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-white font-medium text-sm">{selectedCar.name}</p>
                        <p className="text-gray-400 text-xs">{selectedCar.model}</p>
                      </div>
                    </div>
                  )}

                  {/* Selected Services */}
                  {selectedServices.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Services ({selectedServices.length})</p>
                      <div className="space-y-2">
                        {selectedServices.slice(0, 3).map((service) => (
                          <div key={service.id} className="flex justify-between items-center text-sm">
                            <span className="text-white truncate">{service.name}</span>
                            <span className="text-orange-400 font-medium">₹{service.price.toLocaleString()}</span>
                          </div>
                        ))}
                        {selectedServices.length > 3 && (
                          <p className="text-gray-400 text-xs">+{selectedServices.length - 3} more services</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Schedule */}
                  {(selectedDate || selectedTime) && (
                    <div className="p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="text-white text-sm font-medium">Schedule</span>
                      </div>
                      {selectedDate && (
                        <p className="text-gray-400 text-xs">Date: {selectedDate}</p>
                      )}
                      {selectedTime && (
                        <p className="text-gray-400 text-xs">Time: {selectedTime}</p>
                      )}
                    </div>
                  )}

                  {/* Service Center */}
                  {mechanic && (
                    <div className="p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wrench className="w-4 h-4 text-orange-400" />
                        <span className="text-white text-sm font-medium">Service Center</span>
                      </div>
                      <p className="text-gray-400 text-xs">{mechanic.name}</p>
                    </div>
                  )}

                  {/* Total */}
                  {selectedServices.length > 0 && (
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Total</span>
                        <span className="text-orange-400 font-bold text-lg">
                          ₹{totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-amber-400 text-xs mt-1">
                        * Estimated amount
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;