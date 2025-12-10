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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
    Edit,
    Trash2,
    Plus,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Loader2,
    Wrench,
    Clock,
    IndianRupee,
    Tag
} from 'lucide-react';
import axiosInstance from '../../utils/adminaxios';

const ServicesManagement = ({ addNotification }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddService, setShowAddService] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [newService, setNewService] = useState({
        serviceName: '',
        description: '',
        Baseprice: '',
        duration: '',
        category: '',
        status: true
    });

    // Fetch all services
    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get("/admin/services/get-all-services");
            if (data.success) {
                setServices(data.data);
                toast.success('Services loaded successfully');
            } else {
                toast.error(data.message || 'Failed to fetch services');
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Error fetching services: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Handle Add Service
    const handleAddService = async () => {
        try {
            // Validate required fields
            if (!newService.serviceName || !newService.description || !newService.Baseprice || !newService.duration || !newService.category) {
                toast.error('Please fill all required fields');
                return;
            }

            const { data } = await axiosInstance.post("/admin/services/create-service", newService);
            if (data.success) {
                await fetchServices();
                setShowAddService(false);
                setNewService({
                    serviceName: '',
                    description: '',
                    Baseprice: '',
                    duration: '',
                    category: '',
                    status: true
                });
                addNotification(`New service added: ${data.data.serviceName}`, 'service');
                toast.success('Service added successfully');
            } else {
                toast.error(data.message || 'Failed to add service');
            }
        } catch (error) {
            console.error('Error adding service:', error);
            toast.error('Error adding service: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle Edit Service
    const handleEditService = async (service) => {
        try {
            // Validate required fields
            if (!service.serviceName || !service.description || !service.Baseprice || !service.duration || !service.category) {
                toast.error('Please fill all required fields');
                return;
            }

            const { data } = await axiosInstance.put(`/admin/services/update-service/${service._id}`, service);
            if (data.success) {
                await fetchServices();
                setEditingService(null);
                addNotification(`Service updated: ${service.serviceName}`, 'service');
                toast.success('Service updated successfully');
            } else {
                toast.error(data.message || 'Failed to update service');
            }
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error('Error updating service: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle Delete Service
    const handleDeleteService = async (serviceId) => {
        try {
            const { data } = await axiosInstance.delete(`/admin/services/delete-service/${serviceId}`);
            if (data.success) {
                await fetchServices();
                addNotification('Service deleted', 'service');
                toast.success('Service deleted successfully');
            } else {
                toast.error(data.message || 'Failed to delete service');
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Error deleting service: ' + (error.response?.data?.message || error.message));
        } finally {
            setDeleteConfirm(null);
        }
    };

    // Toggle Service Status
    const toggleServiceStatus = async (serviceId) => {
        try {
            const { data } = await axiosInstance.patch(`/admin/services/toggle-service-status/${serviceId}`);
            if (data.success) {
                await fetchServices();
                const service = services.find(s => s._id === serviceId);
                addNotification(`Service ${service?.serviceName} ${data.data.status ? 'activated' : 'deactivated'}`, 'service');
                toast.success(`Service ${data.data.status ? 'activated' : 'deactivated'} successfully`);
            } else {
                toast.error(data.message || 'Failed to update service status');
            }
        } catch (error) {
            console.error('Error toggling service status:', error);
            toast.error('Error updating service status: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleInputChange = (field, value) => {
        if (editingService) {
            setEditingService(prev => ({ ...prev, [field]: value }));
        } else {
            setNewService(prev => ({ ...prev, [field]: value }));
        }
    };

    const activeServices = services.filter(s => s.status).length;
    const inactiveServices = services.filter(s => !s.status).length;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading services...</span>
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
                    <h2 className="text-3xl font-bold tracking-tight">Services Management</h2>
                    <p className="text-muted-foreground">Manage all service types and pricing</p>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Total: {services.length}</span>
                        <span>Active: {activeServices}</span>
                        <span>Inactive: {inactiveServices}</span>
                    </div>
                </div>
                <Button
                    onClick={() => setShowAddService(true)}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Service
                </Button>
            </div>

            {/* Services Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Services</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Base Price</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={service._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Wrench className="h-4 w-4 text-muted-foreground" />
                                            {service.serviceName}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                        <p className="truncate" title={service.description}>
                                            {service.description}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 font-semibold text-primary">
                                            <IndianRupee className="h-4 w-4" />
                                            {service.Baseprice}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            {service.duration}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {service.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={service.status ? "default" : "secondary"}
                                            className={service.status ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                                        >
                                            {service.status ? 'Active' : 'Inactive'}
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
                                                <DropdownMenuItem onClick={() => setEditingService(service)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Service
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => toggleServiceStatus(service._id)}
                                                    className={service.status ? 'text-yellow-600' : 'text-green-600'}
                                                >
                                                    {service.status ? (
                                                        <>
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Activate
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setDeleteConfirm(service._id)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Service
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {services.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-muted-foreground text-lg">No services found</div>
                            <Button
                                onClick={() => setShowAddService(true)}
                                className="mt-4 gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Your First Service
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Debug Info - Remove in production */}
            {/* <Card className="bg-muted/50">
                <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">
                        <div>Debug: Loaded {services.length} services from backend</div>
                        <div className="mt-1">
                            Sample: {services[0] ? `${services[0].serviceName} - ₹${services[0].Baseprice}` : 'No data'}
                        </div>
                    </div>
                </CardContent>
            </Card> */}

            {/* Add Service Dialog */}
            <Dialog open={showAddService} onOpenChange={setShowAddService}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>
                            Add a new service to your service catalog.
                        </DialogDescription>
                    </DialogHeader>
                    <ServiceForm
                        service={newService}
                        onChange={handleInputChange}
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowAddService(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddService}>
                            Add Service
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Service Dialog */}
            <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                        <DialogDescription>
                            Update the service details.
                        </DialogDescription>
                    </DialogHeader>
                    <ServiceForm
                        service={editingService || {}}
                        onChange={handleInputChange}
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditingService(null)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => handleEditService(editingService)}>
                            Update Service
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the service.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDeleteService(deleteConfirm)}
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

// Service Form Component
const ServiceForm = ({ service, onChange }) => {
    const categories = [
        "Maintenance",
        "Repair",
        "AC Service",
        "Electrical",
        "Engine",
        "Transmission",
        "Brake Service",
        "Tire Service"
    ];

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="serviceName">Service Name *</Label>
                <Input
                    id="serviceName"
                    value={service.serviceName || ''}
                    onChange={(e) => onChange('serviceName', e.target.value)}
                    placeholder="Enter service name"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    value={service.description || ''}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="Enter service description"
                    rows={3}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="basePrice">Base Price (₹) *</Label>
                    <Input
                        id="basePrice"
                        type="number"
                        value={service.Baseprice || ''}
                        onChange={(e) => onChange('Baseprice', e.target.value)}
                        placeholder="0.00"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                        id="duration"
                        value={service.duration || ''}
                        onChange={(e) => onChange('duration', e.target.value)}
                        placeholder="e.g., 2 hours"
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <div className="space-y-2">
                    <Select
                        value={service.category || ''}
                        onValueChange={(value) => onChange('category', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category or type custom" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="relative">
                        <Input
                            id="category"
                            value={service.category || ''}
                            onChange={(e) => onChange('category', e.target.value)}
                            placeholder="Or type custom category"
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="status"
                    checked={service.status || false}
                    onCheckedChange={(checked) => onChange('status', checked)}
                />
                <Label htmlFor="status" className="cursor-pointer">
                    Active Service
                </Label>
            </div>
        </div>
    );
};

export default ServicesManagement;