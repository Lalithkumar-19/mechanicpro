import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
    Edit,
    Trash2,
    Plus,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Eye,
    Star,
    UserPlus,
    X,
    MapPin,
    Phone,
    Mail,
    Calendar
} from 'lucide-react';
import axiosInstance from '../../utils/adminaxios';

const MechanicsManagement = ({ mechanics, setMechanics, addNotification }) => {
    const [showAddMechanic, setShowAddMechanic] = useState(false);
    const [selectedMechanic, setSelectedMechanic] = useState(null);
    const [editingMechanic, setEditingMechanic] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const [newMechanic, setNewMechanic] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        state: '',
        city: '',
        street: '',
        pincode: '',
        latitude: '',
        longitude: '',
        services: '',
        profilePic: null,
        isActive: true,
        rating: '',
        mapLink: '',
    });

    const getmechanics = async () => {
        try {
            const { data } = await axiosInstance.get("/admin/get-all-mechanics");
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
                    joineddate: item.createdAt,
                    profilePic: item.profile || null,
                    _id: item._id,
                    street: item.streetaddress,
                    zip: item.zip,
                    mapsLink: item.mapsLink
                }
            });
            setMechanics(res);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getmechanics();
    }, []);

    const Addmechanic = async () => {
        try {
            const { data } = await axiosInstance.post("/admin/addmechanic", newMechanic);
            getmechanics();
            setShowAddMechanic(false);
            setNewMechanic({
                name: '',
                email: '',
                phone: '',
                password: '',
                state: '',
                city: '',
                street: '',
                pincode: '',
                latitude: '',
                longitude: '',
                services: '',
                profilePic: null,
                isActive: true,
                rating: '',
                mapLink: '',
            });
            addNotification(`New mechanic added: ${newMechanic.name}`, 'mechanic');
            toast.success('Mechanic added successfully');
        } catch (error) {
            console.log(error);
            addNotification('Error adding mechanic', 'error');
            toast.error('Error adding mechanic');
        }
    }

    // Handle Edit Mechanic
    const handleEditMechanic = async (mechanic) => {
        try {
            const updateData = {
                id: mechanic._id || mechanic.id,
                name: mechanic.name,
                email: mechanic.email,
                phone: mechanic.phone,
                street: mechanic.street,
                city: mechanic.city,
                state: mechanic.state,
                pincode: mechanic.pincode,
                services: Array.isArray(mechanic.services) ? mechanic.services : mechanic.services.split(',').map(s => s.trim()).filter(s => s),
                latitude: mechanic.latitude,
                longitude: mechanic.longitude,
                rating: mechanic.rating,
                mapLink: mechanic.mapLink || mechanic.mapsLink,
                isActive: mechanic.isActive
            };

            const { data } = await axiosInstance.put("/admin/updatemechanic", updateData);
            getmechanics();
            setEditingMechanic(null);
            addNotification(`Mechanic updated: ${mechanic.name}`, 'mechanic');
            toast.success('Mechanic updated successfully');
        } catch (error) {
            console.log(error);
            addNotification('Error updating mechanic', 'error');
            toast.error('Error updating mechanic');
        }
    };

    // Handle Delete Mechanic
    const handleDeleteMechanic = async (mechanicId) => {
        try {
            const { data } = await axiosInstance.delete(`/admin/deletemechanic/${mechanicId}`);
            getmechanics();
            addNotification('Mechanic deleted', 'mechanic');
            toast.success('Mechanic deleted successfully');
        } catch (error) {
            console.log(error);
            addNotification('Error deleting mechanic', 'error');
            toast.error('Error deleting mechanic');
        } finally {
            setDeleteConfirm(null);
        }
    };

    // Toggle Mechanic Status
    const toggleMechanicStatus = async (mechanicId) => {
        try {
            const mechanic = mechanics.find(m => m.id === mechanicId);
            const updateData = {
                id: mechanic._id || mechanic.id,
                name: mechanic.name,
                email: mechanic.email,
                phone: mechanic.phone,
                street: mechanic.street || mechanic.location?.street,
                city: mechanic.city || mechanic.location?.city,
                state: mechanic.state || mechanic.location?.state,
                pincode: mechanic.pincode || mechanic.location?.pincode,
                services: mechanic.services,
                latitude: mechanic.latitude || mechanic.location?.latitude,
                longitude: mechanic.longitude || mechanic.location?.longitude,
                rating: mechanic.rating,
                mapLink: mechanic.mapLink || mechanic.mapsLink,
                isActive: !mechanic.isActive
            };

            const { data } = await axiosInstance.put("/admin/updatemechanic", updateData);
            getmechanics();
            addNotification(`Mechanic ${mechanic.name} ${!mechanic.isActive ? 'activated' : 'deactivated'}`, 'mechanic');
            toast.success(`Mechanic ${!mechanic.isActive ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.log(error);
            addNotification('Error updating mechanic status', 'error');
            toast.error('Error updating mechanic status');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 p-6"
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mechanics Management</h2>
                    <p className="text-muted-foreground">Manage all registered mechanics</p>
                </div>
                <Button
                    onClick={() => setShowAddMechanic(true)}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Mechanic
                </Button>
            </div>

            {/* Mechanics Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Mechanics</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mechanic</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Services</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mechanics.map((mechanic) => (
                                <TableRow key={mechanic.id}>
                                    <TableCell>
                                        <div className="font-medium">{mechanic.name}</div>
                                    </TableCell>
                                    <TableCell>{mechanic.email}</TableCell>
                                    <TableCell>{mechanic.phone}</TableCell>
                                    <TableCell>
                                        {mechanic.location?.city && mechanic.location?.state
                                            ? `${mechanic.location.city}, ${mechanic.location.state}`
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            <span>{mechanic.rating}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {mechanic.services?.slice(0, 2).map((service, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {service}
                                                </Badge>
                                            ))}
                                            {mechanic.services?.length > 2 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{mechanic.services.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={mechanic.isActive ? "default" : "secondary"}
                                            className={mechanic.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                                        >
                                            {mechanic.isActive ? 'Active' : 'Inactive'}
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
                                                <DropdownMenuItem onClick={() => setSelectedMechanic(mechanic)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setEditingMechanic({
                                                    ...mechanic,
                                                    street: mechanic.street || mechanic.location?.street,
                                                    city: mechanic.city || mechanic.location?.city,
                                                    state: mechanic.state || mechanic.location?.state,
                                                    pincode: mechanic.pincode || mechanic.location?.pincode,
                                                    latitude: mechanic.latitude || mechanic.location?.latitude,
                                                    longitude: mechanic.longitude || mechanic.location?.longitude,
                                                    mapLink: mechanic.mapLink || mechanic.mapsLink,
                                                    services: Array.isArray(mechanic.services) ? mechanic.services.join(', ') : mechanic.services
                                                })}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Mechanic
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => toggleMechanicStatus(mechanic.id)}
                                                    className={mechanic.isActive ? 'text-yellow-600' : 'text-green-600'}
                                                >
                                                    {mechanic.isActive ? (
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
                                                    onClick={() => setDeleteConfirm(mechanic.id)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Mechanic
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {mechanics.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-muted-foreground text-lg">No mechanics found</div>
                            <Button
                                onClick={() => setShowAddMechanic(true)}
                                className="mt-4 gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Your First Mechanic
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View Mechanic Details Dialog */}
            <Dialog open={!!selectedMechanic} onOpenChange={() => setSelectedMechanic(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Mechanic Details</DialogTitle>
                    </DialogHeader>
                    {selectedMechanic && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                                    <Star className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedMechanic.name}</h3>
                                    <Badge
                                        variant={selectedMechanic.isActive ? "default" : "secondary"}
                                        className={selectedMechanic.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                                    >
                                        {selectedMechanic.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm text-muted-foreground">Mechanic ID</Label>
                                    <p className="font-medium">{selectedMechanic.id}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Join Date</Label>
                                    <p className="font-medium">
                                        {new Date(selectedMechanic.joineddate).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm text-muted-foreground">Contact Information</Label>
                                <div className="space-y-1 mt-1">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{selectedMechanic.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{selectedMechanic.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm text-muted-foreground">Location</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {selectedMechanic.location?.street && `${selectedMechanic.location.street}, `}
                                        {selectedMechanic.location?.city && `${selectedMechanic.location.city}, `}
                                        {selectedMechanic.location?.state}
                                    </span>
                                </div>
                                {selectedMechanic.location?.pincode && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Pincode: {selectedMechanic.location.pincode}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-primary">{selectedMechanic.totalBookings}</div>
                                        <div className="text-sm text-muted-foreground">Total Bookings</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                            <span className="text-2xl font-bold">{selectedMechanic.rating}</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground">Rating</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div>
                                <Label className="text-sm text-muted-foreground">Services Offered</Label>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {selectedMechanic.services?.map((service, index) => (
                                        <Badge key={index} variant="secondary">
                                            {service}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add Mechanic Dialog */}
            <Dialog open={showAddMechanic} onOpenChange={setShowAddMechanic}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Mechanic</DialogTitle>
                        <DialogDescription>
                            Add a new mechanic to your system.
                        </DialogDescription>
                    </DialogHeader>
                    <MechanicForm
                        mechanic={newMechanic}
                        setMechanic={setNewMechanic}
                        isEdit={false}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddMechanic(false)}>
                            Cancel
                        </Button>
                        <Button onClick={Addmechanic}>
                            Add Mechanic
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Mechanic Dialog */}
            <Dialog open={!!editingMechanic} onOpenChange={() => setEditingMechanic(null)}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Mechanic</DialogTitle>
                        <DialogDescription>
                            Update mechanic details.
                        </DialogDescription>
                    </DialogHeader>
                    <MechanicForm
                        mechanic={editingMechanic || {}}
                        setMechanic={setEditingMechanic}
                        isEdit={true}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingMechanic(null)}>
                            Cancel
                        </Button>
                        <Button onClick={() => handleEditMechanic(editingMechanic)}>
                            Update Mechanic
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
                            This action cannot be undone. This will permanently delete the mechanic.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDeleteMechanic(deleteConfirm)}
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

// Mechanic Form Component
const MechanicForm = ({ mechanic, setMechanic, isEdit, showPassword, setShowPassword }) => {
    const handleChange = (field, value) => {
        setMechanic(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                        id="name"
                        value={mechanic.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter mechanic name"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={mechanic.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Enter email address"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                        id="phone"
                        value={mechanic.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                    />
                </div>
                {!isEdit && (
                    <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={mechanic.password || ''}
                                onChange={(e) => handleChange('password', e.target.value)}
                                placeholder="Enter password"
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <Eye className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                        id="rating"
                        type="number"
                        value={mechanic.rating || ''}
                        onChange={(e) => handleChange('rating', e.target.value)}
                        placeholder="Enter rating (0-5)"
                        min="0"
                        max="5"
                        step="0.1"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mapLink">Map Link</Label>
                    <Input
                        id="mapLink"
                        value={mechanic.mapLink || mechanic.mapsLink || ''}
                        onChange={(e) => handleChange('mapLink', e.target.value)}
                        placeholder="Enter map link"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="services">Services (comma separated)</Label>
                <Input
                    id="services"
                    value={Array.isArray(mechanic.services) ? mechanic.services.join(', ') : mechanic.services || ''}
                    onChange={(e) => handleChange('services', e.target.value)}
                    placeholder="e.g., Oil Change, Brake Service, AC Repair"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                        id="state"
                        value={mechanic.state || ''}
                        onChange={(e) => handleChange('state', e.target.value)}
                        placeholder="Enter state"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                        id="city"
                        value={mechanic.city || ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Enter city"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                    id="street"
                    value={mechanic.street || ''}
                    onChange={(e) => handleChange('street', e.target.value)}
                    placeholder="Enter street address"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                        id="pincode"
                        value={mechanic.pincode || ''}
                        onChange={(e) => handleChange('pincode', e.target.value)}
                        placeholder="Enter pincode"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude *</Label>
                    <Input
                        id="latitude"
                        value={mechanic.latitude || ''}
                        onChange={(e) => handleChange('latitude', e.target.value)}
                        placeholder="Enter latitude"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude *</Label>
                    <Input
                        id="longitude"
                        value={mechanic.longitude || ''}
                        onChange={(e) => handleChange('longitude', e.target.value)}
                        placeholder="Enter longitude"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isActive"
                    checked={mechanic.isActive || false}
                    onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                    Active Mechanic
                </Label>
            </div>
        </div>
    );
};

export default MechanicsManagement;