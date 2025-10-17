import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Settings, Car, Calendar, Bell, Edit3, Save, Trash2,
  Plus, Phone, Mail, MapPin, Clock, CheckCircle, XCircle,
  Clock4, Filter, Search, Star, Wrench, X, LogOut,
  WrenchIcon,
  CalendarIcon,
  DollarSign,
  PhoneIcon,
  MapPinIcon
} from 'lucide-react';
import axiosInstance from '../utils/axiosinstance';
import { uploadToImgBB } from '../utils/uploadtoImbb';

// Car Book CRUD Component
const CarBook = ({ cars, onAddCar, onEditCar, onDeleteCar, loading }) => {
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
          disabled={loading}
          className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-xl transition-colors duration-300"
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
      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading cars...</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

// Bookings Management Component
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Search, Clock4, CheckCircle, Wrench, XCircle, Star, Calendar, Phone, MapPin, X, User, Car, WrenchIcon, MapPinIcon, PhoneIcon, CalendarIcon, DollarSign } from 'lucide-react';

const BookingsManagement = ({ bookings, loading }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.mechanicName.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'inprogress') return matchesSearch && booking.status !== 'completed';
    if (filter === 'completed') return matchesSearch && booking.status === 'completed';

    return matchesSearch;
  });

  console.log(bookings, "bookings pf");

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock4 className="w-4 h-4 text-amber-400" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress':
        return <Wrench className="w-4 h-4 text-blue-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock4 className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };


  const handleCancel = async () => {
    try {
      const res = await axiosInstance.post(`/bookings/${selectedBooking._id}/cancel`)
      toast.success("Booking deleted successfully");
      closeModal();
      getBookings();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white">My Bookings</h3>
          <p className="text-gray-400">Track and manage your service appointments</p>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

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
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${filter === filterType
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
                <button
                  onClick={() => handleViewDetails(booking)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors duration-300 text-sm font-medium"
                >
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

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-white">Booking Details</h3>
                <p className="text-gray-400 text-sm">Booking ID: {selectedBooking.id}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-700 rounded-xl transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedBooking.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  Booked on: <span className="text-white">{selectedBooking.bookedDate}</span>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                      <Car className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Vehicle</p>
                      <p className="text-white font-medium">{selectedBooking.carName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <WrenchIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Service Type</p>
                      <p className="text-white font-medium">{selectedBooking.serviceType}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Scheduled Date</p>
                      <p className="text-white font-medium">{selectedBooking.scheduledDate}</p>
                      <p className="text-gray-400 text-sm">{selectedBooking.scheduledTime}</p>
                    </div>
                  </div>

                  {selectedBooking.totalPrice && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Price</p>
                        <p className="text-white font-medium">₹{selectedBooking.totalPrice}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mechanic Details */}
              <div className="bg-gray-700/30 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Mechanic Information</h4>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{selectedBooking.mechanicName}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-400 text-sm">{selectedBooking.mechanicRating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">{selectedBooking.mechanicPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gray-700/30 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Service Location</h4>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-orange-400" />
                  <p className="text-white">{selectedBooking.location}</p>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedBooking.instructions && (
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Additional Instructions</h4>
                  <p className="text-gray-300">{selectedBooking.instructions}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-xl transition-colors duration-300"
              >
                Close
              </button>
              {selectedBooking.status === 'pending' && (
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-300">
                  Cancel Booking
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};



// Main Profile Component
const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [carsLoading, setCarsLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePic: ''
  });

  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Check authentication and load data
  useEffect(() => {
    const token = localStorage.getItem('userInfo');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfileData();
  }, []);

  // Fetch all profile data
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileRes, carsRes, bookingsRes] = await Promise.all([
        axiosInstance.get('/user/profile'),
        axiosInstance.get('/user/cars'),
        axiosInstance.get('/user/bookings')
      ]);

      setProfileData({
        name: profileRes.data.name,
        email: profileRes.data.email,
        phone: profileRes.data.phone,
        profilePic: profileRes.data.profilePic
      });
      setCars(carsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle profile picture upload
  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToImgBB(file);

      // Update profile with new image
      await axiosInstance.put('/user/profile', {
        profilePic: imageUrl,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone
      });

      setProfileData(prev => ({ ...prev, profilePic: imageUrl }));
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Error uploading profile picture');
    } finally {
      setUploading(false);
    }
  };

  // Handle profile save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/user/profile', profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  // Car management functions
  const handleAddCar = async (carData) => {
    try {
      setCarsLoading(true);
      const response = await axiosInstance.post('/user/cars', carData);
      setCars(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding car:', error);
      alert('Error adding car');
    } finally {
      setCarsLoading(false);
    }
  };

  const handleEditCar = async (carId, carData) => {
    try {
      setCarsLoading(true);
      const response = await axiosInstance.put(`/user/cars/${carId}`, carData);
      setCars(prev => prev.map(car => car.id === carId ? response.data : car));
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Error updating car');
    } finally {
      setCarsLoading(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      setCarsLoading(true);
      await axiosInstance.delete(`/user/cars/${carId}`);
      setCars(prev => prev.filter(car => car.id !== carId));
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car');
    } finally {
      setCarsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'cars', label: 'My Cars', icon: Car },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

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
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === tab.id
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
                      <div className='flex items-center justify-between w-full gap-4'>
                        <h2 className="text-2xl font-bold text-white w-[300px]">Profile Information</h2>
                        <LogOut className="w-5 h-5 cursor-pointer" title="Logout" onClick={handleLogout} />
                      </div>
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
                          <div className="w-32 h-32 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
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
                            <label className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors duration-300 cursor-pointer">
                              {uploading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Edit3 className="w-4 h-4" />
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                                className="hidden"
                                disabled={uploading}
                              />
                            </label>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          {isEditing ? 'Click on edit icon to update profile picture' : 'Edit profile to update picture'}
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
                  loading={carsLoading}
                />
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <BookingsManagement bookings={bookings} loading={bookingsLoading} />
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