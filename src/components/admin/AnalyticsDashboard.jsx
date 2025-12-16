import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Download,
  Users,
  Wrench,
  Calendar,
  Car,
  IndianRupee,
  Loader2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axiosInstance from '../../utils/adminaxios';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Colors for charts
  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'];

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/admin/analytics/dashboard-analytics");
      if (data.success) {
        setAnalyticsData(data.data);
      } else {
        toast.error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Error fetching analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Handle export
  const handleExport = async (format) => {
    try {
      setExporting(true);
      const { data } = await axiosInstance.get(`/admin/analytics/export-analytics?format=${format}`);
      if (data.success) {
        toast.success(data.message);
        // In a real app, you would trigger download here
        console.log('Export data:', data);
      } else {
        toast.error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error exporting data');
    } finally {
      setExporting(false);
    }
  };

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold text-sm">{label}</p>
          <p className="text-orange-500 text-sm">
            Revenue: <IndianRupee className="inline h-3 w-3" />
            {payload[0].value.toLocaleString()}
          </p>
          {payload[1] && (
            <p className="text-blue-500 text-sm">
              Bookings: {payload[1].value}
            </p>
          )}
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading analytics...</span>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">No analytics data available</p>
          <Button onClick={fetchAnalyticsData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { overview, charts, recentActivities } = analyticsData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview Dashboard</h2>
          <p className="text-white mt-2">Real-time insights and performance metrics</p>
        </div>
        {/* <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            disabled={exporting}
            className="gap-2"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className="gap-2"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export PDF
          </Button>
        </div> */}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              <IndianRupee className="inline h-5 w-5" />
              {overview.todayRevenue.toLocaleString()}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              <IndianRupee className="inline h-5 w-5" />
              {overview.monthRevenue.toLocaleString()}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              +8% from last month
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {overview.totalBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              All time bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mechanics</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {overview.totalMechanics}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for service
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue and booking trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.monthlyRevenue}>
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="Revenue"
                    dot={{ fill: '#f97316' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Bookings"
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Service Distribution Chart */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>Popular services by booking percentage</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto overflow-x-hidden p-4">
            <div className="h-[600px] min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.serviceDistribution}
                    cx="50%"
                    cy="35%"
                    labelLine={false}
                    label={({ name, percentage }) =>
                      `${percentage.toFixed(1)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {charts.serviceDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: "20px" }}
                    layout="horizontal"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalServices}</div>
            <p className="text-xs text-muted-foreground">Available services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              <IndianRupee className="inline h-5 w-5" />
              {overview.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest bookings and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Car className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.vehicle.make} {activity.vehicle.model} • {activity.serviceType}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    <IndianRupee className="inline h-3 w-3" />
                    {activity.amount}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalyticsDashboard;