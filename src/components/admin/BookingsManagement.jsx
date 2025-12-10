import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Play,
  Plus,
  MoreHorizontal,
  User,
  Car,
  Wrench,
} from 'lucide-react';
import axiosInstance from '../../utils/adminaxios';

const BookingsManagement = ({ addNotification }) => {
  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mechanicsLoading, setMechanicsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [reassignModal, setReassignModal] = useState({ open: false, bookingId: null });
  const [addBookingModal, setAddBookingModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ open: false, bookingId: null });

  const [newBooking, setNewBooking] = useState({
    customer: {
      name: '',
      phone: '',
      email: ''
    },
    vehicle: {
      make: '',
      model: '',
      year: '',
      plateNumber: ''
    },
    serviceType: '',
    dateTime: '',
    amount: '',
    spareParts: [],
    notes: ''
  });

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/booking/get-all-bookings");
      console.log('Bookings API Response:', res.data);

      if (res.status === 200) {
        let bookingsData = [];

        if (Array.isArray(res.data)) {
          bookingsData = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          bookingsData = res.data.data;
        }

        if (bookingsData.length > 0) {
          setBookings(bookingsData);
        } else {
          setBookings([]);
          showToast('No bookings found', 'info');
        }
      } else {
        showToast('Failed to fetch bookings', 'error');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast('Error fetching bookings: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch mechanics
  const fetchMechanics = async () => {
    try {
      setMechanicsLoading(true);
      const res = await axiosInstance.get("/admin/mechanic/get-all-mechanics");
      if (res.status === 200 && res.data && Array.isArray(res.data.data)) {
        setMechanics(res.data.data);
      } else if (res.status === 200 && Array.isArray(res.data)) {
        setMechanics(res.data);
      } else {
        setMechanics([]);
      }
    } catch (error) {
      console.error('Error fetching mechanics:', error);
      setMechanics([]);
    } finally {
      setMechanicsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchMechanics();
  }, []);

  const showToast = (message, type = 'default') => {
    switch (type) {
      case 'error':
        toast.error(message);
        break;
      case 'success':
        toast.success(message);
        break;
      case 'info':
        toast.info(message);
        break;
      default:
        toast(message);
    }
  };

  // Handle Booking Actions
  const handleBookingAction = async (bookingId, action) => {
    try {
      console.log('Handling booking action:', { bookingId, action });
      const res = await axiosInstance.put("/admin/booking/handle-booking-action", {
        bookingId: bookingId,
        action
      });

      if (res.status === 200) {
        setBookings(prev => prev.map(booking =>
          booking._id === bookingId ? res.data.data : booking
        ));

        let message = '';
        switch (action) {
          case 'accept': message = 'Booking accepted'; break;
          case 'decline': message = 'Booking declined'; break;
          case 'start': message = 'Service started'; break;
          case 'complete': message = 'Service completed'; break;
          case 'cancel': message = 'Booking cancelled'; break;
          default: return;
        }

        addNotification(`${message} for booking ${bookingId}`, 'booking');
        showToast(message, 'success');
      } else {
        showToast(res.data?.message || 'Failed to perform action', 'error');
      }
    } catch (error) {
      console.error('Error performing booking action:', error);
      showToast('Error performing booking action: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  // Update Booking Status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await axiosInstance.put("/admin/booking/update-booking-status", {
        bookingId: bookingId,
        status: newStatus
      });

      if (res.data && res.data.success) {
        setBookings(prev => prev.map(booking =>
          booking._id === bookingId ? res.data.data : booking
        ));

        addNotification(`Booking ${bookingId} status updated to ${newStatus}`, 'booking');
        showToast('Booking status updated successfully', 'success');
      } else {
        showToast(res.data?.message || 'Failed to update booking status', 'error');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      showToast('Error updating booking status: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  // Reassign Mechanic
  const reassignMechanic = async (bookingId, newMechanicId) => {
    try {
      const res = await axiosInstance.put("/admin/booking/reassign-mechanic", {
        bookingId: bookingId,
        mechanicId: newMechanicId
      });

      if (res.data && res.data.success) {
        setBookings(prev => prev.map(booking =>
          booking._id === bookingId ? res.data.data : booking
        ));

        const mechanic = mechanics.find(m => m._id === newMechanicId);
        addNotification(`Booking ${bookingId} reassigned to ${mechanic?.name || 'mechanic'}`, 'booking');
        setReassignModal({ open: false, bookingId: null });
        showToast('Mechanic reassigned successfully', 'success');
      } else {
        showToast(res.data?.message || 'Failed to reassign mechanic', 'error');
      }
    } catch (error) {
      console.error('Error reassigning mechanic:', error);
      showToast('Error reassigning mechanic: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  // Add New Booking
  const handleAddBooking = async () => {
    try {
      if (!newBooking.customer.name || !newBooking.customer.phone ||
        !newBooking.vehicle.make || !newBooking.vehicle.model ||
        !newBooking.vehicle.plateNumber || !newBooking.serviceType ||
        !newBooking.dateTime || !newBooking.amount) {
        showToast('Please fill all required fields', 'error');
        return;
      }

      // Prepare data for the new schema
      const bookingData = {
        customer: {
          name: newBooking.customer.name,
          phone: newBooking.customer.phone,
          email: newBooking.customer.email || ''
        },
        vehicle: {
          make: newBooking.vehicle.make,
          model: newBooking.vehicle.model,
          year: newBooking.vehicle.year || '',
          plateNumber: newBooking.vehicle.plateNumber
        },
        serviceType: newBooking.serviceType,
        dateTime: newBooking.dateTime,
        amount: parseFloat(newBooking.amount),
        spareParts: newBooking.spareParts || [],
        notes: newBooking.notes || ''
      };

      console.log('Sending booking data:', bookingData);

      const res = await axiosInstance.post("/admin/booking/create-booking", bookingData);

      if (res.data && res.data.success) {
        setBookings(prev => [res.data.data, ...prev]);
        setAddBookingModal(false);
        setNewBooking({
          customer: { name: '', phone: '', email: '' },
          vehicle: { make: '', model: '', year: '', plateNumber: '' },
          serviceType: '',
          dateTime: '',
          amount: '',
          spareParts: [],
          notes: ''
        });
        addNotification(`New booking created for ${res.data.data.customer.name}`, 'booking');
        showToast('Booking created successfully', 'success');
      } else {
        showToast(res.data?.message || 'Failed to create booking', 'error');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Error details:', error.response?.data);
      showToast('Error creating booking: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (bookingId) => {
    try {
      const res = await axiosInstance.delete(`/admin/booking/delete-booking/${bookingId}`);

      if (res.data && res.data.success) {
        setBookings(prev => prev.filter(booking => booking._id !== bookingId));
        addNotification('Booking deleted', 'booking');
        setDeleteConfirmModal({ open: false, bookingId: null });
        showToast('Booking deleted successfully', 'success');
      } else {
        showToast(res.data?.message || 'Failed to delete booking', 'error');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      showToast('Error deleting booking: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  // Format booking ID helper function
  const formatBookingId = (booking) => {
    if (!booking) return 'N/A';
    
    try {
      // Get vehicle plate number (remove spaces and convert to uppercase)
      const plateNumber = booking.vehicle?.plateNumber?.replace(/\s+/g, '').toUpperCase() || 'UNKNOWN';
      
      // Parse the scheduled date and format as DDMMYYYY
      const bookingDate = new Date(booking.dateTime);
      const day = bookingDate.getDate().toString().padStart(2, '0');
      const month = (bookingDate.getMonth() + 1).toString().padStart(2, '0');
      const year = bookingDate.getFullYear();
      
      return `${plateNumber}${day}${month}${year}`;
    } catch (error) {
      console.error('Error formatting booking ID:', error);
      return booking._id ? booking._id.slice(-6).toUpperCase() : 'N/A';
    }
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'in-progress': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Safe value getter
  const getSafeValue = (obj, path, defaultValue = 'N/A') => {
    try {
      const keys = path.split('.');
      let value = obj;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined || value === null) return defaultValue;
      }
      return value || defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };

  console.log("bookings", bookings);
  console.log("mechanics", mechanics);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Loading bookings...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings Management</h2>
          <p className="text-muted-foreground">Manage all service bookings</p>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>Total: {bookings.length}</span>
            <span>Pending: {bookings.filter(b => b.status === 'pending').length}</span>
            <span>In Progress: {bookings.filter(b => b.status === 'in-progress').length}</span>
            <span>Completed: {bookings.filter(b => b.status === 'completed').length}</span>
          </div>
        </div>
        <Button onClick={() => setAddBookingModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Booking
        </Button>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Mechanic</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell className="font-mono">
                    {formatBookingId(booking)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {booking.customer?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.customer?.phone || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {booking.vehicle?.make || ''} {booking.vehicle?.model || ''}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.vehicle?.plateNumber || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(booking.dateTime)}</TableCell>
                  <TableCell>{booking.serviceType || 'N/A'}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {booking.mechanic?.name || 'Not Assigned'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.mechanic?.rating ? `★ ${booking.mechanic.rating}` : 'No rating'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    ₹{booking.amount || '0'}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={booking.status || 'pending'}
                      onValueChange={(value) => updateBookingStatus(booking._id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <Badge variant={getStatusVariant(booking.status)}>
                            {booking.status || 'pending'}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <Badge variant="secondary">Pending</Badge>
                        </SelectItem>
                        <SelectItem value="confirmed">
                          <Badge variant="default">Confirmed</Badge>
                        </SelectItem>
                        <SelectItem value="in-progress">
                          <Badge variant="default">In Progress</Badge>
                        </SelectItem>
                        <SelectItem value="completed">
                          <Badge variant="default">Completed</Badge>
                        </SelectItem>
                        <SelectItem value="cancelled">
                          <Badge variant="destructive">Cancelled</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedBooking(booking);
                          setViewModal(true);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>

                        {/* Status-specific actions */}
                        {booking.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleBookingAction(booking._id, 'accept')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept Booking
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBookingAction(booking._id, 'decline')}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline Booking
                            </DropdownMenuItem>
                          </>
                        )}

                        {booking.status === 'confirmed' && (
                          <>
                            <DropdownMenuItem onClick={() => handleBookingAction(booking._id, 'start')}>
                              <Play className="h-4 w-4 mr-2" />
                              Start Service
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReassignModal({ open: true, bookingId: booking._id })}>
                              <Edit className="h-4 w-4 mr-2" />
                              Reassign Mechanic
                            </DropdownMenuItem>
                          </>
                        )}

                        {booking.status === 'in-progress' && (
                          <DropdownMenuItem onClick={() => handleBookingAction(booking._id, 'complete')}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </DropdownMenuItem>
                        )}

                        {/* Cancel button for active statuses */}
                        {['pending', 'confirmed', 'in-progress'].includes(booking.status) && (
                          <DropdownMenuItem onClick={() => handleBookingAction(booking._id, 'cancel')}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Booking
                          </DropdownMenuItem>
                        )}

                        {/* Delete button for completed/cancelled */}
                        {['completed', 'cancelled'].includes(booking.status) && (
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirmModal({ open: true, bookingId: booking._id })}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Booking
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {bookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">No bookings found</div>
              <Button
                onClick={() => setAddBookingModal(true)}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Your First Booking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={viewModal} onOpenChange={setViewModal}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Booking ID: <span className="font-mono font-semibold">{formatBookingId(selectedBooking)}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-2 -mr-2">
            {selectedBooking && (
              <div className="space-y-4 pb-4">
                {/* Add Booking ID Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Booking Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label className="text-sm text-muted-foreground">Booking ID</Label>
                      <p className="font-mono font-semibold text-lg">{formatBookingId(selectedBooking)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1.5">
                    <div>
                      <Label className="text-sm text-muted-foreground">Name</Label>
                      <p className="font-medium">{selectedBooking.customer?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Phone</Label>
                      <p className="font-medium">{selectedBooking.customer?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Email</Label>
                      <p className="font-medium">{selectedBooking.customer?.email || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Car className="h-5 w-5" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Make</Label>
                      <p className="font-medium">{selectedBooking.vehicle?.make || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Model</Label>
                      <p className="font-medium">{selectedBooking.vehicle?.model || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Year</Label>
                      <p className="font-medium">{selectedBooking.vehicle?.year || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Plate Number</Label>
                      <p className="font-medium">{selectedBooking.vehicle?.plateNumber || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Wrench className="h-5 w-5" />
                      Service Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1.5">
                    <div>
                      <Label className="text-sm text-muted-foreground">Service Type</Label>
                      <p className="font-medium">{selectedBooking.serviceType || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Date & Time</Label>
                      <p className="font-medium">
                        {selectedBooking.dateTime ? new Date(selectedBooking.dateTime).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Amount</Label>
                      <p className="font-medium text-primary">₹{selectedBooking.amount || '0'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Mechanic Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5" />
                      Mechanic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Mechanic</Label>
                      <p className="font-medium">{selectedBooking.mechanic?.name || 'Not Assigned'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Rating</Label>
                      <p className="font-medium">
                        {selectedBooking.mechanic?.rating ? `★ ${selectedBooking.mechanic.rating}` : 'No rating'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Notes */}
                {selectedBooking.notes && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Additional Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedBooking.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Booking Modal */}
      <Dialog open={addBookingModal} onOpenChange={setAddBookingModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Add New Booking</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-2 -mr-2">
            <div className="space-y-6 pb-4">
              {/* Customer Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1.5">
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-sm">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={newBooking.customer.name}
                      onChange={(e) => setNewBooking(prev => ({
                        ...prev,
                        customer: { ...prev.customer, name: e.target.value }
                      }))}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone" className="text-sm">Customer Phone *</Label>
                    <Input
                      id="customerPhone"
                      value={newBooking.customer.phone}
                      onChange={(e) => setNewBooking(prev => ({
                        ...prev,
                        customer: { ...prev.customer, phone: e.target.value }
                      }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail" className="text-sm">Customer Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={newBooking.customer.email}
                      onChange={(e) => setNewBooking(prev => ({
                        ...prev,
                        customer: { ...prev.customer, email: e.target.value }
                      }))}
                      placeholder="Enter email address"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake" className="text-sm">Vehicle Make *</Label>
                    <Input
                      id="vehicleMake"
                      value={newBooking.vehicle.make}
                      onChange={(e) => setNewBooking(prev => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, make: e.target.value }
                      }))}
                      placeholder="e.g., Toyota"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel" className="text-sm">Vehicle Model *</Label>
                    <Input
                      id="vehicleModel"
                      value={newBooking.vehicle.model}
                      onChange={(e) => setNewBooking(prev => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, model: e.target.value }
                      }))}
                      placeholder="e.g., Camry"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear" className="text-sm">Vehicle Year</Label>
                    <Input
                      id="vehicleYear"
                      type="number"
                      value={newBooking.vehicle.year}
                      onChange={(e) => setNewBooking(prev => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, year: e.target.value }
                      }))}
                      placeholder="e.g., 2020"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plateNumber" className="text-sm">Plate Number *</Label>
                    <Input
                      id="plateNumber"
                      value={newBooking.vehicle.plateNumber}
                      onChange={(e) => setNewBooking(prev => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, plateNumber: e.target.value }
                      }))}
                      placeholder="e.g., ABC123"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Service Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wrench className="h-5 w-5" />
                    Service Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1.5">
                  <div className="space-y-2">
                    <Label htmlFor="serviceType" className="text-sm">Service Type *</Label>
                    <Input
                      id="serviceType"
                      value={newBooking.serviceType}
                      onChange={(e) => setNewBooking(prev => ({
                        ...prev,
                        serviceType: e.target.value
                      }))}
                      placeholder="e.g., Oil Change"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateTime" className="text-sm">Date & Time *</Label>
                    <Input
                      id="dateTime"
                      type="datetime-local"
                      value={newBooking.dateTime}
                      onChange={(e) => setNewBooking(prev => ({
                        ...prev,
                        dateTime: e.target.value
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm">Amount (₹) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newBooking.amount}
                      onChange={(e) => setNewBooking(prev => ({
                        ...prev,
                        amount: e.target.value
                      }))}
                      placeholder="Enter amount"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm">Notes</Label>
                    <textarea
                      id="notes"
                      value={newBooking.notes}
                      onChange={(e) => setNewBooking(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      placeholder="Any additional notes..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => setAddBookingModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBooking}>
              Create Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reassign Mechanic Modal */}
      <Dialog
        open={reassignModal.open}
        onOpenChange={() => setReassignModal({ open: false, bookingId: null })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reassign Mechanic</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Label>Select Mechanic</Label>
            <Select
              onValueChange={(value) =>
                reassignMechanic(reassignModal.bookingId, value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a mechanic" />
              </SelectTrigger>
              <SelectContent>
                {mechanicsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading mechanics...
                  </SelectItem>
                ) : mechanics.filter((m) => m.isActive).length > 0 ? (
                  mechanics
                    .filter((m) => m.isActive)
                    .map((mechanic) => (
                      <SelectItem key={mechanic._id} value={mechanic._id}>
                        {mechanic.name} {mechanic.rating && `(★ ${mechanic.rating})`}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="none" disabled>
                    No mechanics available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          3</div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReassignModal({ open: false, bookingId: null })}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmModal.open} onOpenChange={() => setDeleteConfirmModal({ open: false, bookingId: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmModal({ open: false, bookingId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteBooking(deleteConfirmModal.bookingId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default BookingsManagement;