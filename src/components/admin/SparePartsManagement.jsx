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
    CardContent
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    LocalShipping,
    Inventory,
    Visibility
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const SparePartsManagement = ({ spareParts, setSpareParts, addNotification }) => {
    const [selectedSparePart, setSelectedSparePart] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    // Update Spare Part Status
    const updateSparePartStatus = (requestId, newStatus) => {
        setSpareParts(prev => prev.map(request =>
            request.id === requestId ? { ...request, status: newStatus } : request
        ));

        const request = spareParts.find(r => r.id === requestId);
        const statusMessages = {
            'approved': 'approved',
            'rejected': 'rejected',
            'dispatched': 'dispatched',
            'delivered': 'delivered'
        };

        addNotification(`Spare part request ${requestId} ${statusMessages[newStatus]}`, 'spare-part');
    };

    // Filter spare parts by status
    const filteredSpareParts = statusFilter === 'all'
        ? spareParts
        : spareParts.filter(part => part.status === statusFilter);

    // DataGrid Columns
    const columns = [
        {
            field: 'id',
            headerName: 'Request ID',
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2" color="white" fontWeight="bold">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'mechanic',
            headerName: 'Mechanic',
            width: 180,
            valueGetter: (params) => {
                if (!params.row?.mechanic) return 'N/A';
                return params.row.mechanic.name || 'Unknown Mechanic';
            },
            renderCell: (params) => {
                const mechanic = params.row.mechanic || {};
                return (
                    <Box>
                        <Typography variant="body2" fontWeight="bold" color="white">
                            {mechanic.name || 'Not Assigned'}
                        </Typography>
                        <Typography variant="caption" color="grey.400">
                            {mechanic.phone || 'N/A'}
                        </Typography>
                    </Box>
                );
            }
        },
        {
            field: 'serviceId',
            headerName: 'Service ID',
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2" color="white">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'partName',
            headerName: 'Part Details',
            width: 200,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" fontWeight="bold" color="white">
                        {params.value}
                    </Typography>
                    <Typography variant="caption" color="grey.400">
                        Qty: {params.row.quantity}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'carModel',
            headerName: 'Car Model',
            width: 150,
            renderCell: (params) => (
                <Typography variant="body2" color="white">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'year',
            headerName: 'Year',
            width: 100,
            renderCell: (params) => (
                <Typography variant="body2" color="white">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'urgency',
            headerName: 'Urgency',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        backgroundColor:
                            params.value === 'high' ? '#ef4444' :
                                params.value === 'medium' ? '#f59e0b' : '#10b981'
                    }}
                />
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <Select
                    value={params.value}
                    onChange={(e) => updateSparePartStatus(params.row.id, e.target.value)}
                    size="small"
                    sx={{
                        color: 'white',
                        backgroundColor: '#1f2937',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #374151',
                            borderRadius: '6px'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#4b5563'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#f97316'
                        },
                        '& .MuiSelect-select': {
                            py: 0.5,
                            color: 'white'
                        },
                        '& .MuiSvgIcon-root': {
                            color: '#9ca3af'
                        }
                    }}
                >
                    <MenuItem value="pending">
                        <Chip label="Pending" color="warning" size="small" sx={{ color: 'white' }} />
                    </MenuItem>
                    <MenuItem value="approved">
                        <Chip label="Approved" color="success" size="small" sx={{ color: 'white' }} />
                    </MenuItem>
                    <MenuItem value="dispatched">
                        <Chip label="Dispatched" color="info" size="small" sx={{ color: 'white' }} />
                    </MenuItem>
                    <MenuItem value="delivered">
                        <Chip label="Delivered" color="primary" size="small" sx={{ color: 'white' }} />
                    </MenuItem>
                    <MenuItem value="rejected">
                        <Chip label="Rejected" color="error" size="small" sx={{ color: 'white' }} />
                    </MenuItem>
                </Select>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            type: 'actions',
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<Visibility />}
                    label="View Details"
                    onClick={() => setSelectedSparePart(params.row)}
                    sx={{
                        color: '#60a5fa',
                        '&:hover': {
                            color: '#3b82f6',
                            backgroundColor: 'rgba(96, 165, 250, 0.1)'
                        }
                    }}
                />,
                <GridActionsCellItem
                    icon={<CheckCircle />}
                    label="Approve"
                    onClick={() => updateSparePartStatus(params.row.id, 'approved')}
                    sx={{
                        color: '#34d399',
                        '&:hover': {
                            color: '#10b981',
                            backgroundColor: 'rgba(52, 211, 153, 0.1)'
                        },
                        '&.Mui-disabled': {
                            color: '#6b7280'
                        }
                    }}
                    disabled={params.row.status !== 'pending'}
                />,
                <GridActionsCellItem
                    icon={<LocalShipping />}
                    label="Dispatch"
                    onClick={() => updateSparePartStatus(params.row.id, 'dispatched')}
                    sx={{
                        color: '#f59e0b',
                        '&:hover': {
                            color: '#d97706',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)'
                        },
                        '&.Mui-disabled': {
                            color: '#6b7280'
                        }
                    }}
                    disabled={params.row.status !== 'approved'}
                />,
                <GridActionsCellItem
                    icon={<Inventory />}
                    label="Mark Delivered"
                    onClick={() => updateSparePartStatus(params.row.id, 'delivered')}
                    sx={{
                        color: '#8b5cf6',
                        '&:hover': {
                            color: '#7c3aed',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)'
                        },
                        '&.Mui-disabled': {
                            color: '#6b7280'
                        }
                    }}
                    disabled={params.row.status !== 'dispatched'}
                />,
                <GridActionsCellItem
                    icon={<Cancel />}
                    label="Reject"
                    onClick={() => updateSparePartStatus(params.row.id, 'rejected')}
                    sx={{
                        color: '#ef4444',
                        '&:hover': {
                            color: '#dc2626',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)'
                        },
                        '&.Mui-disabled': {
                            color: '#6b7280'
                        }
                    }}
                    disabled={params.row.status !== 'pending'}
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
                    <h2 className="text-2xl font-bold text-white mb-2">Spare Parts Management</h2>
                    <p className="text-gray-400">Manage all spare part requests</p>
                </div>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel sx={{ color: 'grey.400' }}>Filter by Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Filter by Status"
                        sx={{
                            color: 'white',
                            backgroundColor: '#1f2937',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#374151'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#4b5563'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#f97316'
                            },
                            '& .MuiSvgIcon-root': {
                                color: '#9ca3af'
                            }
                        }}
                    >
                        <MenuItem value="all" sx={{ color: 'white' }}>All Status</MenuItem>
                        <MenuItem value="pending" sx={{ color: 'white' }}>Pending</MenuItem>
                        <MenuItem value="approved" sx={{ color: 'white' }}>Approved</MenuItem>
                        <MenuItem value="dispatched" sx={{ color: 'white' }}>Dispatched</MenuItem>
                        <MenuItem value="delivered" sx={{ color: 'white' }}>Delivered</MenuItem>
                        <MenuItem value="rejected" sx={{ color: 'white' }}>Rejected</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* Spare Parts DataGrid */}
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
                    rows={filteredSpareParts}
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

            {/* Spare Part Details Modal */}
            <Modal open={!!selectedSparePart} onClose={() => setSelectedSparePart(null)}>
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
                    {selectedSparePart && (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Spare Part Request Details</h3>
                                <IconButton onClick={() => setSelectedSparePart(null)} sx={{ color: 'grey.400' }}>
                                    <X />
                                </IconButton>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Typography variant="body2" color="grey.400">Request ID</Typography>
                                        <Typography variant="body1" color="white">{selectedSparePart.id}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2" color="grey.400">Status</Typography>
                                        <Chip
                                            label={selectedSparePart.status}
                                            color={
                                                selectedSparePart.status === 'approved' ? 'success' :
                                                    selectedSparePart.status === 'rejected' ? 'error' :
                                                        selectedSparePart.status === 'dispatched' ? 'info' :
                                                            selectedSparePart.status === 'delivered' ? 'primary' : 'warning'
                                            }
                                            size="small"
                                            sx={{ color: 'white', fontWeight: 'bold' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="body2" color="grey.400">Mechanic</Typography>
                                    <Typography variant="body1" color="white">{selectedSparePart.mechanic?.name || 'N/A'}</Typography>
                                </div>

                                <div>
                                    <Typography variant="body2" color="grey.400">Service ID</Typography>
                                    <Typography variant="body1" color="white">{selectedSparePart.serviceId}</Typography>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Typography variant="body2" color="grey.400">Part Name</Typography>
                                        <Typography variant="body1" color="white">{selectedSparePart.partName}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2" color="grey.400">Quantity</Typography>
                                        <Typography variant="body1" color="white">{selectedSparePart.quantity}</Typography>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Typography variant="body2" color="grey.400">Car Model</Typography>
                                        <Typography variant="body1" color="white">{selectedSparePart.carModel}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2" color="grey.400">Year</Typography>
                                        <Typography variant="body1" color="white">{selectedSparePart.year}</Typography>
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="body2" color="grey.400">Urgency</Typography>
                                    <Chip
                                        label={selectedSparePart.urgency}
                                        sx={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            backgroundColor:
                                                selectedSparePart.urgency === 'high' ? '#ef4444' :
                                                    selectedSparePart.urgency === 'medium' ? '#f59e0b' : '#10b981'
                                        }}
                                        size="small"
                                    />
                                </div>

                                <div>
                                    <Typography variant="body2" color="grey.400">Requested At</Typography>
                                    <Typography variant="body1" color="white">
                                        {new Date(selectedSparePart.requestedAt).toLocaleDateString()} at {' '}
                                        {new Date(selectedSparePart.requestedAt).toLocaleTimeString()}
                                    </Typography>
                                </div>
                            </div>
                        </>
                    )}
                </Box>
            </Modal>
        </motion.div>
    );
};

export default SparePartsManagement;