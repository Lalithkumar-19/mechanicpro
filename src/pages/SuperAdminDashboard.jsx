import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wrench, Calendar, Clock, CheckCircle, XCircle,
    Settings, User, Bell, Package, BarChart3, MessageCircle,
    MapPin, Phone, Mail, Car, Filter, Search, Star,
    TrendingUp, Users, DollarSign, AlertCircle, Edit3,
    Plus, Truck, Shield, Zap, Sparkles, Eye, ChevronLeft,
    ChevronRight, X, LogOut, Home, ShoppingCart, PieChart,
    Download, Upload, Trash2, MoreVertical, BarChart2,
    UserPlus, CreditCard, Shield as ShieldIcon, Activity
} from 'lucide-react';

// MUI Components
import {
    DataGrid,
    GridToolbar,
    GridActionsCellItem
} from '@mui/x-data-grid';
import {
    Box,
    Button,
    Modal,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    IconButton,
    Card,
    CardContent,
    Typography,
    Checkbox,
    FormControlLabel
} from '@mui/material';

// Chart components
import {
    BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Import Components
import MechanicsManagement from '../components/admin/MechanicsManagement';
import BookingsManagement from '../components/admin/BookingsManagement';
import SparePartsManagement from '../components/admin/SparePartsManagement';
import CustomersManagement from '../components/admin/CustomersManagement';
import ServicesManagement from '../components/admin/ServicesManagement';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import NotificationsPanel from '../components/admin/NotificationsPanel';

const SuperAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [notifications, setNotifications] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // Data states
    const [mechanics, setMechanics] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [sparePartRequests, setSparePartRequests] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);

    // Sample data initialization
    useEffect(() => {
        // Sample mechanics data
        const sampleMechanics = [
            {
                id: 'M001',
                name: 'Raj Auto Works',
                email: 'raj@autoworks.com',
                phone: '+91 98765 43210',
                location: {
                    state: 'Maharashtra',
                    city: 'Mumbai',
                    street: 'Linking Road, Bandra West',
                    pincode: '400050',
                    latitude: '19.0760',
                    longitude: '72.8777'
                },
                rating: 4.5,
                services: ['General Service', 'AC Repair', 'Brake Service'],
                isActive: true,
                totalBookings: 45,
                joinedDate: '2023-01-15',
                profilePic: null
            },
            {
                id: 'M002',
                name: 'Premium Car Care',
                email: 'premium@carcare.com',
                phone: '+91 98765 43211',
                location: {
                    state: 'Delhi',
                    city: 'New Delhi',
                    street: 'Connaught Place',
                    pincode: '110001',
                    latitude: '28.6139',
                    longitude: '77.2090'
                },
                rating: 4.8,
                services: ['Engine Repair', 'Transmission', 'Electrical'],
                isActive: true,
                totalBookings: 78,
                joinedDate: '2023-03-20',
                profilePic: null
            },
            {
                id: 'M003',
                name: 'City Auto Service',
                email: 'city@autoservice.com',
                phone: '+91 98765 43212',
                location: {
                    state: 'Karnataka',
                    city: 'Bangalore',
                    street: 'MG Road',
                    pincode: '560001',
                    latitude: '12.9716',
                    longitude: '77.5946'
                },
                rating: 4.2,
                services: ['General Service', 'Tire Replacement', 'Battery Service'],
                isActive: false,
                totalBookings: 23,
                joinedDate: '2023-06-10',
                profilePic: null
            }
        ];

        // Sample bookings data
        const sampleBookings = [
            {
                id: 'BK001',
                customer: { name: 'Raj Sharma', phone: '+91 98765 43210' },
                vehicle: { model: 'Honda City', year: '2022', registration: 'MH01AB1234' },
                dateTime: '2024-01-15 10:00 AM',
                status: 'completed',
                amount: 3999,
                serviceType: 'General Service',
                mechanic: { id: 'M001', name: 'Raj Auto Works' },
                spareParts: ['Oil Filter', 'Air Filter'],
                paymentStatus: 'paid'
            },
            {
                id: 'BK002',
                customer: { name: 'Priya Patel', phone: '+91 98765 43211' },
                vehicle: { model: 'Hyundai Creta', year: '2021', registration: 'MH01CD5678' },
                dateTime: '2024-01-15 11:30 AM',
                status: 'in-progress',
                amount: 2499,
                serviceType: 'AC Service',
                mechanic: { id: 'M002', name: 'Premium Car Care' },
                spareParts: ['AC Compressor'],
                paymentStatus: 'paid'
            },
            {
                id: 'BK003',
                customer: { name: 'Amit Kumar', phone: '+91 98765 43212' },
                vehicle: { model: 'Maruti Swift', year: '2020', registration: 'MH01EF9012' },
                dateTime: '2024-01-16 02:00 PM',
                status: 'confirmed',
                amount: 4499,
                serviceType: 'Brake Service',
                mechanic: { id: 'M001', name: 'Raj Auto Works' },
                spareParts: ['Brake Pads'],
                paymentStatus: 'pending'
            }
        ];

        // Sample spare parts data
        const sampleSpareParts = [
            {
                id: 'SP001',
                mechanic: { id: 'M001', name: 'Raj Auto Works' },
                serviceId: 'BK003',
                partName: 'Brake Pads Set',
                carModel: 'Maruti Swift',
                year: '2020',
                status: 'pending',
                requestedAt: new Date(),
                quantity: 2,
                urgency: 'high'
            },
            {
                id: 'SP002',
                mechanic: { id: 'M002', name: 'Premium Car Care' },
                serviceId: 'BK002',
                partName: 'AC Compressor',
                carModel: 'Hyundai Creta',
                year: '2021',
                status: 'approved',
                requestedAt: new Date(Date.now() - 86400000),
                quantity: 1,
                urgency: 'medium'
            },
            {
                id: 'SP003',
                mechanic: { id: 'M003', name: 'City Auto Service' },
                serviceId: 'BK004',
                partName: 'Engine Oil Filter',
                carModel: 'Toyota Innova',
                year: '2019',
                status: 'dispatched',
                requestedAt: new Date(Date.now() - 172800000),
                quantity: 1,
                urgency: 'low'
            }
        ];

        // Sample customers data
        const sampleCustomers = [
            {
                id: 'C001',
                name: 'Raj Sharma',
                email: 'raj.sharma@email.com',
                phone: '+91 98765 43210',
                totalBookings: 5,
                totalSpent: 18500,
                lastService: '2024-01-15',
                joinDate: '2023-05-10',
                isBlocked: false
            },
            {
                id: 'C002',
                name: 'Priya Patel',
                email: 'priya.patel@email.com',
                phone: '+91 98765 43211',
                totalBookings: 3,
                totalSpent: 11200,
                lastService: '2024-01-15',
                joinDate: '2023-08-22',
                isBlocked: false
            },
            {
                id: 'C003',
                name: 'Amit Kumar',
                email: 'amit.kumar@email.com',
                phone: '+91 98765 43212',
                totalBookings: 7,
                totalSpent: 23400,
                lastService: '2024-01-14',
                joinDate: '2023-03-15',
                isBlocked: true
            }
        ];

        // Sample services data
        const sampleServices = [
            {
                id: 'S001',
                name: 'General Service',
                description: 'Complete vehicle inspection and maintenance',
                basePrice: 1999,
                estimatedDuration: '2 hours',
                category: 'Maintenance',
                isActive: true
            },
            {
                id: 'S002',
                name: 'AC Repair',
                description: 'Air conditioning system repair and gas refill',
                basePrice: 2499,
                estimatedDuration: '3 hours',
                category: 'AC',
                isActive: true
            },
            {
                id: 'S003',
                name: 'Engine Repair',
                description: 'Complete engine diagnostics and repair',
                basePrice: 5999,
                estimatedDuration: '6 hours',
                category: 'Engine',
                isActive: false
            }
        ];

        setMechanics(sampleMechanics);
        setBookings(sampleBookings);
        setSparePartRequests(sampleSpareParts);
        setCustomers(sampleCustomers);
        setServices(sampleServices);

        // Sample notifications
        setNotifications([
            {
                id: 1,
                message: 'New mechanic registration: City Auto Works',
                type: 'mechanic',
                timestamp: new Date(Date.now() - 300000),
                read: false
            },
            {
                id: 2,
                message: 'Spare part request requires approval',
                type: 'spare-part',
                timestamp: new Date(Date.now() - 1800000),
                read: false
            }
        ]);
    }, []);

    // Authentication
    const handleLogout = () => {
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

    // Dashboard stats
    const dashboardStats = {
        totalMechanics: mechanics.length,
        activeMechanics: mechanics.filter(m => m.isActive).length,
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        totalRevenue: bookings.reduce((sum, booking) => sum + booking.amount, 0),
        pendingSpareRequests: sparePartRequests.filter(s => s.status === 'pending').length,
        servicesInProgress: bookings.filter(b => b.status === 'in-progress').length
    };

    // Tabs configuration
    const tabs = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'mechanics', label: 'Mechanics', icon: Users },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'spare-parts', label: 'Spare Parts', icon: Package },
        { id: 'customers', label: 'Customers', icon: User },
        { id: 'services', label: 'Services', icon: Settings },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'notifications', label: 'Notifications', icon: Bell }
    ];

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
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <label className="text-gray-300 text-sm mb-2 block">Password</label>
                            <input
                                type="password"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsLoggedIn(true)}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition-colors duration-300 font-semibold"
                        >
                            Login as Super Admin
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
                return <OverviewTab stats={dashboardStats} mechanics={mechanics} bookings={bookings} notifications={notifications} />;
            case 'mechanics':
                return <MechanicsManagement mechanics={mechanics} setMechanics={setMechanics} addNotification={addNotification} />;
            case 'bookings':
                return <BookingsManagement bookings={bookings} setBookings={setBookings} mechanics={mechanics} addNotification={addNotification} />;
            case 'spare-parts':
                return <SparePartsManagement spareParts={sparePartRequests} setSpareParts={setSparePartRequests} addNotification={addNotification} />;
            case 'customers':
                return <CustomersManagement customers={customers} setCustomers={setCustomers} addNotification={addNotification} />;
            case 'services':
                return <ServicesManagement services={services} setServices={setServices} addNotification={addNotification} />;
            case 'analytics':
                return <AnalyticsDashboard bookings={bookings} mechanics={mechanics} services={services} />;
            case 'notifications':
                return <NotificationsPanel notifications={notifications} setNotifications={setNotifications} />;
            default:
                return <OverviewTab stats={dashboardStats} mechanics={mechanics} bookings={bookings} notifications={notifications} />;
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

// Overview Tab Component
const OverviewTab = ({ stats, mechanics, bookings, notifications }) => {
    // Analytics Data (sample)
    const revenueData = [
        { date: 'Jan', revenue: 125000 },
        { date: 'Feb', revenue: 145000 },
        { date: 'Mar', revenue: 110000 },
        { date: 'Apr', revenue: 165000 },
        { date: 'May', revenue: 155000 },
        { date: 'Jun', revenue: 185000 }
    ];

    const serviceRevenueData = [
        { name: 'General Service', value: 45 },
        { name: 'AC Repair', value: 25 },
        { name: 'Engine Repair', value: 15 },
        { name: 'Brake Service', value: 10 },
        { name: 'Others', value: 5 }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
                <p className="text-gray-400">Complete system performance and analytics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Mechanics</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalMechanics}</p>
                            <p className="text-green-400 text-sm mt-1">{stats.activeMechanics} active</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Bookings</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalBookings}</p>
                            <p className="text-green-400 text-sm mt-1">{stats.completedBookings} completed</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold text-white mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
                            <p className="text-orange-400 text-sm mt-1">All time</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-orange-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Pending Requests</p>
                            <p className="text-3xl font-bold text-purple-400 mt-2">{stats.pendingSpareRequests}</p>
                            <p className="text-gray-400 text-sm mt-1">Spare parts</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                                    labelStyle={{ color: '#F3F4F6' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#F97316"
                                    strokeWidth={2}
                                    dot={{ fill: '#F97316' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Distribution */}
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Revenue by Service</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={serviceRevenueData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {serviceRevenueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                                />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                </div>
                <div className="space-y-4">
                    {notifications.slice(0, 5).map((notification) => (
                        <div key={notification.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notification.type === 'mechanic' ? 'bg-blue-500/20' :
                                    notification.type === 'spare-part' ? 'bg-purple-500/20' :
                                        'bg-orange-500/20'
                                    }`}>
                                    <Bell className={`w-5 h-5 ${notification.type === 'mechanic' ? 'text-blue-400' :
                                        notification.type === 'spare-part' ? 'text-purple-400' :
                                            'text-orange-400'
                                        }`} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">{notification.message}</h4>
                                    <p className="text-gray-400 text-sm">
                                        {notification.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            {!notification.read && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default SuperAdminDashboard;