import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  User, Settings, Car, Calendar, Bell, Edit3, Save, Trash2,
  Plus, Phone, Mail, MapPin, Clock, CheckCircle, XCircle,
  Clock4, Filter, Search, Star, Wrench, X, LogOut,
  WrenchIcon,
  CalendarIcon,
  DollarSign,
  PhoneIcon,
  MapPinIcon,
  Menu,
  FileText,
  Download,
  Printer
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">My Cars</h3>
          <p className="text-gray-400">Manage your vehicle details</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-xl transition-colors duration-300 w-full sm:w-auto"
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
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Car Maker
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
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="submit"
                className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                <Save className="w-4 h-4" />
                <span>{editingCar ? 'Update Car' : 'Add Car'}</span>
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center justify-center space-x-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-6 py-3 rounded-lg transition-colors duration-300"
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
const BookingsManagement = ({ bookings, loading, cars }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [billData, setBillData] = useState(null);
  const [loadingBill, setLoadingBill] = useState(false);

  // Format booking ID to vehicle registration + date format
  const formatBookingId = (booking) => {
    if (!booking) return 'N/A';
    
    try {
      // Find the car from cars array by matching car name
      const matchedCar = cars.find(car => 
        car.name === booking.carName || car.model === booking.carName
      );
      
      // Use license plate if available, otherwise fallback to car name
      const vehicleInfo = (matchedCar?.licensePlate || booking.carName)
        ?.replace(/\s+/g, '')
        .toUpperCase() || 'UNKNOWN';
      
      // Parse the scheduled date and format as DDMMYYYY
      const bookingDate = new Date(booking.scheduledDate);
      const day = bookingDate.getDate().toString().padStart(2, '0');
      const month = (bookingDate.getMonth() + 1).toString().padStart(2, '0');
      const year = bookingDate.getFullYear();
      
      return `${vehicleInfo}${day}${month}${year}`;
    } catch (error) {
      console.error('Error formatting booking ID:', error);
      return booking.id || 'N/A';
    }
  };

  // Format bill number from bill data
  const formatBillNumber = (bill) => {
    if (!bill) return 'N/A';
    
    try {
      // Get vehicle plate number
      const vehicleNo = bill.vehicleDetails?.plateNumber?.replace(/\s+/g, '').toUpperCase() || 'UNKNOWN';
      
      // Parse the generated date and format as DDMMYYYY
      const billDate = new Date(bill.generatedAt);
      const day = billDate.getDate().toString().padStart(2, '0');
      const month = (billDate.getMonth() + 1).toString().padStart(2, '0');
      const year = billDate.getFullYear();
      
      return `${vehicleNo}${day}${month}${year}`;
    } catch (error) {
      console.error('Error formatting bill number:', error);
      return bill.billNumber || 'N/A';
    }
  };

  // Fetch bill data for a booking
  const fetchBillData = async (bookingId) => {
    try {
      setLoadingBill(true);
      const response = await axiosInstance.get(`/mechanic/bill/booking/${bookingId}`);
      
      if (response.data.success) {
        setBillData(response.data.bill);
        setShowBillModal(true);
      } else {
        toast.error('No bill found for this booking');
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
      toast.error('Failed to load bill details');
    } finally {
      setLoadingBill(false);
    }
  };

  // Print bill as PDF
  const handlePrintBill = async () => {
    if (!billData) return;

    try {
      const response = await axiosInstance.get(`/mechanic/bill/${billData._id}/pdf`, {
        responseType: 'blob'
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bill-${billData.billNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Bill downloaded successfully');
    } catch (error) {
      console.error('Error downloading bill:', error);
      toast.error('Failed to download bill');
    }
  };

  const closeBillModal = () => {
    setShowBillModal(false);
    setBillData(null);
  };

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
      const res = await axiosInstance.post(`/bookings/${selectedBooking._id}/cancel`);

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
                    Booking ID: <span className="text-white font-mono">{formatBookingId(booking)}</span>
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
                    <div className="flex items-center space-x-1 mt-1">
                      <img src={booking.profilePic} alt="mechanic" className="w-6 h-6 rounded-md" />
                      <p className="text-white font-medium">{booking.mechanicName}</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-gray-400 text-sm">{booking.mechanicRating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleViewDetails(booking)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors duration-300 text-sm font-medium"
                >
                  View Details
                </button>
                
                {/* Show Bill button for completed bookings */}
                {booking.status === 'completed' && (
                  <button
                    onClick={() => fetchBillData(booking.id)}
                    disabled={loadingBill}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-xl transition-colors duration-300 text-sm font-medium"
                  >
                    {loadingBill ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>Show Bill</span>
                      </>
                    )}
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
                <p className="text-gray-400 text-sm">Booking ID: <span className="font-mono text-white">{formatBookingId(selectedBooking)}</span></p>
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
              {/* Booking ID Display */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Booking ID</p>
                    <p className="text-white font-mono text-lg font-semibold">{formatBookingId(selectedBooking)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedBooking.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
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
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                    {/* <User className="w-6 h-6 text-orange-400" /> */}
                    <img src={selectedBooking.profilePic} alt="mechanic" className="w-full h-full rounded-md" />
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-6 border-t border-gray-700">
              {/* Get Directions Button - Left Aligned */}
              <button
                onClick={() => {
                  const destination = encodeURIComponent(selectedBooking.location);
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
                }}
                className="flex items-center justify-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-300 w-full sm:w-auto"
              >
                <MapPin className="w-4 h-4" />
                <span>Get Directions</span>
              </button>

              {/* Right Side Buttons */}
              <div className="flex space-x-3 w-full sm:w-auto">
                <button
                  onClick={closeModal}
                  className="flex-1 sm:flex-none px-6 py-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-xl transition-colors duration-300"
                >
                  Close
                </button>
                {selectedBooking.status === 'pending' && (
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-300">
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bill Modal */}
      {showBillModal && billData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Bill Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <img src='/logo.png' alt='logo' className="w-full h-full object-contain p-2" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Mechanic Pro</h3>
                  <p className="text-white/90 text-sm">Your Vehicle In Safer Hands</p>
                </div>
              </div>
              <button
                onClick={closeBillModal}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Bill Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Invoice Header */}
              <div className="text-right mb-6">
                <h2 className="text-3xl font-bold text-gray-800">INVOICE</h2>
              </div>

              {/* Bill Info and Vehicle Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm text-gray-600">Vehicle No :-</p>
                    <p className="font-semibold text-gray-800">{billData.vehicleDetails?.plateNumber || 'N/A'}</p>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-sm text-gray-600">Brand / Model :-</p>
                    <p className="font-semibold text-gray-800">{billData.vehicleDetails?.make}/{billData.vehicleDetails?.model || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-2">
                    <p className="text-sm text-gray-600">Invoice No:-</p>
                    <p className="font-semibold text-gray-800">{formatBillNumber(billData)}</p>
                  </div>
                  <div className="flex items-baseline justify-end gap-2 mt-2">
                    <p className="text-sm text-gray-600">Date :-</p>
                    <p className="font-semibold text-gray-800">{new Date(billData.generatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-t-2 border-b-2 border-gray-800">
                      <th className="text-left py-3 px-2 text-gray-900 font-semibold"><u>Item</u></th>
                      <th className="text-right py-3 px-2 text-gray-900 font-semibold"><u>Price</u></th>
                    </tr>
                  </thead>
                  <tbody>
                    {billData.items?.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 px-2 text-gray-700">{item.name}</td>
                        <td className="py-3 px-2 text-right text-gray-700">{item.price}/-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-8">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-bold text-gray-800">{billData.totalAmount}/-</span>
                </div>
                {billData.advanceReceived && (
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-800">Advance Recieved</span>
                    <span className="font-bold text-gray-800">-{billData.advanceReceived}/-</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xl border-t-2 border-gray-800 pt-2">
                  <span className="font-bold text-gray-800">Balance To Be Paid</span>
                  <span className="font-bold text-gray-800">
                    {billData.advanceReceived 
                      ? (billData.totalAmount - billData.advanceReceived)
                      : billData.totalAmount}/-
                  </span>
                </div>
              </div>

              {/* PhonePe QR Code - Right Aligned */}
              <div className="flex justify-end mb-6">
                <div className="text-center">
                  <img 
                    src="/phonepe.png" 
                    alt="PhonePe QR Code" 
                    className="w-32 h-32 object-contain rounded-lg border border-gray-300"
                  />
                  <p className="text-xs text-gray-600 mt-2">Scan to Pay via PhonePe</p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Thank you ......</p>
                    <p className="text-sm font-semibold text-gray-800">Have A Safe Ride - Visit Again</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800 mb-1">Team MechanicPro</p>
                    <p className="text-xs text-gray-600">Authorized Signed</p>
                  </div>
                </div>
                <div className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg flex justify-between items-center text-sm">
                  <div>
                    <p>📞 {billData.mechanicId?.phone || '9281487865, 9704787511'}</p>
                    <p>🌐 www.mechanicpro.in</p>
                  </div>
                  <div className="text-right">
                    <p>📍 A1 Car Service, Beside Power One Mall, Bundar Road</p>
                    <p>Warangal Urban 506007</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeBillModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-300"
              >
                Close
              </button>
              <button
                onClick={handlePrintBill}
                className="flex items-center space-x-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors duration-300"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF</span>
              </button>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    localStorage.removeItem("user_token");
    navigate('/login');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
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
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-900/50 border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-white">My Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Header */}
        <div className="hidden lg:block text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">My Dashboard</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Manage your profile, vehicles, and service appointments in one place
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
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
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <div className='flex items-center justify-between w-full gap-4'>
                        <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                        <LogOut
                          className="w-5 h-5 cursor-pointer hidden lg:block"
                          title="Logout"
                          onClick={handleLogout}
                        />
                      </div>
                      <p className="text-gray-400">Manage your personal details</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors duration-300 w-full sm:w-auto"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {/* Profile Picture */}
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

                    {/* Profile Form */}
                    <div>
                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
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
                          <div>
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
                          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                            <button
                              type="submit"
                              className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save Changes</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="flex items-center justify-center space-x-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-6 py-3 rounded-lg transition-colors duration-300"
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
                <BookingsManagement 
                  bookings={bookings} 
                  loading={bookingsLoading}
                  cars={cars}
                />
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

      {/* Mobile Side Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="absolute left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Navigation</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;