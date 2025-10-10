import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Settings, Car, Calendar, Bell, Edit3, Save, Trash2, 
  Plus, Phone, Mail, MapPin, Clock, CheckCircle, XCircle, 
  Clock4, Filter, Search, Star, Wrench
} from 'lucide-react';

// Car Book CRUD Component
const CarBook = ({ cars, onAddCar, onEditCar, onDeleteCar }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: '',
    licensePlate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCar) {
      onEditCar(editingCar.id, formData);
      setEditingCar(null);
    } else {
      onAddCar(formData);
    }
    setFormData({ name: '', model: '', year: '', licensePlate: '' });
    setIsAdding(false);
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      model: car.model,
      year: car.year,
      licensePlate: car.licensePlate || ''
    });
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingCar(null);
    setFormData({ name: '', model: '', year: '', licensePlate: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">My Cars</h3>
          <p className="text-gray-400">Manage your vehicle details</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors duration-300"
        >
          <Plus className="w-4 h-4" />
          <span>Add Car</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingCar ? 'Edit Car' : 'Add New Car'}
          </h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Car Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., My Daily Driver"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Car Model
              </label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., Honda City"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Manufacture Year
              </label>
              <input
                type="number"
                required
                min="1990"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g., 2022"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                License Plate (Optional)
              </label>
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                placeholder="e.g., MH01AB1234"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                <Save className="w-4 h-4" />
                <span>{editingCar ? 'Update Car' : 'Add Car'}</span>
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center space-x-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-6 py-3 rounded-lg transition-colors duration-300"
              >
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/40 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{car.name}</h4>
                  <p className="text-gray-400 text-sm">{car.model}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(car)}
                  className="p-2 text-gray-400 hover:text-orange-400 transition-colors duration-300"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteCar(car.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Year:</span>
                <span className="text-white font-medium">{car.year}</span>
              </div>
              {car.licensePlate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">License:</span>
                  <span className="text-white font-medium">{car.licensePlate}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {cars.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">No cars added yet</h4>
          <p className="text-gray-400">Add your first car to get started</p>
        </div>
      )}
    </div>
  );
};

// Bookings Management Component
const BookingsManagement = ({ bookings }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'inprogress', 'completed'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.mechanicName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'inprogress') return matchesSearch && booking.status !== 'completed';
    if (filter === 'completed') return matchesSearch && booking.status === 'completed';
    
    return matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock4 className="w-4 h-4 text-amber-400" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress':
        return <Wrench className="w-4 h-4 text-blue-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'denied':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock4 className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'accepted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'denied':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-white">My Bookings</h3>
        <p className="text-gray-400">Track and manage your service appointments</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex space-x-2">
          {['all', 'inprogress', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                filter === filterType
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {filterType === 'all' && 'All Bookings'}
              {filterType === 'inprogress' && 'In Progress'}
              {filterType === 'completed' && 'Completed'}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full lg:w-64"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/40 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Booking Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(booking.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Booking ID: <span className="text-white font-mono">{booking.id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Car</p>
                    <p className="text-white font-medium">{booking.carName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Service</p>
                    <p className="text-white font-medium">{booking.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Scheduled</p>
                    <p className="text-white font-medium">{booking.scheduledDate}</p>
                    <p className="text-gray-400 text-sm">{booking.scheduledTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Mechanic</p>
                    <p className="text-white font-medium">{booking.mechanicName}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-gray-400 text-sm">{booking.mechanicRating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors duration-300 text-sm font-medium">
                  View Details
                </button>
                {booking.status === 'pending' && (
                  <button className="px-4 py-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-xl transition-colors duration-300 text-sm font-medium">
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Booked on:</span>
                <span className="text-white">{booking.bookedDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Mechanic:</span>
                <span className="text-white">{booking.mechanicPhone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Location:</span>
                <span className="text-white">{booking.location}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">No bookings found</h4>
          <p className="text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : `No ${filter !== 'all' ? filter : ''} bookings found`}
          </p>
        </div>
      )}
    </div>
  );
};

// Main Profile Component
const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    profilePic: null
  });

  const [cars, setCars] = useState([
    {
      id: 1,
      name: 'My Daily Driver',
      model: 'Honda City',
      year: '2022',
      licensePlate: 'MH01AB1234'
    },
    {
      id: 2,
      name: 'Weekend Car',
      model: 'Hyundai Creta',
      year: '2021',
      licensePlate: 'MH01CD5678'
    }
  ]);

  const [bookings, setBookings] = useState([
    {
      id: 'BK001',
      carName: 'Honda City',
      serviceType: 'General Service',
      status: 'accepted',
      bookedDate: '15 Dec 2023',
      scheduledDate: '20 Dec 2023',
      scheduledTime: '10:00 AM',
      mechanicName: 'AutoCare Pro',
      mechanicRating: 4.8,
      mechanicPhone: '+91 98765 43210',
      location: 'Bandra West, Mumbai'
    },
    {
      id: 'BK002',
      carName: 'Hyundai Creta',
      serviceType: 'AC Service',
      status: 'in-progress',
      bookedDate: '18 Dec 2023',
      scheduledDate: '22 Dec 2023',
      scheduledTime: '2:00 PM',
      mechanicName: 'Precision Auto',
      mechanicRating: 4.6,
      mechanicPhone: '+91 98765 43211',
      location: 'Andheri East, Mumbai'
    },
    {
      id: 'BK003',
      carName: 'Honda City',
      serviceType: 'Denting & Painting',
      status: 'completed',
      bookedDate: '10 Dec 2023',
      scheduledDate: '15 Dec 2023',
      scheduledTime: '11:00 AM',
      mechanicName: 'Elite Car Service',
      mechanicRating: 4.9,
      mechanicPhone: '+91 98765 43212',
      location: 'Powai, Mumbai'
    }
  ]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleAddCar = (carData) => {
    const newCar = {
      id: Date.now(),
      ...carData
    };
    setCars([...cars, newCar]);
  };

  const handleEditCar = (carId, carData) => {
    setCars(cars.map(car => car.id === carId ? { ...car, ...carData } : car));
  };

  const handleDeleteCar = (carId) => {
    setCars(cars.filter(car => car.id !== carId));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'cars', label: 'My Cars', icon: Car },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">My Dashboard</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Manage your profile, vehicles, and service appointments in one place
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 sticky top-8">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                      activeTab === tab.id
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 lg:p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                      <p className="text-gray-400">Manage your personal details</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors duration-300"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Picture */}
                    <div className="lg:col-span-1">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <div className="w-32 h-32 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            {profileData.profilePic ? (
                              <img
                                src={profileData.profilePic}
                                alt="Profile"
                                className="w-32 h-32 rounded-2xl object-cover"
                              />
                            ) : (
                              <User className="w-16 h-16 text-gray-400" />
                            )}
                          </div>
                          {isEditing && (
                            <button className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors duration-300">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          Click on edit to update profile picture
                        </p>
                      </div>
                    </div>

                    {/* Profile Form */}
                    <div className="lg:col-span-2">
                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              disabled={!isEditing}
                              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                              disabled={!isEditing}
                              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              disabled={!isEditing}
                              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                            />
                          </div>
                        </div>

                        {isEditing && (
                          <div className="flex space-x-3">
                            <button
                              type="submit"
                              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save Changes</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="flex items-center space-x-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-6 py-3 rounded-lg transition-colors duration-300"
                            >
                              <span>Cancel</span>
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Cars Tab */}
              {activeTab === 'cars' && (
                <CarBook
                  cars={cars}
                  onAddCar={handleAddCar}
                  onEditCar={handleEditCar}
                  onDeleteCar={handleDeleteCar}
                />
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <BookingsManagement bookings={bookings} />
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Notifications</h3>
                    <p className="text-gray-400">Manage your notification preferences</p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">No New Notifications</h4>
                      <p className="text-gray-400">You're all caught up!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;