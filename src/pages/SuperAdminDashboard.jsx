import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Wrench, Calendar, Clock, CheckCircle, XCircle,
  Settings, User, Bell, Package, BarChart3, MessageCircle,
  MapPin, Phone, Mail, Car, Filter, Search, Star,
  TrendingUp, Users, DollarSign, AlertCircle, Edit3,
  Plus, Truck, Shield, Zap, Sparkles, Eye, ChevronLeft,
  ChevronRight, X, LogOut, Home, ShoppingCart, PieChart,
  Download, Upload, Trash2, MoreVertical, BarChart2,
  UserPlus, CreditCard, Shield as ShieldIcon, Activity,
  IndianRupee,
  EyeOff
} from 'lucide-react';

// Chart components
import {
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import adminaxiosInstance from "../utils/adminaxios";
import { socket } from '../utils/socketServer';
import { onForegroundMessage } from '../firebase';
// Import Components
import MechanicsManagement from '../components/admin/MechanicsManagement';
import BookingsManagement from '../components/admin/BookingsManagement';
import SparePartsManagement from '../components/admin/SparePartsManagement';
import CustomersManagement from '../components/admin/CustomersManagement';
import ServicesManagement from '../components/admin/ServicesManagement';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import NotificationsPanel from '../components/admin/NotificationsPanel';
import CarouselManager from '../components/Admin/CarouselManager';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newBookingIds, setNewBookingIds] = useState([]); // Track new bookings

  // Data states
  const [mechanics, setMechanics] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [sparePartRequests, setSparePartRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [_loading, setLoading] = useState(true);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const { data } = await adminaxiosInstance.get("/admin/dashboard-analytics");
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getmechanics = async () => {
    try {
      const { data } = await adminaxiosInstance.get("/admin/get-all-mechanics");
      const res = Array.isArray(data) && data.map((item) => {
        return {
          id: item._id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          location: {
            state: item.state,
            city: item.city,
            street: item.streetaddress,
            pincode: item.zip,
            latitude: item.latitude,
            longitude: item.longitude
          },
          rating: item.rating,
          services: item.services,
          isActive: item.isActive,
          totalBookings: item.totalbookings,
          joineddate: item.createdAt.toLocaleString(),
          profilePic: item.profile || null
        }
      });
      setMechanics(res);
    } catch (error) {
      console.log(error);
    }
  }

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsLoggedIn(true);
      getmechanics();
      fetchAnalyticsData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Socket.IO real-time updates for new bookings (Admin)
  useEffect(() => {
    if (!isLoggedIn) return;

    const adminId = localStorage.getItem("admin_id");
    if (!adminId) return;

    // Register admin with socket (using a special admin channel)
    socket.emit("register_admin", adminId);
    console.log(`✅ Admin ${adminId} registered with socket`);

    // Listen for new booking notifications
    const handleNewBooking = (data) => {
      console.log('📨 New booking notification received:', data);
      
      // Show toast notification
      toast.success(`🎉 New booking received from ${data.customerName || 'a customer'}!`, {
        position: "top-right",
        autoClose: 5000,
      });

      // Play notification sound
      try {
        const audio = new Audio('/sounds/notification1.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
      } catch (error) {
        console.log('Sound error:', error);
      }

      // Add to new bookings list for visual feedback
      if (data.bookingId) {
        setNewBookingIds(prev => {
          if (!prev.includes(data.bookingId)) {
            return [...prev, data.bookingId];
          }
          return prev;
        });

        // Remove from new list after 15 seconds
        setTimeout(() => {
          setNewBookingIds(prev => prev.filter(id => id !== data.bookingId));
        }, 15000);
      }

      // Refresh analytics and bookings
      fetchAnalyticsData();
      
      // Add notification to the list
      addNotification(`New booking from ${data.customerName || 'customer'}`, 'booking');
    };

    // Listen for general notifications
    const handleNotification = (data) => {
      console.log('🔔 Notification received:', data);
      
      if (data.message) {
        toast.info(data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }

      // Refresh data if needed
      if (data.type === 'new_booking') {
        fetchAnalyticsData();
      }
    };

    // Attach socket listeners
    socket.on("new_booking", handleNewBooking);
    socket.on("notification", handleNotification);

    // Cleanup on unmount
    return () => {
      socket.off("new_booking", handleNewBooking);
      socket.off("notification", handleNotification);
    };
  }, [isLoggedIn]);

  // Firebase FCM foreground message handler for admin
  useEffect(() => {
    if (!isLoggedIn) return;

    const unsubscribe = onForegroundMessage((payload) => {
      console.log('📨 FCM Foreground message (Admin):', payload);
      
      // Show toast for FCM notifications
      if (payload.notification) {
        toast.info(payload.notification.body || payload.notification.title, {
          position: "top-right",
          autoClose: 5000,
        });
      }

      // Refresh data if needed
      if (payload.data?.type === 'new_booking') {
        fetchAnalyticsData();
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isLoggedIn]);

  // Authentication
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_id");
    setIsLoggedIn(false);
  };

  // Notifications
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

  // Dashboard stats - now using real analytics data
  const dashboardStats = analyticsData ? {
    totalMechanics: analyticsData.overview.totalMechanics,
    activeMechanics: mechanics.filter(m => m.isActive).length,
    totalBookings: analyticsData.overview.totalBookings,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    totalRevenue: analyticsData.overview.totalRevenue,
    pendingSpareRequests: sparePartRequests.filter(s => s.status === 'pending').length,
    servicesInProgress: bookings.filter(b => b.status === 'in-progress').length,
    totalCustomers: analyticsData.overview.totalCustomers,
    totalServices: analyticsData.overview.totalServices
  } : {
    totalMechanics: 0,
    activeMechanics: 0,
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    pendingSpareRequests: 0,
    servicesInProgress: 0,
    totalCustomers: 0,
    totalServices: 0
  };

  // Tabs configuration
  const tabs = [
    { id: 'analytics', label: 'Overview', icon: Home },
    { id: 'mechanics', label: 'Mechanics', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'spare-parts', label: 'Spare Parts', icon: Package },
    { id: 'customers', label: 'Customers', icon: User },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'carousel', label: 'Carousel', icon: Sparkles },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setLoader(true);
      const response = await adminaxiosInstance.post("/adminauth/login", {
        email: email,
        password: password
      });
      console.log(response);
      if (response.status === 200) {
        const { token, _id } = response.data;
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_id", _id);
        setIsLoggedIn(true);
        setLoader(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoader(false);
    }
  };





  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Super Admin Login</h2>
          <form className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Password</label>
              <div className='flex items-center gap-1'>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="••••••••"
                />
                {
                  showPassword ? (
                    <EyeOff className='w-5 h-5 text-gray-400 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                  ) : (
                    <Eye className='w-5 h-5 text-gray-400 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                  )
                }
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogin}
              disabled={loader}
              className="w-full curosr-pointer bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition-colors duration-300 font-semibold"
            >
              {loader ? "Logging in..." : "Login as Super Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AnalyticsDashboard bookings={bookings} mechanics={mechanics} services={services} />;
      case 'mechanics':
        return <MechanicsManagement mechanics={mechanics} setMechanics={setMechanics} addNotification={addNotification} />;
      case 'bookings':
        return <BookingsManagement 
          bookings={bookings} 
          setBookings={setBookings} 
          mechanics={mechanics} 
          addNotification={addNotification} 
          newBookingIds={newBookingIds}
        />;
      case 'spare-parts':
        return <SparePartsManagement spareParts={sparePartRequests} setSpareParts={setSparePartRequests} addNotification={addNotification} />;
      case 'customers':
        return <CustomersManagement customers={customers} setCustomers={setCustomers} addNotification={addNotification} />;
      case 'services':
        return <ServicesManagement services={services} setServices={setServices} addNotification={addNotification} />;
      case 'analytics':
        return <AnalyticsDashboard bookings={bookings} mechanics={mechanics} services={services} />;
      case 'carousel':
        return <CarouselManager />;
      case 'notifications':
        return <NotificationsPanel notifications={notifications} setNotifications={setNotifications} />;
      default:
        return <AnalyticsDashboard bookings={bookings} mechanics={mechanics} services={services} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 bg-white h-12 rounded-xl flex items-center justify-center">
                <img src='/logo.png' alt='logo' />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Super Admin Dashboard</h1>
                <p className="text-gray-400 text-sm">Complete System Control Panel</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
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

              {/* Admin Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-white font-medium">Super Admin</p>
                  <p className="text-gray-400 text-sm">Administrator</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:block">Logout</span>
              </button>
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

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">System Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Active Mechanics</span>
                    <span className="text-green-400 font-semibold">{dashboardStats.activeMechanics}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Services Today</span>
                    <span className="text-orange-400 font-semibold">{dashboardStats.servicesInProgress}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Pending Requests</span>
                    <span className="text-amber-400 font-semibold">{dashboardStats.pendingSpareRequests}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 lg:p-8">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component with shadcn/ui
const OverviewTab = ({ stats, bookings, notifications, analyticsData, loading }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold text-sm">{label}</p>
          <p className="text-orange-500 text-sm">
            Revenue: <IndianRupee className="inline h-3 w-3" />
            {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold text-sm">{payload[0].name}</p>
          <p className="text-orange-500 text-sm">
            {payload[0].value}% ({payload[0].payload.count} bookings)
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Complete system performance and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Mechanics</p>
              <p className="text-3xl font-bold mt-2">{stats.totalMechanics}</p>
              <p className="text-green-500 text-sm mt-1">{stats.activeMechanics} active</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Bookings</p>
              <p className="text-3xl font-bold mt-2">{stats.totalBookings}</p>
              <p className="text-green-500 text-sm mt-1">{stats.completedBookings} completed</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">
                <IndianRupee className="inline h-5 w-5" />
                {stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-orange-500 text-sm mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending Requests</p>
              <p className="text-3xl font-bold text-purple-500 mt-2">{stats.pendingSpareRequests}</p>
              <p className="text-muted-foreground text-sm mt-1">Spare parts</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Customers</p>
              <p className="text-2xl font-bold mt-2">{stats.totalCustomers}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Active Services</p>
              <p className="text-2xl font-bold mt-2">{stats.totalServices}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Today's Revenue</p>
              <p className="text-2xl font-bold text-green-500 mt-2">
                <IndianRupee className="inline h-4 w-4" />
                {analyticsData?.overview.todayRevenue.toLocaleString() || '0'}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-card rounded-2xl p-6 border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData?.charts.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                />
                <YAxis
                  className="text-xs"
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ fill: '#f97316' }}
                  activeDot={{ r: 6, fill: '#f97316' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="bg-card rounded-2xl p-6 border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Service Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={analyticsData?.charts.serviceDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) =>
                    `${percentage?.toFixed(1) || '0'}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {(analyticsData?.charts.serviceDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-2xl p-6 border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <span className="text-sm text-muted-foreground">
            {notifications.length} notifications
          </span>
        </div>
        <div className="space-y-4">
          {notifications.slice(0, 5).map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notification.type === 'mechanic' ? 'bg-blue-500/20' :
                  notification.type === 'spare-part' ? 'bg-purple-500/20' :
                    'bg-orange-500/20'
                  }`}>
                  <Bell className={`w-5 h-5 ${notification.type === 'mechanic' ? 'text-blue-500' :
                    notification.type === 'spare-part' ? 'text-purple-500' :
                      'text-orange-500'
                    }`} />
                </div>
                <div>
                  <h4 className="font-semibold">{notification.message}</h4>
                  <p className="text-muted-foreground text-sm">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recent notifications</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-card rounded-2xl p-6 border shadow-sm">
        <h3 className="text-xl font-semibold mb-6">Recent Bookings</h3>
        <div className="space-y-4">
          {bookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Car className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold">{booking.customer.name}</h4>
                  <p className="text-muted-foreground text-sm">
                    {booking.vehicle.model} • {booking.serviceType}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  <IndianRupee className="inline h-3 w-3" />
                  {booking.amount}
                </p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${booking.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                  booking.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                  {booking.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SuperAdminDashboard;