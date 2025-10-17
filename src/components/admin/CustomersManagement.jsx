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
  Plus,
  MoreHorizontal,
  User,
  Phone,
  Mail,
  Car,
  Calendar,
  IndianRupee,
  Shield,
  ShieldOff,
  Trash2,
  Edit,
  Loader2
} from 'lucide-react';
import axiosInstance from '../../utils/adminaxios';

const CustomersManagement = ({ addNotification }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/admin/get-all-customers");
      setCustomers(data);
      toast.success('Customers loaded successfully');
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Error fetching customers: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle Add Customer
  const handleAddCustomer = async () => {
    try {
      // Validate required fields
      if (!newCustomer.name || !newCustomer.phone || !newCustomer.password) {
        toast.error('Please fill all required fields');
        return;
      }

      const { data } = await axiosInstance.post("/admin/create-customer", newCustomer);
      if (data) {
        await fetchCustomers();
        setShowAddCustomer(false);
        setNewCustomer({
          name: '',
          email: '',
          phone: '',
          password: ''
        });
        addNotification(`New customer added: ${data.name}`, 'customer');
        toast.success('Customer added successfully');
      } else {
        toast.error('Failed to add customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Error adding customer: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle Update Customer Status
  const handleUpdateCustomerStatus = async (customerId, isBlocked) => {
    try {
      const { data } = await axiosInstance.put("/admin/update-customer-status", {
        customerId,
        isBlocked
      });
      console.log(data, "h");
      if (data) {
        await fetchCustomers();
        addNotification(`Customer ${isBlocked ? 'blocked' : 'unblocked'}`, 'customer');
        toast.success(`Customer ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
      } else {
        toast.error('Failed to update customer status');
      }
    } catch (error) {
      console.error('Error updating customer status:', error);
      toast.error('Error updating customer status: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle Delete Customer
  const handleDeleteCustomer = async (customerId) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/delete-customer/${customerId}`);
      if (data) {
        await fetchCustomers();
        addNotification('Customer deleted', 'customer');
        toast.success('Customer deleted successfully');
      } else {
        toast.error('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Error deleting customer: ' + (error.response?.data?.message || error.message));
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleInputChange = (field, value) => {
    setNewCustomer(prev => ({ ...prev, [field]: value }));
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => !c.isBlocked).length;
  const blockedCustomers = customers.filter(c => c.isBlocked).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading customers...</span>
      </div>
    );
  }

  console.log(customers, "customers");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers Management</h2>
          <p className="text-muted-foreground">Manage all customer accounts and information</p>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>Total: {totalCustomers}</span>
            <span>Active: {activeCustomers}</span>
            <span>Blocked: {blockedCustomers}</span>
          </div>
        </div>
        <Button
          onClick={() => setShowAddCustomer(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Service</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {customer.profilePic ? (
                          <img
                            src={customer.profilePic}
                            alt={customer.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.cars?.length || 0} cars
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {customer.totalBookings || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-semibold">
                      <IndianRupee className="h-4 w-4" />
                      {customer.totalSpent || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      {customer.lastService || 'No services'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {customer.joinDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.isBlocked === true ? "destructive" : "default"}
                      className={!customer.isBlocked === true ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                    >
                      {customer.isBlocked === true ? 'Blocked' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleUpdateCustomerStatus(customer.id, !customer.isBlocked)}
                          className={customer.isBlocked ? 'text-green-600' : 'text-yellow-600'}
                        >
                          {customer.isBlocked ? (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Unblock Customer
                            </>
                          ) : (
                            <>
                              <ShieldOff className="h-4 w-4 mr-2" />
                              Block Customer
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteConfirm(customer.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {customers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">No customers found</div>
              <Button
                onClick={() => setShowAddCustomer(true)}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Create a new customer account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={newCustomer.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddCustomer(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  {selectedCustomer.profilePic ? (
                    <img
                      src={selectedCustomer.profilePic}
                      alt={selectedCustomer.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                  <p className="text-muted-foreground">{selectedCustomer.email}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedCustomer.totalBookings || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      <IndianRupee className="inline h-5 w-5" />
                      {selectedCustomer.totalSpent || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  {selectedCustomer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <h4 className="font-semibold mb-2">Vehicles ({selectedCustomer.cars?.length || 0})</h4>
                {selectedCustomer.cars && selectedCustomer.cars.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCustomer.cars.map((car, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{car.carname} {car.carmodel}</div>
                          <div className="text-sm text-muted-foreground">
                            {car.caryear} • {car.carlicenseplate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No vehicles registered</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteCustomer(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default CustomersManagement;