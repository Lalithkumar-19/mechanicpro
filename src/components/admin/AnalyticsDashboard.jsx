import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid
} from '@mui/material';
import {
    TrendingUp,
    Download
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AnalyticsDashboard = ({ bookings, mechanics, services }) => {
    // Calculate analytics data
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const todayRevenue = bookings
        .filter(booking => booking.dateTime.includes('2024-01-15'))
        .reduce((sum, booking) => sum + booking.amount, 0);

    const monthlyRevenue = [
        { month: 'Jan', revenue: 125000 },
        { month: 'Feb', revenue: 145000 },
        { month: 'Mar', revenue: 110000 },
        { month: 'Apr', revenue: 165000 },
        { month: 'May', revenue: 155000 },
        { month: 'Jun', revenue: 185000 }
    ];

    const serviceDistribution = [
        { name: 'General Service', value: 45 },
        { name: 'AC Repair', value: 25 },
        { name: 'Engine Repair', value: 15 },
        { name: 'Brake Service', value: 10 },
        { name: 'Others', value: 5 }
    ];

    const COLORS = ['#f97316', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

    // Custom tooltip style
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}>
                    <Typography color="white" fontWeight="bold" fontSize="14px">
                        {label}
                    </Typography>
                    <Typography color="#f97316" fontSize="13px">
                        Revenue: ₹{payload[0].value.toLocaleString()}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    const PieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}>
                    <Typography color="white" fontWeight="bold" fontSize="14px">
                        {payload[0].name}
                    </Typography>
                    <Typography color="#f97316" fontSize="13px">
                        {payload[0].value}%
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    // Export functionality
    const handleExportExcel = () => {
        alert('Exporting to Excel... This would download an Excel file in a real application.');
    };

    const handleExportPDF = () => {
        alert('Exporting to PDF... This would download a PDF file in a real application.');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 p-6"
        >
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h2>
                <p className="text-gray-400">Detailed insights and performance metrics</p>
            </div>

            {/* Revenue Overview */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{
                        bgcolor: '#1f2937',
                        borderRadius: '12px',
                        border: '1px solid #374151',
                        '&:hover': {
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                        }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Typography color="#9ca3af" variant="body2">Today's Revenue</Typography>
                                    <Typography variant="h4" color="white" sx={{ mt: 1 }}>
                                        ₹{todayRevenue.toLocaleString()}
                                    </Typography>
                                    <Typography color="#34d399" variant="body2" sx={{ mt: 1 }}>
                                        +12% from yesterday
                                    </Typography>
                                </div>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        bgcolor: '#065f46',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#34d399'
                                    }}
                                >
                                    <TrendingUp />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{
                        bgcolor: '#1f2937',
                        borderRadius: '12px',
                        border: '1px solid #374151',
                        '&:hover': {
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                        }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Typography color="#9ca3af" variant="body2">This Month</Typography>
                                    <Typography variant="h4" color="white" sx={{ mt: 1 }}>
                                        ₹{monthlyRevenue[5].revenue.toLocaleString()}
                                    </Typography>
                                    <Typography color="#34d399" variant="body2" sx={{ mt: 1 }}>
                                        +8% from last month
                                    </Typography>
                                </div>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        bgcolor: '#1e3a8a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#60a5fa'
                                    }}
                                >
                                    <TrendingUp />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{
                        bgcolor: '#1f2937',
                        borderRadius: '12px',
                        border: '1px solid #374151',
                        '&:hover': {
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                        }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Typography color="#9ca3af" variant="body2">Total Revenue</Typography>
                                    <Typography variant="h4" color="white" sx={{ mt: 1 }}>
                                        ₹{totalRevenue.toLocaleString()}
                                    </Typography>
                                    <Typography color="#34d399" variant="body2" sx={{ mt: 1 }}>
                                        +15% from last year
                                    </Typography>
                                </div>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        bgcolor: '#581c87',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#a78bfa'
                                    }}
                                >
                                    <TrendingUp />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <Card sx={{
                        bgcolor: '#1f2937',
                        borderRadius: '12px',
                        p: 3,
                        border: '1px solid #374151'
                    }}>
                        <Typography variant="h6" color="white" gutterBottom fontWeight="bold">
                            Monthly Revenue Trend
                        </Typography>
                        <Box sx={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#9ca3af"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#f97316"
                                        strokeWidth={3}
                                        dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, fill: '#f97316' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Card sx={{
                        bgcolor: '#1f2937',
                        borderRadius: '12px',
                        p: 3,
                        border: '1px solid #374151'
                    }}>
                        <Typography variant="h6" color="white" gutterBottom fontWeight="bold">
                            Service Distribution
                        </Typography>
                        <Box sx={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={serviceDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={100}
                                        innerRadius={40}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {serviceDistribution.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke="#1f2937"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<PieTooltip />} />
                                    <Legend
                                        wrapperStyle={{
                                            color: 'white',
                                            fontSize: '12px',
                                            paddingTop: '20px'
                                        }}
                                        formatter={(value) => (
                                            <span style={{ color: '#e5e7eb', fontSize: '12px' }}>
                                                {value}
                                            </span>
                                        )}
                                    />
                                </RePieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Export Section */}
            <Card sx={{
                bgcolor: '#1f2937',
                borderRadius: '12px',
                p: 3,
                border: '1px solid #374151'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Typography variant="h6" color="white" gutterBottom fontWeight="bold">
                            Export Reports
                        </Typography>
                        <Typography color="#9ca3af" variant="body2">
                            Download detailed analytics reports in various formats
                        </Typography>
                    </div>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={handleExportExcel}
                            sx={{
                                bgcolor: '#059669',
                                '&:hover': {
                                    bgcolor: '#047857',
                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                                }
                            }}
                        >
                            Export Excel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={handleExportPDF}
                            sx={{
                                bgcolor: '#dc2626',
                                '&:hover': {
                                    bgcolor: '#b91c1c',
                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                                }
                            }}
                        >
                            Export PDF
                        </Button>
                    </Box>
                </Box>
            </Card>
        </motion.div>
    );
};

export default AnalyticsDashboard;