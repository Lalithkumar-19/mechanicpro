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
  Edit,
  Delete,
  Visibility,
  Cancel,
  CheckCircle,
  PlayArrow
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const BookingsManagement = ({ bookings, setBookings, mechanics, addNotification }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reassignModal, setReassignModal] = useState({ open: false, bookingId: null });

  // Handle Booking Actions (Accept, Decline, Start Service, Complete, etc.)
  const handleBookingAction = (bookingId, action) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        let newStatus = booking.status;
        let message = '';

        switch (action) {
          case 'accept':
            newStatus = 'confirmed';
            message = 'Booking accepted';
            break;
          case 'decline':
            newStatus = 'cancelled';
            message = 'Booking declined';
            break;
          case 'start':
            newStatus = 'in-progress';
            message = 'Service started';
            break;
          case 'complete':
            newStatus = 'completed';
            message = 'Service completed';
            break;
          case 'cancel':
            newStatus = 'cancelled';
            message = 'Booking cancelled';
            break;
          default:
            return booking;
        }

        addNotification(`${message} for booking ${bookingId}`, 'booking');
        return { ...booking, status: newStatus };
      }
      return booking;
    }));
  };

  // Update Booking Status
  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev => prev.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    addNotification(`Booking ${bookingId} status updated to ${newStatus}`, 'booking');
  };

  // Reassign Mechanic
  const reassignMechanic = (bookingId, newMechanicId) => {
    const mechanic = mechanics.find(m => m.id === newMechanicId);
    if (mechanic) {
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId ? {
          ...booking,
          mechanic: { id: mechanic.id, name: mechanic.name }
        } : booking
      ));
      addNotification(`Booking ${bookingId} reassigned to ${mechanic.name}`, 'booking');
      setReassignModal({ open: false, bookingId: null });
    }
  };

  // Get appropriate action buttons based on booking status
  const getActionButtons = (params) => {
    const actions = [];

    // View details button for all statuses
    actions.push(
      <GridActionsCellItem
        icon={<Visibility />}
        label="View Details"
        onClick={() => setSelectedBooking(params.row)}
        sx={{
          color: '#60a5fa',
          '&:hover': {
            color: '#3b82f6',
            backgroundColor: 'rgba(96, 165, 250, 0.1)'
          }
        }}
      />
    );

    // Status-specific actions
    switch (params.row.status) {
      case 'pending':
        actions.push(
          <GridActionsCellItem
            icon={<CheckCircle />}
            label="Accept Booking"
            onClick={() => handleBookingAction(params.row.id, 'accept')}
            sx={{
              color: '#34d399',
              '&:hover': {
                color: '#10b981',
                backgroundColor: 'rgba(52, 211, 153, 0.1)'
              }
            }}
          />,
          <GridActionsCellItem
            icon={<Cancel />}
            label="Decline Booking"
            onClick={() => handleBookingAction(params.row.id, 'decline')}
            sx={{
              color: '#ef4444',
              '&:hover': {
                color: '#dc2626',
                backgroundColor: 'rgba(239, 68, 68, 0.1)'
              }
            }}
          />
        );
        break;
      case 'confirmed':
        actions.push(
          <GridActionsCellItem
            icon={<PlayArrow />}
            label="Start Service"
            onClick={() => handleBookingAction(params.row.id, 'start')}
            sx={{
              color: '#f59e0b',
              '&:hover': {
                color: '#d97706',
                backgroundColor: 'rgba(245, 158, 11, 0.1)'
              }
            }}
          />,
          <GridActionsCellItem
            icon={<Edit />}
            label="Reassign Mechanic"
            onClick={() => setReassignModal({ open: true, bookingId: params.row.id })}
            sx={{
              color: '#8b5cf6',
              '&:hover': {
                color: '#7c3aed',
                backgroundColor: 'rgba(139, 92, 246, 0.1)'
              }
            }}
          />
        );
        break;
      case 'in-progress':
        actions.push(
          <GridActionsCellItem
            icon={<CheckCircle />}
            label="Mark Complete"
            onClick={() => handleBookingAction(params.row.id, 'complete')}
            sx={{
              color: '#34d399',
              '&:hover': {
                color: '#10b981',
                backgroundColor: 'rgba(52, 211, 153, 0.1)'
              }
            }}
          />
        );
        break;
      default:
        // For completed or cancelled bookings, only show view details
        break;
    }

    // Cancel button for all active statuses
    if (['pending', 'confirmed', 'in-progress'].includes(params.row.status)) {
      actions.push(
        <GridActionsCellItem
          icon={<Cancel />}
          label="Cancel Booking"
          onClick={() => handleBookingAction(params.row.id, 'cancel')}
          sx={{
            color: '#ef4444',
            '&:hover': {
              color: '#dc2626',
              backgroundColor: 'rgba(239, 68, 68, 0.1)'
            }
          }}
        />
      );
    }

    return actions;
  };

  // DataGrid Columns
  const columns = [
    {
      field: 'id',
      headerName: 'Booking ID',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" color="white" fontWeight="bold">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'customer',
      headerName: 'Customer',
      width: 180,
      valueGetter: (params) => {
        if (!params?.row?.customer) return 'N/A';
        return params.row.customer?.name || 'Unknown';
      },
      renderCell: (params) => {
        const customer = params?.row?.customer || {};
        return (
          <Box height={20}>
            <Typography variant="body2" fontWeight="bold" color="white">
              {customer.name || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="grey.400">
              {customer.phone || 'N/A'}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'vehicle',
      headerName: 'Vehicle',
      width: 180,
      valueGetter: (params) => {
        if (!params.row?.vehicle) return 'N/A';
        return params.row.vehicle.model || `${params.row.vehicle.make} ${params.row.vehicle.model}`.trim() || 'N/A';
      },
      renderCell: (params) => {
        const vehicle = params.row.vehicle || {};
        return (
          <Box>
            <Typography variant="body2" fontWeight="bold" color="white">
              {vehicle.make || 'Vehicle'} {vehicle.model || ''}
            </Typography>
            <Typography variant="caption" color="grey.400">
              {vehicle.plateNumber || 'N/A'}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'dateTime',
      headerName: 'Date/Time',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="white">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'serviceType',
      headerName: 'Service',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="white">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'mechanic',
      headerName: 'Mechanic',
      width: 180,
      valueGetter: (params) => {
        if (!params?.row?.mechanic) return 'Not Assigned';
        return params.row.mechanic?.name || 'Unknown Mechanic';
      },
      renderCell: (params) => {
        const mechanic = params?.row?.mechanic || {};
        return (
          <Box>
            <Typography variant="body2" fontWeight="bold" color="white">
              {mechanic.name || 'Not Assigned'}
            </Typography>
            <Typography variant="caption" color="grey.400">
              {mechanic.rating ? `★ ${mechanic.rating}` : 'No rating'}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="orange.500">
          ₹{params.value}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => updateBookingStatus(params.row.id, e.target.value)}
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
          <MenuItem value="confirmed">
            <Chip label="Confirmed" color="info" size="small" sx={{ color: 'white' }} />
          </MenuItem>
          <MenuItem value="in-progress">
            <Chip label="In Progress" color="primary" size="small" sx={{ color: 'white' }} />
          </MenuItem>
          <MenuItem value="completed">
            <Chip label="Completed" color="success" size="small" sx={{ color: 'white' }} />
          </MenuItem>
          <MenuItem value="cancelled">
            <Chip label="Cancelled" color="error" size="small" sx={{ color: 'white' }} />
          </MenuItem>
        </Select>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      type: 'actions',
      getActions: (params) => getActionButtons(params)
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
          <h2 className="text-2xl font-bold text-white mb-2">Bookings Management</h2>
          <p className="text-gray-400">Manage all service bookings</p>
        </div>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'grey.400' }}>Filter Status</InputLabel>
            <Select
              label="Filter Status"
              defaultValue="all"
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
              <MenuItem value="confirmed" sx={{ color: 'white' }}>Confirmed</MenuItem>
              <MenuItem value="in-progress" sx={{ color: 'white' }}>In Progress</MenuItem>
              <MenuItem value="completed" sx={{ color: 'white' }}>Completed</MenuItem>
              <MenuItem value="cancelled" sx={{ color: 'white' }}>Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>

      {/* Bookings DataGrid */}
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
          rows={bookings}
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

      {/* Booking Details Modal */}
      <Modal open={!!selectedBooking} onClose={() => setSelectedBooking(null)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '600px' },
          bgcolor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '12px',
          boxShadow: 24,
          p: 4
        }}>
          {selectedBooking && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Booking Details</h3>
                <IconButton onClick={() => setSelectedBooking(null)} sx={{ color: 'grey.400' }}>
                  <X />
                </IconButton>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="body2" color="grey.400">Booking ID</Typography>
                    <Typography variant="body1" color="white">{selectedBooking.id}</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" color="grey.400">Status</Typography>
                    <Chip
                      label={selectedBooking.status}
                      color={
                        selectedBooking.status === 'completed' ? 'success' :
                          selectedBooking.status === 'cancelled' ? 'error' :
                            selectedBooking.status === 'in-progress' ? 'primary' : 'warning'
                      }
                      size="small"
                      sx={{ color: 'white', fontWeight: 'bold' }}
                    />
                  </div>
                </div>

                <div>
                  <Typography variant="body2" color="grey.400">Customer</Typography>
                  <Typography variant="body1" color="white">{selectedBooking.customer?.name}</Typography>
                  <Typography variant="body2" color="grey.400">{selectedBooking.customer?.phone}</Typography>
                </div>

                <div>
                  <Typography variant="body2" color="grey.400">Vehicle</Typography>
                  <Typography variant="body1" color="white">
                    {selectedBooking.vehicle?.model} ({selectedBooking.vehicle?.year})
                  </Typography>
                  <Typography variant="body2" color="grey.400">
                    Registration: {selectedBooking.vehicle?.registration}
                  </Typography>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="body2" color="grey.400">Service Type</Typography>
                    <Typography variant="body1" color="white">{selectedBooking.serviceType}</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" color="grey.400">Mechanic</Typography>
                    <Typography variant="body1" color="white">{selectedBooking.mechanic?.name || 'Unassigned'}</Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="body2" color="grey.400">Spare Parts</Typography>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedBooking.spareParts?.map((part, index) => (
                      <Chip
                        key={index}
                        label={part}
                        size="small"
                        sx={{
                          bgcolor: '#374151',
                          color: 'grey.200',
                          border: '1px solid #4b5563'
                        }}
                      />
                    )) || <Typography variant="body2" color="grey.400">No spare parts requested</Typography>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="body2" color="grey.400">Date & Time</Typography>
                    <Typography variant="body1" color="white">{selectedBooking.dateTime}</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" color="grey.400">Amount</Typography>
                    <Typography variant="h6" color="orange.500">₹{selectedBooking.amount}</Typography>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outlined"
                    onClick={() => setReassignModal({ open: true, bookingId: selectedBooking.id })}
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
                    Reassign Mechanic
                  </Button>
                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleBookingAction(selectedBooking.id, 'cancel')}
                      fullWidth
                      sx={{
                        bgcolor: '#ef4444',
                        '&:hover': { bgcolor: '#dc2626' }
                      }}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>

      {/* Reassign Mechanic Modal */}
      <Modal open={reassignModal.open} onClose={() => setReassignModal({ open: false, bookingId: null })}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '400px' },
          bgcolor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '12px',
          boxShadow: 24,
          p: 4
        }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Reassign Mechanic</h3>
            <IconButton onClick={() => setReassignModal({ open: false, bookingId: null })} sx={{ color: 'grey.400' }}>
              <X />
            </IconButton>
          </div>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ color: 'grey.400' }}>Select Mechanic</InputLabel>
            <Select
              label="Select Mechanic"
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
              {mechanics.filter(m => m.isActive).map(mechanic => (
                <MenuItem
                  key={mechanic.id}
                  value={mechanic.id}
                  onClick={() => reassignMechanic(reassignModal.bookingId, mechanic.id)}
                  sx={{ color: 'white' }}
                >
                  {mechanic.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => setReassignModal({ open: false, bookingId: null })}
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
        </Box>
      </Modal>
    </motion.div>
  );
};

export default BookingsManagement;