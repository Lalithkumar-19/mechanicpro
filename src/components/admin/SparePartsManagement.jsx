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
    CheckCircle,
    XCircle,
    Truck,
    Package,
    RefreshCw,
    MoreHorizontal,
    User,
    Car,
    Calendar,
    AlertTriangle
} from 'lucide-react';
import axiosInstance from '../../utils/adminaxios';

const SparePartsManagement = ({ addNotification }) => {
    const [spareParts, setSpareParts] = useState([]);
    const [selectedSparePart, setSelectedSparePart] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [viewModal, setViewModal] = useState(false);

    // Fetch all spare parts
    const fetchSpareParts = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get("/admin/get-all-spare-parts");
            setSpareParts(data);
            toast.success('Spare parts loaded successfully');
        } catch (error) {
            console.error('Error fetching spare parts:', error);
            toast.error('Error fetching spare parts: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpareParts();
    }, []);

    // Update Spare Part Status
    const updateSparePartStatus = async (requestId, newStatus) => {
        try {
            const { data } = await axiosInstance.put("/admin/update-spare-part-status", {
                requestId,
                status: newStatus
            });

            // Update the specific spare part in the state
            setSpareParts(prev => prev.map(request =>
                request.id === requestId ? data : request
            ));

            const statusMessages = {
                'approved': 'approved',
                'rejected': 'rejected',
                'dispatched': 'dispatched',
                'delivered': 'delivered'
            };

            addNotification(`Spare part request ${requestId} ${statusMessages[newStatus]}`, 'spare-part');
            toast.success(`Spare part request ${statusMessages[newStatus]} successfully`);
        } catch (error) {
            console.error('Error updating spare part status:', error);
            toast.error('Error updating spare part status: ' + (error.response?.data?.message || error.message));
        }
    };

    // Filter spare parts by status
    const filteredSpareParts = statusFilter === 'all'
        ? spareParts
        : spareParts.filter(part => part.status === statusFilter);

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'pending': return 'secondary';
            case 'approved': return 'default';
            case 'dispatched': return 'default';
            case 'delivered': return 'default';
            case 'rejected': return 'destructive';
            default: return 'secondary';
        }
    };

    // Get urgency badge variant
    const getUrgencyVariant = (urgency) => {
        switch (urgency?.toLowerCase()) {
            case 'high': return 'destructive';
            case 'medium': return 'warning';
            case 'low': return 'default';
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

    // Get status actions
    const getStatusActions = (sparePart) => {
        const actions = [];

        switch (sparePart.status) {
            case 'pending':
                actions.push(
                    {
                        label: 'Approve',
                        icon: CheckCircle,
                        action: () => updateSparePartStatus(sparePart.id, 'approved'),
                        variant: 'default'
                    },
                    {
                        label: 'Reject',
                        icon: XCircle,
                        action: () => updateSparePartStatus(sparePart.id, 'rejected'),
                        variant: 'destructive'
                    }
                );
                break;
            case 'approved':
                actions.push({
                    label: 'Dispatch',
                    icon: Truck,
                    action: () => updateSparePartStatus(sparePart.id, 'dispatched'),
                    variant: 'default'
                });
                break;
            case 'dispatched':
                actions.push({
                    label: 'Mark Delivered',
                    icon: Package,
                    action: () => updateSparePartStatus(sparePart.id, 'delivered'),
                    variant: 'default'
                });
                break;
        }

        return actions;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <span className="ml-3 text-lg">Loading spare parts...</span>
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
                    <h2 className="text-3xl font-bold tracking-tight">Spare Parts Management</h2>
                    <p className="text-muted-foreground">Manage all spare part requests</p>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Total: {spareParts.length}</span>
                        <span>Pending: {spareParts.filter(p => p.status === 'pending').length}</span>
                        <span>Approved: {spareParts.filter(p => p.status === 'approved').length}</span>
                        <span>Dispatched: {spareParts.filter(p => p.status === 'dispatched').length}</span>
                        <span>Delivered: {spareParts.filter(p => p.status === 'delivered').length}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={fetchSpareParts}
                        variant="outline"
                        className="gap-2 text-black"
                    >
                        <RefreshCw className="h-4 w-4 text-black" />
                        Refresh
                    </Button>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="dispatched">Dispatched</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Spare Parts Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Spare Part Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Request ID</TableHead>
                                <TableHead>Mechanic</TableHead>
                                <TableHead>Service ID</TableHead>
                                <TableHead>Part Details</TableHead>
                                <TableHead>Car Model</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Urgency</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSpareParts.map((part) => (
                                <TableRow key={part.id}>
                                    <TableCell className="font-mono font-medium">
                                        {part.requestId || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {part.mechanic?.name || 'Not Assigned'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {part.mechanic?.phone || 'N/A'}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {part.serviceId || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {part.partName || 'N/A'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Qty: {part.quantity || 'N/A'}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {part.carModel || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {part.year || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getUrgencyVariant(part.urgency)}>
                                            {part.urgency || 'Medium'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={part.status || 'pending'}
                                            onValueChange={(value) => updateSparePartStatus(part.id, value)}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue>
                                                    <Badge variant={getStatusVariant(part.status)}>
                                                        {part.status || 'pending'}
                                                    </Badge>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">
                                                    <Badge variant="secondary">Pending</Badge>
                                                </SelectItem>
                                                <SelectItem value="approved">
                                                    <Badge variant="default">Approved</Badge>
                                                </SelectItem>
                                                <SelectItem value="dispatched">
                                                    <Badge variant="default">Dispatched</Badge>
                                                </SelectItem>
                                                <SelectItem value="delivered">
                                                    <Badge variant="default">Delivered</Badge>
                                                </SelectItem>
                                                <SelectItem value="rejected">
                                                    <Badge variant="destructive">Rejected</Badge>
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
                                                    setSelectedSparePart(part);
                                                    setViewModal(true);
                                                }}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>

                                                {/* Status-specific actions */}
                                                {getStatusActions(part).map((action, index) => (
                                                    <DropdownMenuItem
                                                        key={index}
                                                        onClick={action.action}
                                                        className={action.variant === 'destructive' ? 'text-destructive' : ''}
                                                    >
                                                        <action.icon className="h-4 w-4 mr-2" />
                                                        {action.label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredSpareParts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-muted-foreground text-lg">
                                {spareParts.length === 0 ? 'No spare part requests found' : 'No requests match the current filter'}
                            </div>
                            <Button
                                onClick={fetchSpareParts}
                                className="mt-4 gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View Details Modal */}
            <Dialog open={viewModal} onOpenChange={setViewModal}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle>Spare Part Request Details</DialogTitle>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-1 pr-2 -mr-2">
                        {selectedSparePart && (
                            <div className="space-y-4 pb-4">
                                {/* Request Information */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Package className="h-5 w-5" />
                                            Request Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Request ID</Label>
                                            <p className="font-mono font-medium">{selectedSparePart.requestId || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Service ID</Label>
                                            <p className="font-mono font-medium">{selectedSparePart.serviceId || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Status</Label>
                                            <Badge variant={getStatusVariant(selectedSparePart.status)}>
                                                {selectedSparePart.status || 'pending'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Urgency</Label>
                                            <Badge variant={getUrgencyVariant(selectedSparePart.urgency)}>
                                                {selectedSparePart.urgency || 'Medium'}
                                            </Badge>
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
                                            <Label className="text-sm text-muted-foreground">Name</Label>
                                            <p className="font-medium">{selectedSparePart.mechanic?.name || 'Not Assigned'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Phone</Label>
                                            <p className="font-medium">{selectedSparePart.mechanic?.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Email</Label>
                                            <p className="font-medium">{selectedSparePart.mechanic?.email || 'N/A'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Part Details */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Package className="h-5 w-5" />
                                            Part Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Part Name</Label>
                                            <p className="font-medium">{selectedSparePart.partName || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Quantity</Label>
                                            <p className="font-medium">{selectedSparePart.quantity || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Amount</Label>
                                            <p className="font-medium text-primary">₹{selectedSparePart.amount || '0'}</p>
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
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Car Model</Label>
                                            <p className="font-medium">{selectedSparePart.carModel || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Manufactured Year</Label>
                                            <p className="font-medium">{selectedSparePart.year || 'N/A'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Timeline Information */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Calendar className="h-5 w-5" />
                                            Timeline
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div>
                                            <Label className="text-sm text-muted-foreground">Requested At</Label>
                                            <p className="font-medium">
                                                {selectedSparePart.requestedAt ?
                                                    formatDate(selectedSparePart.requestedAt) : 'N/A'
                                                }
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Actions */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <AlertTriangle className="h-5 w-5" />
                                            Quick Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {getStatusActions(selectedSparePart).map((action, index) => (
                                                <Button
                                                    key={index}
                                                    variant={action.variant === 'destructive' ? 'destructive' : 'default'}
                                                    size="sm"
                                                    onClick={action.action}
                                                    className="gap-2"
                                                >
                                                    <action.icon className="h-4 w-4" />
                                                    {action.label}
                                                </Button>
                                            ))}
                                            <Select
                                                value={selectedSparePart.status || 'pending'}
                                                onValueChange={(value) => updateSparePartStatus(selectedSparePart.id, value)}
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue>
                                                        Change Status
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="approved">Approved</SelectItem>
                                                    <SelectItem value="dispatched">Dispatched</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                    <SelectItem value="rejected">Rejected</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default SparePartsManagement;