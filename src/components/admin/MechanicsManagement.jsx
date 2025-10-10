import React, { useState } from 'react';
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
import {
    Edit,
    Delete,
    Visibility,
    CheckCircle,
    Cancel,
    Add,
    Star
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X } from 'lucide-react';

const MechanicsManagement = ({ mechanics, setMechanics, addNotification }) => {
    const [showAddMechanic, setShowAddMechanic] = useState(false);
    const [selectedMechanic, setSelectedMechanic] = useState(null);
    const [editingMechanic, setEditingMechanic] = useState(null);

    const [newMechanic, setNewMechanic] = useState({
        name: '',
        email: '',
        phone: '',
        state: '',
        city: '',
        street: '',
        pincode: '',
        latitude: '',
        longitude: '',
        services: [],
        profilePic: null,
        isActive: true
    });

    // Handle Add Mechanic
    const handleAddMechanic = () => {
        const mechanic = {
            ...newMechanic,
            id: `M${Date.now()}`,
            rating: 0,
            totalBookings: 0,
            joinedDate: new Date().toISOString().split('T')[0],
            location: {
                state: newMechanic.state,
                city: newMechanic.city,
                street: newMechanic.street,
                pincode: newMechanic.pincode,
                latitude: newMechanic.latitude,
                longitude: newMechanic.longitude
            }
        };

        setMechanics(prev => [mechanic, ...prev]);
        setShowAddMechanic(false);
        setNewMechanic({
            name: '',
            email: '',
            phone: '',
            state: '',
            city: '',
            street: '',
            pincode: '',
            latitude: '',
            longitude: '',
            services: [],
            profilePic: null,
            isActive: true
        });
        addNotification(`New mechanic added: ${mechanic.name}`, 'mechanic');
    };

    // Handle Edit Mechanic
    const handleEditMechanic = (mechanic) => {
        setMechanics(prev => prev.map(m => m.id === mechanic.id ? mechanic : m));
        setEditingMechanic(null);
        addNotification(`Mechanic updated: ${mechanic.name}`, 'mechanic');
    };

    // Handle Delete Mechanic
    const handleDeleteMechanic = (mechanicId) => {
        setMechanics(prev => prev.filter(m => m.id !== mechanicId));
        addNotification('Mechanic deleted', 'mechanic');
    };

    // Toggle Mechanic Status
    const toggleMechanicStatus = (mechanicId) => {
        setMechanics(prev => prev.map(m =>
            m.id === mechanicId ? { ...m, isActive: !m.isActive } : m
        ));
        const mechanic = mechanics.find(m => m.id === mechanicId);
        addNotification(`Mechanic ${mechanic.name} ${!mechanic.isActive ? 'activated' : 'deactivated'}`, 'mechanic');
    };

    // DataGrid Columns
    const columns = [
        {
            field: 'name',
            headerName: 'Mechanic',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'center' }}>
                    
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" fontWeight="bold" color="white">
                            {params.value}
                        </Typography>
                        {/* <Typography variant="caption" color="grey.400">
                            ID: {params.row.id}
                        </Typography> */}
                    </Box>
                </Box>
            ),
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" color="white" sx={{ textAlign: 'center' }}>
                        {params.value}
                    </Typography>
                </Box>
            ),
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'phone',
            headerName: 'Phone',
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" color="white" sx={{ textAlign: 'center' }}>
                        {params.value}
                    </Typography>
                </Box>
            ),
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'location',
            headerName: 'Location',
            width: 200,
            valueGetter: (params) => {
                try {
                    if (!params?.row?.location) return 'N/A';
                    const { city, state } = params.row.location || {};
                    if (!city && !state) return 'N/A';
                    return [city, state].filter(Boolean).join(', ');
                } catch (error) {
                    console.error('Error getting location:', error);
                    return 'N/A';
                }
            },
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" color="white" sx={{ textAlign: 'center' }}>
                        {params.value}
                    </Typography>
                </Box>
            ),
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'rating',
            headerName: 'Rating',
            width: 120,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, height: '100%' }}>
                    <Star sx={{ color: 'gold', fontSize: 16 }} />
                    <Typography variant="body2" color="white">
                        {params.value}
                    </Typography>
                </Box>
            ),
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'services',
            headerName: 'Services',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap', height: '100%' }}>
                    {params.value?.slice(0, 2).map((service, index) => (
                        <Chip
                            key={index}
                            label={service}
                            size="small"
                            sx={{
                                bgcolor: 'grey.800',
                                color: 'grey.200',
                                fontSize: '0.7rem',
                                border: '1px solid #374151'
                            }}
                        />
                    ))}
                    {params.value?.length > 2 && (
                        <Chip
                            label={`+${params.value.length - 2}`}
                            size="small"
                            sx={{
                                bgcolor: 'grey.800',
                                color: 'grey.200',
                                fontSize: '0.7rem',
                                border: '1px solid #374151'
                            }}
                        />
                    )}
                </Box>
            ),
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'isActive',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Chip
                        label={params.value ? 'Active' : 'Inactive'}
                        color={params.value ? 'success' : 'error'}
                        size="small"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    />
                </Box>
            ),
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            type: 'actions',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, height: '100%' }}>
                    <IconButton
                        onClick={() => setSelectedMechanic(params.row)}
                        sx={{
                            color: '#60a5fa',
                            '&:hover': {
                                color: '#3b82f6',
                                backgroundColor: 'rgba(96, 165, 250, 0.1)'
                            }
                        }}
                    >
                        <Visibility />
                    </IconButton>
                    <IconButton
                        onClick={() => setEditingMechanic(params.row)}
                        sx={{
                            color: '#34d399',
                            '&:hover': {
                                color: '#10b981',
                                backgroundColor: 'rgba(52, 211, 153, 0.1)'
                            }
                        }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        onClick={() => toggleMechanicStatus(params.row.id)}
                        sx={{
                            color: params.row.isActive ? '#f59e0b' : '#34d399',
                            '&:hover': {
                                color: params.row.isActive ? '#d97706' : '#10b981',
                                backgroundColor: params.row.isActive ? 'rgba(245, 158, 11, 0.1)' : 'rgba(52, 211, 153, 0.1)'
                            }
                        }}
                    >
                        {params.row.isActive ? <Cancel /> : <CheckCircle />}
                    </IconButton>
                    <IconButton
                        onClick={() => handleDeleteMechanic(params.row.id)}
                        sx={{
                            color: '#ef4444',
                            '&:hover': {
                                color: '#dc2626',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)'
                            }
                        }}
                    >
                        <Delete />
                    </IconButton>
                </Box>
            ),
            headerAlign: 'center',
            align: 'center'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Mechanics Management</h2>
                    <p className="text-gray-400">Manage all registered mechanics</p>
                </div>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowAddMechanic(true)}
                    sx={{
                        bgcolor: 'orange.500',
                        '&:hover': { bgcolor: 'orange.600' }
                    }}
                >
                    Add Mechanic
                </Button>
            </div>

            {/* Mechanics DataGrid */}
            <Box sx={{
                height: 600,
                width: '100%',
                '& .MuiDataGrid-root': {
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    backgroundColor: '#111827'
                }
            }}>
                <DataGrid
                    rows={mechanics}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    components={{ Toolbar: GridToolbar }}
                    sx={{
                        // Base styles
                        border: 'none',
                        color: 'white',
                        backgroundColor: '#111827',

                        // Cell styles - Center content
                        '& .MuiDataGrid-cell': {
                            color: 'white',
                            borderBottom: '1px solid #374151',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:focus': {
                                outline: 'none',
                            },
                            '&:focus-within': {
                                outline: 'none',
                            },
                        },

                        // Row hover and selection
                        '& .MuiDataGrid-row': {
                            color: 'white',
                            backgroundColor: '#111827',
                            '&:hover': {
                                backgroundColor: 'rgba(55, 65, 81, 0.5)',
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(249, 115, 22, 0.16)',
                                '&:hover': {
                                    backgroundColor: 'rgba(249, 115, 22, 0.24)',
                                },
                            },
                        },

                        // Column headers - Center content
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#1f2937',
                            color: '#f3f4f6',
                            borderBottom: '1px solid #374151',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                        },

                        // Column header cells
                        '& .MuiDataGrid-columnHeader': {
                            '&:focus': {
                                outline: 'none',
                            },
                            '&:focus-within': {
                                outline: 'none',
                            },
                            backgroundColor: '#1f2937',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },

                        // Header title
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: '600',
                            color: '#f3f4f6',
                            textAlign: 'center',
                            width: '100%',
                        },

                        // Sort icon
                        '& .MuiDataGrid-iconButtonContainer': {
                            visibility: 'visible',
                            '& .MuiSvgIcon-root': {
                                color: '#9ca3af',
                                '&:hover': {
                                    color: '#f3f4f6',
                                },
                            },
                        },

                        // Menu icon
                        '& .MuiDataGrid-menuIcon': {
                            visibility: 'visible',
                            '& .MuiSvgIcon-root': {
                                color: '#9ca3af',
                                '&:hover': {
                                    color: '#f3f4f6',
                                },
                            },
                        },

                        // Toolbar
                        '& .MuiDataGrid-toolbarContainer': {
                            borderBottom: '1px solid #374151',
                            backgroundColor: '#1f2937',
                            padding: '16px',
                            '& .MuiButton-text': {
                                color: '#e5e7eb',
                                '&:hover': {
                                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                    color: '#f97316',
                                },
                            },
                            '& .MuiInput-root': {
                                color: 'white',
                                '&:before': {
                                    borderBottomColor: '#6b7280',
                                },
                                '&:hover:before': {
                                    borderBottomColor: '#9ca3af',
                                },
                                '&:after': {
                                    borderBottomColor: '#f97316',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#9ca3af',
                            },
                        },

                        // Checkbox
                        '& .MuiCheckbox-root': {
                            color: '#6b7280',
                            '&.Mui-checked': {
                                color: '#f97316',
                            },
                        },

                        // Pagination
                        '& .MuiTablePagination-root': {
                            color: '#d1d5db',
                            borderTop: '1px solid #374151',
                            backgroundColor: '#1f2937',
                            '& .MuiIconButton-root': {
                                color: '#e5e7eb',
                                '&:hover': {
                                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                },
                                '&.Mui-disabled': {
                                    color: '#6b7280',
                                },
                            },
                            '& .MuiTablePagination-selectIcon': {
                                color: '#e5e7eb',
                            },
                        },

                        // Footer
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: '1px solid #374151',
                            backgroundColor: '#1f2937',
                        },

                        // Selected row count
                        '& .MuiDataGrid-selectedRowCount': {
                            color: '#d1d5db',
                        },

                        // Action buttons
                        '& .MuiDataGrid-actionsCell': {
                            '& .MuiIconButton-root': {
                                color: '#e5e7eb',
                                '&:hover': {
                                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                },
                            },
                        },

                        // Column separator
                        '& .MuiDataGrid-columnSeparator': {
                            color: '#374151',
                        },

                        // Virtual scroller
                        '& .MuiDataGrid-virtualScroller': {
                            backgroundColor: '#111827',
                        },
                    }}
                />
            </Box>

            {/* View Mechanic Details Modal */}
            <Modal open={!!selectedMechanic} onClose={() => setSelectedMechanic(null)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', md: '500px' },
                    bgcolor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    boxShadow: 24,
                    p: 4
                }}>
                    {selectedMechanic && (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Mechanic Details</h3>
                                <IconButton onClick={() => setSelectedMechanic(null)} sx={{ color: 'grey.400' }}>
                                    <X />
                                </IconButton>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 2,
                                            bgcolor: 'orange.500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white'
                                        }}
                                    >
                                        <Star size={32} />
                                    </Box>
                                    <div>
                                        <Typography variant="h6" color="white">{selectedMechanic.name}</Typography>
                                        <Chip
                                            label={selectedMechanic.isActive ? 'Active' : 'Inactive'}
                                            color={selectedMechanic.isActive ? 'success' : 'error'}
                                            sx={{ mt: 1, color: 'white' }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Typography variant="body2" color="grey.400">Mechanic ID</Typography>
                                        <Typography variant="body1" color="white">{selectedMechanic.id}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2" color="grey.400">Join Date</Typography>
                                        <Typography variant="body1" color="white">{selectedMechanic.joinedDate}</Typography>
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="body2" color="grey.400">Contact Information</Typography>
                                    <Typography variant="body1" color="white">{selectedMechanic.email}</Typography>
                                    <Typography variant="body1" color="white">{selectedMechanic.phone}</Typography>
                                </div>

                                <div>
                                    <Typography variant="body2" color="grey.400">Location</Typography>
                                    <Typography variant="body1" color="white">
                                        {selectedMechanic.location?.street && `${selectedMechanic.location.street}, `}
                                        {selectedMechanic.location?.city && `${selectedMechanic.location.city}, `}
                                        {selectedMechanic.location?.state}
                                    </Typography>
                                    <Typography variant="body2" color="grey.400">
                                        {selectedMechanic.location?.pincode && `Pincode: ${selectedMechanic.location.pincode}`}
                                    </Typography>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Card sx={{ bgcolor: '#374151' }}>
                                        <CardContent>
                                            <Typography variant="body2" color="grey.400">Total Bookings</Typography>
                                            <Typography variant="h4" color="white">{selectedMechanic.totalBookings}</Typography>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{ bgcolor: '#374151' }}>
                                        <CardContent>
                                            <Typography variant="body2" color="grey.400">Rating</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Star sx={{ color: 'gold' }} />
                                                <Typography variant="h4" color="white">{selectedMechanic.rating}</Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div>
                                    <Typography variant="body2" color="grey.400">Services Offered</Typography>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {selectedMechanic.services?.map((service, index) => (
                                            <Chip
                                                key={index}
                                                label={service}
                                                size="small"
                                                sx={{
                                                    bgcolor: '#374151',
                                                    color: 'grey.200',
                                                    border: '1px solid #4b5563'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </Box>
            </Modal>

            {/* Add Mechanic Modal */}
            <AnimatePresence>
                {showAddMechanic && (
                    <AddEditMechanicModal
                        mechanic={newMechanic}
                        setMechanic={setNewMechanic}
                        onSave={handleAddMechanic}
                        onClose={() => setShowAddMechanic(false)}
                        isEdit={false}
                    />
                )}
            </AnimatePresence>

            {/* Edit Mechanic Modal */}
            <AnimatePresence>
                {editingMechanic && (
                    <AddEditMechanicModal
                        mechanic={editingMechanic}
                        setMechanic={setEditingMechanic}
                        onSave={() => handleEditMechanic(editingMechanic)}
                        onClose={() => setEditingMechanic(null)}
                        isEdit={true}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Add/Edit Mechanic Modal Component (keep the same as before)
const AddEditMechanicModal = ({ mechanic, setMechanic, onSave, onClose, isEdit }) => {
    return (
        <Modal open={true} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', md: '80%', lg: '60%' },
                maxHeight: '90vh',
                overflow: 'auto',
                bgcolor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                boxShadow: 24,
                p: 4
            }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">
                        {isEdit ? 'Edit Mechanic' : 'Add New Mechanic'}
                    </h3>
                    <IconButton onClick={onClose} sx={{ color: 'grey.400' }}>
                        <X />
                    </IconButton>
                </div>

                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* ... (keep all the form fields exactly as they were) ... */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
                        <TextField
                            label="Name"
                            value={mechanic.name}
                            onChange={(e) => setMechanic(prev => ({ ...prev, name: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root': { color: 'grey.400' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#374151' },
                                    '&:hover fieldset': { borderColor: '#4b5563' },
                                    '&.Mui-focused fieldset': { borderColor: '#f97316' }
                                }
                            }}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={mechanic.email}
                            onChange={(e) => setMechanic(prev => ({ ...prev, email: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root': { color: 'grey.400' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#374151' },
                                    '&:hover fieldset': { borderColor: '#4b5563' },
                                    '&.Mui-focused fieldset': { borderColor: '#f97316' }
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
                        <TextField
                            label="Phone"
                            value={mechanic.phone}
                            onChange={(e) => setMechanic(prev => ({ ...prev, phone: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root': { color: 'grey.400' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#374151' },
                                    '&:hover fieldset': { borderColor: '#4b5563' },
                                    '&.Mui-focused fieldset': { borderColor: '#f97316' }
                                }
                            }}
                        />
                        <TextField
                            label="Services (comma separated)"
                            value={mechanic.services?.join(', ') || ''}
                            onChange={(e) => setMechanic(prev => ({
                                ...prev,
                                services: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                            }))}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root': { color: 'grey.400' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#374151' },
                                    '&:hover fieldset': { borderColor: '#4b5563' },
                                    '&.Mui-focused fieldset': { borderColor: '#f97316' }
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
                        <TextField
                            label="State"
                            value={mechanic.state}
                            onChange={(e) => setMechanic(prev => ({ ...prev, state: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root': { color: 'grey.400' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#374151' },
                                    '&:hover fieldset': { borderColor: '#4b5563' },
                                    '&.Mui-focused fieldset': { borderColor: '#f97316' }
                                }
                            }}
                        />
                        <TextField
                            label="City"
                            value={mechanic.city}
                            onChange={(e) => setMechanic(prev => ({ ...prev, city: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root': { color: 'grey.400' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#374151' },
                                    '&:hover fieldset': { borderColor: '#4b5563' },
                                    '&.Mui-focused fieldset': { borderColor: '#f97316' }
                                }
                            }}
                        />
                    </Box>

                    <TextField
                        label="Street Address"
                        value={mechanic.street}
                        onChange={(e) => setMechanic(prev => ({ ...prev, street: e.target.value }))}
                        fullWidth
                        sx={{
                            '& .MuiInputLabel-root': { color: 'grey.400' },
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: '#374151' },
                                '&:hover fieldset': { borderColor: '#4b5563' },
                                '&.Mui-focused fieldset': { borderColor: '#f97316' }
                            }
                        }}
                    />

                    <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr 1fr' }, gap: 2 }}>
                        <TextField
                            label="Pincode"
                            value={mechanic.pincode}
                            onChange={(e) => setMechanic(prev => ({ ...prev, pincode: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root': { color: 'grey.400' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#374151' },
                                    '&:hover fieldset': { borderColor: '#4b5563' },
                                    '&.Mui-focused fieldset': { borderColor: '#f97316' }
                                }
                            }}
                        />
                        <TextField
                            label="Latitude"
                            value={mechanic.latitude}
                            onChange={(e) => setMechanic(prev => ({ ...prev, latitude: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root': { color: 'grey.400' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#374151' },
                                    '&:hover fieldset': { borderColor: '#4b5563' },
                                    '&.Mui-focused fieldset': { borderColor: '#f97316' }
                                }
                            }}
                        />
                        <TextField
                            label="Longitude"
                            value={mechanic.longitude}
                            onChange={(e) => setMechanic(prev => ({ ...prev, longitude: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root': { color: 'grey.400' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#374151' },
                                    '&:hover fieldset': { borderColor: '#4b5563' },
                                    '&.Mui-focused fieldset': { borderColor: '#f97316' }
                                }
                            }}
                        />
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={mechanic.isActive}
                                onChange={(e) => setMechanic(prev => ({ ...prev, isActive: e.target.checked }))}
                                sx={{
                                    color: '#6b7280',
                                    '&.Mui-checked': {
                                        color: '#f97316',
                                    }
                                }}
                            />
                        }
                        label="Active Mechanic"
                        sx={{ color: 'grey.300' }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            fullWidth
                            sx={{
                                color: 'grey.300',
                                borderColor: '#374151',
                                '&:hover': {
                                    borderColor: '#4b5563',
                                    backgroundColor: 'rgba(55, 65, 81, 0.1)'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onSave}
                            fullWidth
                            sx={{
                                bgcolor: 'orange.500',
                                '&:hover': { bgcolor: 'orange.600' }
                            }}
                        >
                            {isEdit ? 'Update Mechanic' : 'Add Mechanic'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default MechanicsManagement;