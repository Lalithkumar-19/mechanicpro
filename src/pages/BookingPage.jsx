import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car, Calendar, Clock, CheckCircle, ArrowRight,
  ArrowLeft, Search, Filter, DollarSign, MessageCircle,
  Settings, Palette, Sparkles, Cog, FileCheck, Shield,
  RotateCcw, FileText, Wrench,
  Save,
  X
} from 'lucide-react';

// Service data with categories and prices (same as before)
const serviceCategories = [
  {
    id: 'ac-services',
    name: 'AC Services',
    icon: <Settings className="w-6 h-6" />,
    services: [
      { id: 'ac-cleaning', name: 'AC Cleaning & Recharging', description: 'Air conditioning system cleaning and refrigerant recharge', price: 2499, duration: '2-3 hours' },
      { id: 'ac-parts', name: 'AC Parts Replacement', description: 'Air conditioning component replacement and repair', price: 3999, duration: '3-4 hours' }
    ]
  },
  {
    id: 'denting-painting',
    name: 'Denting & Painting',
    icon: <Palette className="w-6 h-6" />,
    services: [
      { id: 'boot-painting', name: 'Boot Painting', description: 'Trunk/boot painting and refinishing', price: 5999, duration: '1-2 days' },
      { id: 'front-bumper', name: 'Front Bumper Denting & Painting', description: 'Front bumper dent repair and painting', price: 4499, duration: '1 day' },
      { id: 'full-body', name: 'Full Body Painting', description: 'Complete vehicle body painting', price: 24999, duration: '3-4 days' },
      { id: 'damage-painting', name: 'Damage Paintings', description: 'Body damage repair and painting', price: 7999, duration: '2-3 days' },
      { id: 'bonnet-painting', name: 'Bonnet Painting', description: 'Hood painting and refinishing', price: 3999, duration: '1 day' },
      { id: 'alloys-painting', name: 'Alloys Painting', description: 'Alloy wheel painting and refinishing', price: 6999, duration: '1-2 days' },
      { id: 'rear-bumper', name: 'Rear Bumper Denting & Painting', description: 'Rear bumper dent repair and painting', price: 4499, duration: '1 day' }
    ]
  },
  {
    id: 'detailing',
    name: 'Detailing & Accessories',
    icon: <Sparkles className="w-6 h-6" />,
    services: [
      { id: 'full-body-wash', name: 'Full Body Wash + Deep Interior Cleaning', description: 'Complete exterior wash and interior detailing', price: 2999, duration: '3-4 hours' },
      { id: 'ppf', name: 'PPF Installation / Replacement', description: 'Paint protection film installation and replacement', price: 19999, duration: '1-2 days' },
      { id: 'ceramic', name: 'Ceramic Coatings', description: 'Ceramic coating application for paint protection', price: 14999, duration: '1 day' },
      { id: 'rubbing', name: 'Rubbing / Polishing', description: 'Paint rubbing and polishing services', price: 4999, duration: '4-5 hours' }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical Repairs',
    icon: <Wrench className="w-6 h-6" />,
    services: [
      { id: 'battery', name: 'Battery Charging / Replacement', description: 'Battery testing, charging, and replacement services', price: 1999, duration: '1-2 hours' },
      { id: 'dynamo', name: 'Dynamo Repairs', description: 'Alternator and dynamo repair services', price: 3499, duration: '3-4 hours' },
      { id: 'wiper', name: 'Wiper Motors Repairs', description: 'Windshield wiper motor repair and replacement', price: 2499, duration: '2-3 hours' },
      { id: 'headlights', name: 'Headlights Repair / Replacement', description: 'Headlight assembly repair and replacement', price: 5999, duration: '3-4 hours' },
      { id: 'electrical-fault', name: 'Electrical & Electronic Fault Detection', description: 'Comprehensive electrical system diagnostics', price: 1499, duration: '1-2 hours' }
    ]
  },
  {
    id: 'engine',
    name: 'Engine Repairs',
    icon: <Cog className="w-6 h-6" />,
    services: [
      { id: 'carbon-cleaning', name: 'Carbon Cleaning (Manual)', description: 'Manual carbon deposit cleaning from engine components', price: 7999, duration: '4-5 hours' },
      { id: 'turbo', name: 'Turbo Repairs', description: 'Turbocharger repair and replacement services', price: 12999, duration: '5-6 hours' },
      { id: 'engine-bore', name: 'Engine Full Bore', description: 'Complete engine overhaul and bore reconstruction', price: 29999, duration: '2-3 days' },
      { id: 'head-work', name: 'Head Work', description: 'Cylinder head repairs and reconditioning', price: 15999, duration: '1-2 days' },
      { id: 'clutch', name: 'Clutch Service', description: 'Clutch replacement and adjustment services', price: 8999, duration: '4-5 hours' },
      { id: 'diesel-works', name: 'Diesel Works (Injectors / Fuel Pumps)', description: 'Diesel injection system repair and fuel pump services', price: 11999, duration: '5-6 hours' },
      { id: 'def-cleaning', name: 'DEF Urea Tank Cleaning', description: 'Diesel exhaust fluid system cleaning and maintenance', price: 4999, duration: '2-3 hours' },
      { id: 'engine-scanning', name: 'Engine Scanning (Check Light)', description: 'Diagnostic scanning for engine warning lights', price: 1999, duration: '1 hour' }
    ]
  },
  {
    id: 'general',
    name: 'General Service',
    icon: <Wrench className="w-6 h-6" />,
    services: [
      { id: 'luxury', name: 'Luxury Package', description: 'Premium maintenance with detailed care and luxury vehicle specialization', price: 9999, duration: '5-6 hours' },
      { id: 'premium', name: 'Premium Package', description: 'Comprehensive maintenance package with additional inspections and services', price: 6999, duration: '3-4 hours' },
      { id: 'standard', name: 'Standard Package', description: 'Basic maintenance package including oil change, filter replacement, and basic checks', price: 3999, duration: '2-3 hours' }
    ]
  },
  {
    id: 'inspection',
    name: 'Inspection',
    icon: <FileCheck className="w-6 h-6" />,
    services: [
      { id: 'engine-inspection', name: 'Engine Inspection', description: 'Detailed engine condition inspection', price: 1499, duration: '1-2 hours' },
      { id: 'full-inspection', name: 'Full Vehicle Inspection', description: 'Complete vehicle inspection with recommendations', price: 2999, duration: '2-3 hours' },
      { id: 'pre-owned', name: 'Pre-owned Car Inspection', description: 'Used car inspection and evaluation', price: 1999, duration: '1-2 hours' },
      { id: 'road-trip', name: 'Road Trip Inspection', description: 'Pre-travel vehicle inspection and preparation', price: 2499, duration: '1-2 hours' },
      { id: 'electrical-inspection', name: 'Electrical Inspection', description: 'Comprehensive electrical system inspection', price: 1799, duration: '1-2 hours' }
    ]
  },
  {
    id: 'insurance',
    name: 'Insurance Services',
    icon: <Shield className="w-6 h-6" />,
    services: [
      { id: 'insurance', name: 'Insurance Services', description: 'Vehicle insurance processing and assistance', price: 999, duration: '1-2 hours' }
    ]
  },
  {
    id: 'pollution',
    name: 'Pollution Certificate',
    icon: <RotateCcw className="w-6 h-6" />,
    services: [
      { id: 'pollution-cert', name: 'Pollution Certificate Issuance', description: 'Pollution under control certificate issuance', price: 499, duration: '30 mins' }
    ]
  },
  {
    id: 'rto',
    name: 'RTO Works',
    icon: <FileText className="w-6 h-6" />,
    services: [
      { id: 'rto-works', name: 'RTO Works', description: 'Regional Transport Office documentation and services', price: 1999, duration: '2-3 hours' }
    ]
  },
  {
    id: 'tyres',
    name: 'Tyres & Wheel Services',
    icon: <Settings className="w-6 h-6" />,
    services: [
      { id: 'brake-pads', name: 'Disc / Brake Pads Replacement', description: 'Brake disc and pad replacement and cleaning', price: 4499, duration: '2-3 hours' },
      { id: 'tyres-replacement', name: 'Tyres Replacement', description: 'Tire replacement and installation', price: 7999, duration: '1-2 hours' },
      { id: 'wheel-alignment', name: 'Wheel Alignment', description: 'Wheel alignment and geometry correction', price: 1999, duration: '1 hour' },
      { id: 'wheel-balancing', name: 'Wheel Balancing', description: 'Wheel balancing for smooth driving', price: 1499, duration: '1 hour' }
    ]
  }
];

// Sample user cars
const userCars = [
  { id: 1, name: 'My Daily Driver', model: 'Honda City', year: '2022', licensePlate: 'MH01AB1234' },
  { id: 2, name: 'Weekend Car', model: 'Hyundai Creta', year: '2021', licensePlate: 'MH01CD5678' }
];

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newCar, setNewCar] = useState({
    name: '',
    model: '',
    year: '',
    licensePlate: ''
  });
  const [showAddCarForm, setShowAddCarForm] = useState(true);

  const handleAddCar = () => {
    if (newCar.name && newCar.model && newCar.year) {
      const car = {
        id: Date.now(),
        name: newCar.name,
        model: newCar.model,
        year: newCar.year,
        licensePlate: newCar.licensePlate || ''
      };
      setCars([...cars, car]);
      setSelectedCar(car);
      setNewCar({
        name: '',
        model: '',
        year: '',
        licensePlate: ''
      });
      setShowAddCarForm(false);
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

  // Time slots from 9 AM to 5 PM
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

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

  const handleBookService = () => {
    // Handle booking logic here
    console.log({
      car: selectedCar,
      services: selectedServices,
      instructions,
      date: selectedDate,
      time: selectedTime,
      totalPrice
    });
    alert('Service booked successfully!');
  };

  const filteredServices = serviceCategories
    .filter(category => filterCategory === 'all' || category.id === filterCategory)
    .flatMap(category => category.services)
    .filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        className="p-6 rounded-2xl border-2 border-dashed border-gray-600 hover:border-orange-500/40 cursor-pointer transition-all duration-300">
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
                        className="px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">All Categories</option>
                        {serviceCategories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Services Grid */}
                    <div className="space-y-4">
                      {serviceCategories.map((category) => (
                        <div key={category.id} className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                              {category.icon}
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
                      <h2 className="text-2xl font-bold text-white mb-2">Special Instructions</h2>
                      <p className="text-gray-400">Add any specific notes for the mechanic</p>
                    </div>

                    <div className="space-y-4">
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
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Service Center</h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                          <Wrench className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">AutoCare Pro Center</h4>
                          <p className="text-gray-400 text-sm">Shop No. 12, Linking Road, Bandra West, Mumbai</p>
                          <p className="text-gray-500 text-sm">Selected from Find Mechanic page</p>
                        </div>
                      </div>
                    </div>
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
                          <div className="flex justify-between">
                            <span className="text-gray-400">Service Center:</span>
                            <span className="text-white font-medium">AutoCare Pro Center</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Address:</span>
                            <span className="text-white text-sm text-right">Shop No. 12, Linking Road, Bandra West, Mumbai</span>
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
                        <p className="text-gray-400 text-sm mt-2">
                          Includes all service charges and taxes
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
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all duration-300"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Booking</span>
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
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wrench className="w-4 h-4 text-orange-400" />
                      <span className="text-white text-sm font-medium">Service Center</span>
                    </div>
                    <p className="text-gray-400 text-xs">AutoCare Pro Center</p>
                  </div>

                  {/* Total */}
                  {selectedServices.length > 0 && (
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Total</span>
                        <span className="text-orange-400 font-bold text-lg">
                          ₹{totalPrice.toLocaleString()}
                        </span>
                      </div>
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