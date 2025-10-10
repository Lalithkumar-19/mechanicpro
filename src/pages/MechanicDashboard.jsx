import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench, Calendar, Clock, CheckCircle, XCircle,
  Settings, User, Bell, Package, BarChart3, MessageCircle,
  MapPin, Phone, Mail, Car, Filter, Search, Star,
  TrendingUp, Users, DollarSign, AlertCircle, Edit3,
  Plus, Truck, Shield, Zap, Sparkles, Eye, ChevronLeft, ChevronRight, X
} from 'lucide-react';

const MechanicDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [shopStatus, setShopStatus] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [sparePartRequests, setSparePartRequests] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showSparePartForm, setShowSparePartForm] = useState(false);

  // New state variables for functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentBookingPage, setCurrentBookingPage] = useState(1);
  const [currentSparePartPage, setCurrentSparePartPage] = useState(1);
  const [profileData, setProfileData] = useState({
    name: 'Raj Mechanic',
    shopName: 'AutoCare Pro Center',
    email: 'contact@autocarepro.com',
    phone: '+91 98765 43210',
    address: 'Shop No. 12, Linking Road, Bandra West, Mumbai',
    profilePic: null
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [newSparePart, setNewSparePart] = useState({
    partName: '',
    carModel: '',
    quantity: 1,
    urgency: 'medium'
  });

  const itemsPerPage = 10;

  // Enhanced sample data
  useEffect(() => {
    const sampleBookings = [
      {
        id: 'BK001',
        customerName: 'Raj Sharma',
        customerPhone: '+91 98765 43210',
        vehicle: {
          model: 'Honda City',
          year: '2022',
          registration: 'MH01AB1234'
        },
        serviceType: 'General Service',
        bookingType: 'scheduled',
        date: '2024-01-15',
        time: '10:00 AM',
        status: 'pending',
        amount: 3999,
        createdAt: new Date(),
        notes: 'Customer requested AC check as well'
      },
      {
        id: 'BK002',
        customerName: 'Priya Patel',
        customerPhone: '+91 98765 43211',
        vehicle: {
          model: 'Hyundai Creta',
          year: '2021',
          registration: 'MH01CD5678'
        },
        serviceType: 'AC Service',
        bookingType: 'instant',
        date: '2024-01-15',
        time: '11:30 AM',
        status: 'confirmed',
        amount: 2499,
        createdAt: new Date(),
        notes: 'Needs urgent AC repair'
      },
      {
        id: 'BK003',
        customerName: 'Amit Kumar',
        customerPhone: '+91 98765 43212',
        vehicle: {
          model: 'Maruti Swift',
          year: '2020',
          registration: 'MH01EF9012'
        },
        serviceType: 'Brake Service',
        bookingType: 'scheduled',
        date: '2024-01-16',
        time: '02:00 PM',
        status: 'in-progress',
        amount: 4499,
        createdAt: new Date(),
        notes: 'Front brake pads replacement needed'
      },
      {
        id: 'BK004',
        customerName: 'Sneha Reddy',
        customerPhone: '+91 98765 43213',
        vehicle: {
          model: 'Toyota Innova',
          year: '2019',
          registration: 'MH01GH3456'
        },
        serviceType: 'Engine Repair',
        bookingType: 'scheduled',
        date: '2024-01-16',
        time: '09:00 AM',
        status: 'completed',
        amount: 8999,
        createdAt: new Date(),
        notes: 'Engine overheating issue resolved'
      },
      {
        id: 'BK005',
        customerName: 'Vikram Singh',
        customerPhone: '+91 98765 43214',
        vehicle: {
          model: 'Ford EcoSport',
          year: '2020',
          registration: 'MH01IJ7890'
        },
        serviceType: 'Oil Change',
        bookingType: 'instant',
        date: '2024-01-17',
        time: '03:00 PM',
        status: 'pending',
        amount: 1999,
        createdAt: new Date(),
        notes: 'Synthetic oil required'
      }
    ];

    const sampleSpareParts = [
      {
        id: 'SP001',
        serviceId: 'BK003',
        partName: 'Brake Pads Set',
        carModel: 'Maruti Swift',
        quantity: 2,
        status: 'requested',
        requestedAt: new Date(),
        urgency: 'high'
      },
      {
        id: 'SP002',
        serviceId: 'BK002',
        partName: 'AC Compressor',
        carModel: 'Hyundai Creta',
        quantity: 1,
        status: 'approved',
        requestedAt: new Date(Date.now() - 86400000),
        urgency: 'medium'
      },
      {
        id: 'SP003',
        serviceId: 'BK004',
        partName: 'Engine Oil Filter',
        carModel: 'Toyota Innova',
        quantity: 1,
        status: 'delivered',
        requestedAt: new Date(Date.now() - 172800000),
        urgency: 'low'
      }
    ];

    const sampleNotifications = [
      {
        id: 1,
        message: 'New booking received from Raj Sharma',
        type: 'booking',
        timestamp: new Date(Date.now() - 300000),
        read: false
      },
      {
        id: 2,
        message: 'Spare part request approved',
        type: 'spare-part',
        timestamp: new Date(Date.now() - 1800000),
        read: false
      },
      {
        id: 3,
        message: 'Service completed for Toyota Innova',
        type: 'service',
        timestamp: new Date(Date.now() - 3600000),
        read: true
      },
      {
        id: 4,
        message: 'New customer review received',
        type: 'review',
        timestamp: new Date(Date.now() - 7200000),
        read: true
      }
    ];

    setBookings(sampleBookings);
    setSparePartRequests(sampleSpareParts);
    setNotifications(sampleNotifications);
  }, []);

  // Filter and search functionality for bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination for bookings
  const totalBookingPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentBookingPage - 1) * itemsPerPage,
    currentBookingPage * itemsPerPage
  );

  // Search functionality for spare parts
  const [sparePartSearch, setSparePartSearch] = useState('');
  const filteredSpareParts = sparePartRequests.filter(part =>
    part.partName.toLowerCase().includes(sparePartSearch.toLowerCase()) ||
    part.carModel.toLowerCase().includes(sparePartSearch.toLowerCase()) ||
    part.serviceId.toLowerCase().includes(sparePartSearch.toLowerCase())
  );

  // Pagination for spare parts
  const totalSparePartPages = Math.ceil(filteredSpareParts.length / itemsPerPage);
  const paginatedSpareParts = filteredSpareParts.slice(
    (currentSparePartPage - 1) * itemsPerPage,
    currentSparePartPage * itemsPerPage
  );

  const addNotification = (message, type) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
  };

  // Enhanced booking status update with all status options
  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );

    const statusMessages = {
      'pending': 'Booking set to pending',
      'confirmed': 'Booking confirmed',
      'in-progress': 'Service started',
      'completed': 'Service completed'
    };

    addNotification(statusMessages[newStatus] || 'Status updated', 'booking');
  };

  const handleBookingAction = (bookingId, action) => {
    if (action === 'accept') {
      updateBookingStatus(bookingId, 'confirmed');
    } else if (action === 'decline') {
      updateBookingStatus(bookingId, 'pending');
    }
  };

  const toggleShopStatus = () => {
    setShopStatus(!shopStatus);
    addNotification(`Shop ${!shopStatus ? 'opened' : 'closed'}`, 'shop');
  };

  // New spare part request functionality
  const handleNewSparePartRequest = () => {
    if (!newSparePart.partName || !newSparePart.carModel) {
      alert('Please fill in all required fields');
      return;
    }

    const newRequest = {
      id: `SP${Date.now()}`,
      serviceId: 'N/A',
      partName: newSparePart.partName,
      carModel: newSparePart.carModel,
      quantity: newSparePart.quantity,
      status: 'requested',
      requestedAt: new Date(),
      urgency: newSparePart.urgency
    };

    setSparePartRequests(prev => [newRequest, ...prev]);
    setShowSparePartForm(false);
    setNewSparePart({
      partName: '',
      carModel: '',
      quantity: 1,
      urgency: 'medium'
    });
    addNotification('New spare part request submitted', 'spare-part');
  };

  // Profile edit functionality
  const handleProfileEdit = () => {
    setEditingProfile(true);
  };

  const handleProfileSave = () => {
    setEditingProfile(false);
    addNotification('Profile updated successfully', 'profile');
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePic: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get recent notifications (last 10)
  const recentNotifications = notifications.slice(0, 10);

  const dashboardStats = {
    totalServices: bookings.length,
    pendingRequests: bookings.filter(b => b.status === 'pending').length,
    inProgress: bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    pendingSpareParts: sparePartRequests.filter(s => s.status === 'requested').length
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'spare-parts', label: 'Spare Parts', icon: Package },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Wrench className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
               <img src='/logo.png' alt='logo' />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MechanicPro Dashboard</h1>
                <p className="text-gray-400 text-sm">AutoCare Pro Center</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Shop Status Toggle */}
              <div className="flex items-center space-x-3">
                <span className="text-gray-300 text-sm font-medium">
                  {shopStatus ? 'Shop Open' : 'Shop Closed'}
                </span>
                <button
                  onClick={toggleShopStatus}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${shopStatus ? 'bg-orange-500' : 'bg-gray-600'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${shopStatus ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              {/* Notifications */}
              <button
                onClick={() => setActiveTab('notifications')}
                className="relative p-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Bell className="w-6 h-6" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  {profileData.profilePic ? (
                    <img
                      src={profileData.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-white font-medium">{profileData.name}</p>
                  <p className="text-gray-400 text-sm">{profileData.shopName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full cursor-pointerw flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Today's Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Total Services</span>
                    <span className="text-white font-semibold">{dashboardStats.totalServices}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">In Progress</span>
                    <span className="text-orange-400 font-semibold">{dashboardStats.inProgress}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Pending</span>
                    <span className="text-amber-400 font-semibold">{dashboardStats.pendingRequests}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 lg:p-8">

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
                    <p className="text-gray-400">Real-time updates of your workshop activities</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-800rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Total Services</p>
                          <p className="text-3xl font-bold text-white mt-2">{dashboardStats.totalServices}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Pending Requests</p>
                          <p className="text-3xl font-bold text-amber-400 mt-2">{dashboardStats.pendingRequests}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-amber-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">In Progress</p>
                          <p className="text-3xl font-bold text-orange-400 mt-2">{dashboardStats.inProgress}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                          <Wrench className="w-6 h-6 text-orange-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Spare Parts</p>
                          <p className="text-3xl font-bold text-purple-400 mt-2">{dashboardStats.pendingSpareParts}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-purple-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings */}
                  <div className="bg-gray-800rounded-2xl p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-white">Recent Bookings</h3>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                              <Car className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{booking.customerName}</h4>
                              <p className="text-gray-400 text-sm">{booking.vehicle.model} • {booking.serviceType}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                              {booking.status.replace('-', ' ')}
                            </span>
                            <span className="text-orange-400 font-semibold">₹{booking.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Service Bookings</h2>
                      <p className="text-gray-400">Manage all incoming service requests</p>
                    </div>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search bookings..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-gray-800border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-800 border cursor-pointer rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all" className='cursor-pointer' >All Status</option>
                        <option value="pending" className='cursor-pointer' >Pending</option>
                        <option value="confirmed" className='cursor-pointer' >Confirmed</option>
                        <option value="in-progress" className='cursor-pointer' >In Progress</option>
                        <option value="completed" className='cursor-pointer' >Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {paginatedBookings.map((booking) => (
                      <div key={booking.id} className="bg-gray-800rounded-2xl p-6 border border-gray-700 hover:border-orange-500/40 transition-all duration-300">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          {/* Booking Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(booking.status)}
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                                  {booking.status.replace('-', ' ').toUpperCase()}
                                </span>
                              </div>
                              <span className="text-gray-400 text-sm">ID: {booking.id}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <p className="text-gray-400 text-sm">Customer</p>
                                <p className="text-white font-medium">{booking.customerName}</p>
                                <p className="text-gray-400 text-sm">{booking.customerPhone}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Vehicle</p>
                                <p className="text-white font-medium">{booking.vehicle.model}</p>
                                <p className="text-gray-400 text-sm">{booking.vehicle.registration}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Service</p>
                                <p className="text-white font-medium">{booking.serviceType}</p>
                                <p className="text-gray-400 text-sm">{booking.bookingType}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Schedule</p>
                                <p className="text-white font-medium">{booking.date}</p>
                                <p className="text-gray-400 text-sm">{booking.time}</p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col space-y-2">
                            <div className="flex space-x-2">
                              {/* Status Update Dropdown */}
                              <select
                                value={booking.status}
                                onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>

                              <button
                                onClick={() => setSelectedBooking(booking)}
                                className="flex items-center space-x-1 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-3 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Details</span>
                              </button>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => setShowSparePartForm(true)}
                                className="flex items-center space-x-1 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-3 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
                              >
                                <Package className="w-4 h-4" />
                                <span>Request Parts</span>
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="text-orange-400 font-bold text-lg">
                                ₹{booking.amount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalBookingPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <button
                        onClick={() => setCurrentBookingPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentBookingPage === 1}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800border border-gray-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors duration-300"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      <span className="text-gray-300">
                        Page {currentBookingPage} of {totalBookingPages}
                      </span>

                      <button
                        onClick={() => setCurrentBookingPage(prev => Math.min(prev + 1, totalBookingPages))}
                        disabled={currentBookingPage === totalBookingPages}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800border border-gray-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors duration-300"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Spare Parts Tab */}
              {activeTab === 'spare-parts' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Spare Parts Management</h2>
                      <p className="text-gray-400">Track and manage spare part requests</p>
                    </div>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search parts..."
                          value={sparePartSearch}
                          onChange={(e) => setSparePartSearch(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-gray-800border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <button
                        onClick={() => setShowSparePartForm(true)}
                        className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors duration-300"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Request</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {paginatedSpareParts.map((request) => (
                      <div key={request.id} className="bg-gray-800rounded-2xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                              <Package className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{request.partName}</h3>
                              <p className="text-gray-400 text-sm">For {request.carModel}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'requested' ? 'bg-amber-500/20 text-amber-400' :
                            request.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                              request.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                'bg-gray-500/20 text-gray-400'
                            }`}>
                            {request.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Service ID:</span>
                            <span className="text-white ml-2">{request.serviceId}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Quantity:</span>
                            <span className="text-white ml-2">{request.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Requested:</span>
                            <span className="text-white ml-2">{request.requestedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalSparePartPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <button
                        onClick={() => setCurrentSparePartPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentSparePartPage === 1}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800border border-gray-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors duration-300"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      <span className="text-gray-300">
                        Page {currentSparePartPage} of {totalSparePartPages}
                      </span>

                      <button
                        onClick={() => setCurrentSparePartPage(prev => Math.min(prev + 1, totalSparePartPages))}
                        disabled={currentSparePartPage === totalSparePartPages}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800border border-gray-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors duration-300"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
                      <p className="text-gray-400">Stay updated with real-time alerts</p>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors duration-300"
                      >
                        <X className="w-4 h-4" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {recentNotifications.length > 0 ? (
                      recentNotifications.map((notification) => (
                        <div key={notification.id} className="bg-gray-800rounded-2xl p-4 border border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'booking' ? 'bg-blue-500/20' :
                              notification.type === 'spare-part' ? 'bg-purple-500/20' :
                                notification.type === 'shop' ? 'bg-orange-500/20' :
                                  'bg-gray-500/20'
                              }`}>
                              <Bell className={`w-4 h-4 ${notification.type === 'booking' ? 'text-blue-400' :
                                notification.type === 'spare-part' ? 'text-purple-400' :
                                  notification.type === 'shop' ? 'text-orange-400' :
                                    'text-gray-400'
                                }`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-white">{notification.message}</p>
                              <p className="text-gray-400 text-sm">
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Shop Profile</h2>
                      <p className="text-gray-400">Manage your workshop details and settings</p>
                    </div>
                    <button
                      onClick={editingProfile ? handleProfileSave : handleProfileEdit}
                      className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors duration-300"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{editingProfile ? 'Save Profile' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Shop Information */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Shop Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center overflow-hidden">
                              {profileData.profilePic ? (
                                <img
                                  src={profileData.profilePic}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-8 h-8 text-orange-400" />
                              )}
                            </div>
                            {editingProfile && (
                              <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer">
                                <Edit3 className="w-3 h-3 text-white" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProfilePicChange}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                          <div className="flex-1">
                            {editingProfile ? (
                              <input
                                type="text"
                                value={profileData.shopName}
                                onChange={(e) => setProfileData(prev => ({ ...prev, shopName: e.target.value }))}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            ) : (
                              <>
                                <h4 className="text-white font-semibold">{profileData.shopName}</h4>
                                <p className="text-gray-400 text-sm">Premium Car Service Center</p>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {editingProfile ? (
                              <input
                                type="text"
                                value={profileData.address}
                                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            ) : (
                              <span className="text-gray-300">{profileData.address}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {editingProfile ? (
                              <input
                                type="text"
                                value={profileData.phone}
                                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            ) : (
                              <span className="text-gray-300">{profileData.phone}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {editingProfile ? (
                              <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            ) : (
                              <span className="text-gray-300">{profileData.email}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="bg-gray-800rounded-2xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Working Hours</h3>
                      <div className="space-y-3">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <div key={day} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                            <span className="text-gray-300">{day}</span>
                            <span className="text-white font-medium">9:00 AM - 6:00 PM</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spare Part Request Modal */}
      <AnimatePresence>
        {showSparePartForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-4">New Spare Part Request</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Part Name *</label>
                  <input
                    type="text"
                    value={newSparePart.partName}
                    onChange={(e) => setNewSparePart(prev => ({ ...prev, partName: e.target.value }))}
                    placeholder="Enter part name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Car Model *</label>
                  <input
                    type="text"
                    value={newSparePart.carModel}
                    onChange={(e) => setNewSparePart(prev => ({ ...prev, carModel: e.target.value }))}
                    placeholder="Enter car model"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Quantity</label>
                    <input
                      type="number"
                      value={newSparePart.quantity}
                      onChange={(e) => setNewSparePart(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      min="1"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Urgency</label>
                    <select
                      value={newSparePart.urgency}
                      onChange={(e) => setNewSparePart(prev => ({ ...prev, urgency: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowSparePartForm(false)}
                  className="flex-1 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-4 py-3 rounded-xl transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewSparePartRequest}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl transition-colors duration-300"
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl border border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-400 text-sm mb-2">Customer Information</h4>
                    <p className="text-white font-semibold">{selectedBooking.customerName}</p>
                    <p className="text-gray-300">{selectedBooking.customerPhone}</p>
                  </div>

                  <div>
                    <h4 className="text-gray-400 text-sm mb-2">Vehicle Information</h4>
                    <p className="text-white font-semibold">{selectedBooking.vehicle.model}</p>
                    <p className="text-gray-300">{selectedBooking.vehicle.year} • {selectedBooking.vehicle.registration}</p>
                  </div>

                  <div>
                    <h4 className="text-gray-400 text-sm mb-2">Service Details</h4>
                    <p className="text-white font-semibold">{selectedBooking.serviceType}</p>
                    <p className="text-gray-300 capitalize">{selectedBooking.bookingType} Booking</p>
                  </div>

                  <div>
                    <h4 className="text-gray-400 text-sm mb-2">Schedule</h4>
                    <p className="text-white font-semibold">{selectedBooking.date}</p>
                    <p className="text-gray-300">{selectedBooking.time}</p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <h4 className="text-gray-400 text-sm mb-2">Additional Notes</h4>
                    <p className="text-gray-300 bg-gray-800rounded-xl p-4">{selectedBooking.notes}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <div>
                    <span className="text-gray-400 text-sm">Total Amount:</span>
                    <span className="text-orange-400 font-bold text-xl ml-2">₹{selectedBooking.amount}</span>
                  </div>

                  <div className="flex space-x-2">
                    <select
                      value={selectedBooking.status}
                      onChange={(e) => {
                        updateBookingStatus(selectedBooking.id, e.target.value);
                        setSelectedBooking(prev => prev ? { ...prev, status: e.target.value } : null);
                      }}
                      className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      onClick={() => setShowSparePartForm(true)}
                      className="flex items-center space-x-1 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-3 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
                    >
                      <Package className="w-4 h-4" />
                      <span>Request Parts</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MechanicDashboard;