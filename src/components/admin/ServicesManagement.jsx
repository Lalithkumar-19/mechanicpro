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
    Typography,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import {
    Edit,
    Delete,
    Add,
    CheckCircle,
    Cancel
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ServicesManagement = ({ services, setServices, addNotification }) => {
    const [showAddService, setShowAddService] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        basePrice: '',
        estimatedDuration: '',
        category: '',
        isActive: true
    });

    // Handle Add Service
    const handleAddService = () => {
        const service = {
            ...newService,
            id: `S${Date.now()}`,
            basePrice: parseInt(newService.basePrice)
        };

        setServices(prev => [service, ...prev]);
        setShowAddService(false);
        setNewService({
            name: '',
            description: '',
            basePrice: '',
            estimatedDuration: '',
            category: '',
            isActive: true
        });
        addNotification(`New service added: ${service.name}`, 'service');
    };

    // Handle Edit Service
    const handleEditService = (service) => {
        setServices(prev => prev.map(s => s.id === service.id ? service : s));
        setEditingService(null);
        addNotification(`Service updated: ${service.name}`, 'service');
    };

    // Handle Delete Service
    const handleDeleteService = (serviceId) => {
        setServices(prev => prev.filter(s => s.id !== serviceId));
        addNotification('Service deleted', 'service');
    };

    // Toggle Service Status
    const toggleServiceStatus = (serviceId) => {
        setServices(prev => prev.map(s =>
            s.id === serviceId ? { ...s, isActive: !s.isActive } : s
        ));
        const service = services.find(s => s.id === serviceId);
        addNotification(`Service ${service.name} ${!service.isActive ? 'activated' : 'deactivated'}`, 'service');
    };

    // DataGrid Columns
    const columns = [
        {
            field: 'name',
            headerName: 'Service Name',
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2" color="white" fontWeight="bold">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 300,
            renderCell: (params) => (
                <Typography variant="body2" color="white">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'basePrice',
            headerName: 'Base Price',
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight="bold" color="orange.500">
                    ₹{params.value}
                </Typography>
            )
        },
        {
            field: 'estimatedDuration',
            headerName: 'Duration',
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2" color="white">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{
                        bgcolor: '#374151',
                        color: '#e5e7eb',
                        fontWeight: 'bold'
                    }}
                />
            )
        },
        {
            field: 'isActive',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Active' : 'Inactive'}
                    sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        backgroundColor: params.value ? '#10b981' : '#ef4444'
                    }}
                    size="small"
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            type: 'actions',
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => setEditingService(params.row)}
                    sx={{
                        color: '#60a5fa',
                        '&:hover': {
                            color: '#3b82f6',
                            backgroundColor: 'rgba(96, 165, 250, 0.1)'
                        }
                    }}
                />,
                <GridActionsCellItem
                    icon={params.row.isActive ? <Cancel /> : <CheckCircle />}
                    label={params.row.isActive ? 'Deactivate' : 'Activate'}
                    onClick={() => toggleServiceStatus(params.row.id)}
                    sx={{
                        color: params.row.isActive ? '#f59e0b' : '#34d399',
                        '&:hover': {
                            color: params.row.isActive ? '#d97706' : '#10b981',
                            backgroundColor: params.row.isActive ? 'rgba(245, 158, 11, 0.1)' : 'rgba(52, 211, 153, 0.1)'
                        }
                    }}
                />,
                <GridActionsCellItem
                    icon={<Delete />}
                    label="Delete"
                    onClick={() => handleDeleteService(params.row.id)}
                    sx={{
                        color: '#ef4444',
                        '&:hover': {
                            color: '#dc2626',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)'
                        }
                    }}
                />
            ]
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
                    <h2 className="text-2xl font-bold text-white mb-2">Services Management</h2>
                    <p className="text-gray-400">Manage all service types and pricing</p>
                </div>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowAddService(true)}
                    sx={{
                        bgcolor: '#f97316',
                        '&:hover': {
                            bgcolor: '#ea580c',
                            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                        }
                    }}
                >
                    Add Service
                </Button>
            </div>

            {/* Services DataGrid */}
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
                    rows={services}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    components={{ Toolbar: GridToolbar }}
                    sx={{
                        // Base styles
                        border: 'none',
                        color: 'white',
                        backgroundColor: '#111827',

                        // Cell styles
                        '& .MuiDataGrid-cell': {
                            color: 'white',
                            borderBottom: '1px solid #374151',
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

                        // Column headers
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
                        },

                        // Header title
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: '600',
                            color: '#f3f4f6',
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

            {/* Add Service Modal */}
            <AnimatePresence>
                {showAddService && (
                    <AddEditServiceModal
                        service={newService}
                        setService={setNewService}
                        onSave={handleAddService}
                        onClose={() => setShowAddService(false)}
                        isEdit={false}
                    />
                )}
            </AnimatePresence>

            {/* Edit Service Modal */}
            <AnimatePresence>
                {editingService && (
                    <AddEditServiceModal
                        service={editingService}
                        setService={setEditingService}
                        onSave={() => handleEditService(editingService)}
                        onClose={() => setEditingService(null)}
                        isEdit={true}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Add/Edit Service Modal Component
const AddEditServiceModal = ({ service, setService, onSave, onClose, isEdit }) => {
    return (
        <Modal open={true} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', md: '500px' },
                maxHeight: '80vh',
                overflow: 'auto',
                bgcolor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                boxShadow: 24,
                p: 4
            }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">
                        {isEdit ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <IconButton onClick={onClose} sx={{
                        color: '#9ca3af',
                        '&:hover': {
                            backgroundColor: '#374151',
                            color: 'white'
                        }
                    }}>
                        <X />
                    </IconButton>
                </div>

                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Service Name"
                        value={service.name}
                        onChange={(e) => setService(prev => ({ ...prev, name: e.target.value }))}
                        fullWidth
                        sx={{
                            '& .MuiInputLabel-root': { color: '#9ca3af' },
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: '#374151',
                                    borderRadius: '8px'
                                },
                                '&:hover fieldset': {
                                    borderColor: '#4b5563'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#f97316',
                                    borderWidth: '2px'
                                }
                            }
                        }}
                    />

                    <TextField
                        label="Description"
                        value={service.description}
                        onChange={(e) => setService(prev => ({ ...prev, description: e.target.value }))}
                        multiline
                        rows={3}
                        fullWidth
                        sx={{
                            '& .MuiInputLabel-root': { color: '#9ca3af' },
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: '#374151',
                                    borderRadius: '8px'
                                },
                                '&:hover fieldset': {
                                    borderColor: '#4b5563'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#f97316',
                                    borderWidth: '2px'
                                }
                            }
                        }}
                    />

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField
                            label="Base Price (₹)"
                            type="number"
                            value={service.basePrice}
                            onChange={(e) => setService(prev => ({ ...prev, basePrice: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root': { color: '#9ca3af' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': {
                                        borderColor: '#374151',
                                        borderRadius: '8px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#4b5563'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#f97316',
                                        borderWidth: '2px'
                                    }
                                }
                            }}
                        />
                        <TextField
                            label="Estimated Duration"
                            value={service.estimatedDuration}
                            onChange={(e) => setService(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root': { color: '#9ca3af' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': {
                                        borderColor: '#374151',
                                        borderRadius: '8px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#4b5563'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#f97316',
                                        borderWidth: '2px'
                                    }
                                }
                            }}
                        />
                    </Box>

                    <FormControl fullWidth>
                        <InputLabel sx={{ color: '#9ca3af' }}>Category</InputLabel>
                        <Select
                            value={service.category}
                            onChange={(e) => setService(prev => ({ ...prev, category: e.target.value }))}
                            label="Category"
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#374151',
                                    borderRadius: '8px'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#4b5563'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#f97316',
                                    borderWidth: '2px'
                                },
                                '& .MuiSvgIcon-root': {
                                    color: '#9ca3af'
                                }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: '#1f2937',
                                        color: 'white',
                                        '& .MuiMenuItem-root': {
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#374151'
                                            }
                                        }
                                    }
                                }
                            }}
                        >
                            <MenuItem value="Maintenance">Maintenance</MenuItem>
                            <MenuItem value="Repair">Repair</MenuItem>
                            <MenuItem value="AC">AC Service</MenuItem>
                            <MenuItem value="Electrical">Electrical</MenuItem>
                            <MenuItem value="Engine">Engine</MenuItem>
                            <MenuItem value="Transmission">Transmission</MenuItem>
                            <MenuItem value="Brake">Brake Service</MenuItem>
                            <MenuItem value="Tire">Tire Service</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={service.isActive}
                                onChange={(e) => setService(prev => ({ ...prev, isActive: e.target.checked }))}
                                sx={{
                                    color: '#f97316',
                                    '&.Mui-checked': {
                                        color: '#f97316',
                                    }
                                }}
                            />
                        }
                        label="Active Service"
                        sx={{ color: '#e5e7eb' }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            fullWidth
                            sx={{
                                color: '#e5e7eb',
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
                                bgcolor: '#f97316',
                                '&:hover': {
                                    bgcolor: '#ea580c',
                                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                                }
                            }}
                        >
                            {isEdit ? 'Update Service' : 'Add Service'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ServicesManagement;