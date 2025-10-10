import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    Chip
} from '@mui/material';
import {
    Delete,
    Notifications
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const NotificationsPanel = ({ notifications, setNotifications }) => {
    // Clear all notifications
    const clearAllNotifications = () => {
        setNotifications([]);
    };

    // Mark notification as read
    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    // Get notification color based on type
    const getNotificationColor = (type) => {
        switch (type) {
            case 'mechanic': return 'blue';
            case 'spare-part': return 'purple';
            case 'booking': return 'green';
            case 'service': return 'orange';
            default: return 'grey';
        }
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'mechanic': return '👨‍🔧';
            case 'spare-part': return '📦';
            case 'booking': return '📅';
            case 'service': return '🛠️';
            default: return '🔔';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
                    <p className="text-gray-400">System alerts and announcements</p>
                </div>
                {notifications.length > 0 && (
                    <Button
                        variant="contained"
                        startIcon={<Delete />}
                        onClick={clearAllNotifications}
                        sx={{
                            bgcolor: 'red.600',
                            '&:hover': { bgcolor: 'red.700' }
                        }}
                    >
                        Clear All
                    </Button>
                )}
            </div>

            {notifications.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {notifications.slice(0, 10).map((notification) => (
                        <Card
                            key={notification.id}
                            sx={{
                                bgcolor: 'grey.800',
                                border: '1px solid',
                                borderColor: notification.read ? 'grey.700' : 'orange.500',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    bgcolor: 'grey.700',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '10px',
                                            bgcolor: `${getNotificationColor(notification.type)}.500`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '20px',
                                            flexShrink: 0
                                        }}
                                    >
                                        {getNotificationIcon(notification.type)}
                                    </Box>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="body1"
                                            color="white"
                                            sx={{
                                                fontWeight: notification.read ? 'normal' : 'bold',
                                                mb: 1
                                            }}
                                        >
                                            {notification.message}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Chip
                                                label={notification.type.replace('-', ' ')}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${getNotificationColor(notification.type)}.500`,
                                                    color: 'white',
                                                    textTransform: 'capitalize'
                                                }}
                                            />
                                            <Typography variant="caption" color="grey.400">
                                                {new Date(notification.timestamp).toLocaleDateString()} at {' '}
                                                {new Date(notification.timestamp).toLocaleTimeString()}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {!notification.read && (
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: 'orange.500',
                                                flexShrink: 0
                                            }}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Card sx={{ bgcolor: 'grey.800', borderRadius: '12px', textAlign: 'center', py: 8 }}>
                    <CardContent>
                        <Notifications
                            sx={{
                                fontSize: 64,
                                color: 'grey.500',
                                mb: 2
                            }}
                        />
                        <Typography variant="h6" color="grey.400" gutterBottom>
                            No Notifications
                        </Typography>
                        <Typography variant="body2" color="grey.500">
                            You're all caught up! New alerts will appear here.
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </motion.div>
    );
};

export default NotificationsPanel;