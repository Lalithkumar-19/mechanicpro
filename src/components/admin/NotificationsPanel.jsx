import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Bell,
  Trash2,
  CheckCircle,
  CheckCheck,
  Wrench,
  Package,
  Calendar,
  Settings,
  User,
  MoreVertical,
  Loader2,
  TrendingUp,
  AlertTriangle,
  MessageCircle,
  Star
} from 'lucide-react';
import axiosInstance from '../../utils/adminaxios';

const NotificationsPanel = ({ notifications, setNotifications }) => {
  const [loading, setLoading] = useState(true);
  const [clearAllDialog, setClearAllDialog] = useState(false);
  const [markAllReadDialog, setMarkAllReadDialog] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/admin/get-all-notifications");
      if (data.success) {
        setNotifications(data.data);
      } else {
        toast.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      const { data } = await axiosInstance.delete("/admin/clear-all-notifications");
      if (data.success) {
        setNotifications([]);
        toast.success('All notifications cleared');
        setClearAllDialog(false);
      } else {
        toast.error('Failed to clear notifications');
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Error clearing notifications');
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/mark-as-read/${notificationId}`);
      if (data.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Error marking notification as read');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { data } = await axiosInstance.patch("/admin/mark-all-read");
      if (data.success) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
        toast.success('All notifications marked as read');
        setMarkAllReadDialog(false);
      } else {
        toast.error('Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Error marking all notifications as read');
    }
  };

  // Delete single notification
  const deleteNotification = async (notificationId) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/delete-notification/${notificationId}`);
      if (data.success) {
        setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
        toast.success('Notification deleted');
      } else {
        toast.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Error deleting notification');
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const iconClass = "h-4 w-4";
    
    switch (type) {
      case 'mechanic':
        return <Wrench className={iconClass} />;
      case 'spare-part':
        return <Package className={iconClass} />;
      case 'booking':
        return <Calendar className={iconClass} />;
      case 'service':
        return <Settings className={iconClass} />;
      case 'customer':
        return <User className={iconClass} />;
      case 'system':
        return <TrendingUp className={iconClass} />;
      case 'revenue':
        return <Star className={iconClass} />;
      case 'alert':
        return <AlertTriangle className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'mechanic':
        return 'text-blue-400';
      case 'spare-part':
        return 'text-purple-400';
      case 'booking':
        return 'text-emerald-400';
      case 'service':
        return 'text-amber-400';
      case 'customer':
        return 'text-cyan-400';
      case 'system':
        return 'text-gray-400';
      case 'revenue':
        return 'text-green-400';
      case 'alert':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Get notification background color based on type
  const getNotificationBgColor = (type) => {
    switch (type) {
      case 'mechanic':
        return 'bg-blue-500/10';
      case 'spare-part':
        return 'bg-purple-500/10';
      case 'booking':
        return 'bg-emerald-500/10';
      case 'service':
        return 'bg-amber-500/10';
      case 'customer':
        return 'bg-cyan-500/10';
      case 'system':
        return 'bg-gray-500/10';
      case 'revenue':
        return 'bg-green-500/10';
      case 'alert':
        return 'bg-red-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-400">Loading notifications...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Notifications</h2>
          <p className="text-sm text-white mt-1">Recent system activities</p>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-2 text-black">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMarkAllReadDialog(true)}
                className="gap-2 cursor-pointer  text-black"
              >
                <CheckCheck className="h-3 w-3" />
                Mark All Read
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClearAllDialog(true)}
              className="gap-2 border-gray-700  cursor-pointer  text-black"
            >
              <Trash2 className="h-3 w-3" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-gray-800">
            <div className="text-2xl font-semibold text-white ">{notifications.length}</div>
            <div className="text-xs text-white">Total</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-gray-800">
            <div className="text-2xl font-semibold text-amber-400">{unreadCount}</div>
            <div className="text-xs text-white">Unread</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-gray-800">
            <div className="text-2xl font-semibold text-blue-400">
              {notifications.filter(n => n.priority === 'urgent').length}
            </div>
            <div className="text-xs text-white">Urgent</div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative rounded-lg border transition-all duration-200 hover:border-gray-600 ${
                !notification.read 
                  ? 'border-amber-500/30 bg-amber-500/5' 
                  : 'border-gray-800 bg-gray-900/30'
              }`}
            >
              <div className="p-3">
                <div className="flex items-start gap-3">
                  {/* Notification Icon */}
                  <div className={`p-2 rounded-lg ${getNotificationBgColor(notification.type)}`}>
                    <div className={getNotificationColor(notification.type)}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className={`text-sm leading-snug ${
                        !notification.read ? 'text-white font-medium' : 'text-gray-300'
                      }`}>
                        {notification.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-1.5 py-0 h-5 bg-gray-800 text-gray-300 border-gray-700 capitalize"
                      >
                        {notification.type.replace('-', ' ')}
                      </Badge>
                      
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notification.createdAt)}
                      </span>

                      {notification.priority === 'urgent' && (
                        <Badge className="text-xs px-1.5 py-0 h-5 bg-red-500/20 text-red-400 border-red-500/30">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-3.5 w-3.5 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-gray-900 border-gray-700">
                      {!notification.read && (
                        <DropdownMenuItem 
                          onClick={() => markAsRead(notification._id)}
                          className="text-sm text-gray-300 hover:bg-gray-800"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-2" />
                          Mark Read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => deleteNotification(notification._id)}
                        className="text-sm text-red-400 hover:bg-gray-800"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Unread Indicator */}
              {!notification.read && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-amber-400 rounded-full" />
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="border-gray-800 bg-gray-900/30">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              No Notifications
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              You're all caught up! System alerts and updates will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Clear All Dialog */}
      <AlertDialog open={clearAllDialog} onOpenChange={setClearAllDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Clear All Notifications?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete all {notifications.length} notifications. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={clearAllNotifications}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mark All Read Dialog */}
      <AlertDialog open={markAllReadDialog} onOpenChange={setMarkAllReadDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Mark All as Read?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will mark all {unreadCount} unread notifications as read.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={markAllAsRead}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Mark All Read
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default NotificationsPanel;