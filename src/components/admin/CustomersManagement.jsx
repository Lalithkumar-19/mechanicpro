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
  Chip,
  IconButton,
  Typography,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  Visibility,
  Block,
  CheckCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { X, User } from 'lucide-react';

const CustomersManagement = ({ customers, setCustomers, addNotification }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle Customer Block Status
  const toggleCustomerBlock = (customerId) => {
    setCustomers(prev => prev.map(c =>
      c.id === customerId ? { ...c, isBlocked: !c.isBlocked } : c
    ));

    const customer = customers.find(c => c.id === customerId);
    addNotification(
      `Customer ${customer.name} ${!customer.isBlocked ? 'blocked' : 'unblocked'}`,
      'customer'
    );
  };

  // Filter customers by search query
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  // DataGrid Columns
  const columns = [
    {
      field: 'id',
      headerName: 'Customer ID',
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body2" color="white" fontWeight="bold">
            {params.value}
          </Typography>
        </Box>
      ),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'center' }}>
          {/* <Avatar sx={{ width: 40, height: 40, bgcolor: '#3b82f6' }}>
            <User size={20} />
          </Avatar> */}
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="body2" fontWeight="bold" color="white">
              {params.value}
            </Typography>
            {/* <Typography variant="caption" color="grey.400">
              Joined {params.row.joinDate}
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
      field: 'totalBookings',
      headerName: 'Total Bookings',
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body2" fontWeight="bold" color="white">
            {params.value}
          </Typography>
        </Box>
      ),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'totalSpent',
      headerName: 'Total Spent',
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body2" fontWeight="bold" color="orange.500">
            ₹{params.value.toLocaleString()}
          </Typography>
        </Box>
      ),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'lastService',
      headerName: 'Last Service',
      width: 130,
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
      field: 'isBlocked',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Chip
            label={params.value ? 'Blocked' : 'Active'}
            color={params.value ? 'error' : 'success'}
            size="small"
            sx={{ color: 'white', fontWeight: 'bold' }}
          />
        </Box>
      ),
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      type: 'actions',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, height: '100%' }}>
          <IconButton
            onClick={() => setSelectedCustomer(params.row)}
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
            onClick={() => toggleCustomerBlock(params.row.id)}
            sx={{
              color: params.row.isBlocked ? '#34d399' : '#ef4444',
              '&:hover': {
                color: params.row.isBlocked ? '#10b981' : '#dc2626',
                backgroundColor: params.row.isBlocked ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)'
              }
            }}
          >
            {params.row.isBlocked ? <CheckCircle /> : <Block />}
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
          <h2 className="text-2xl font-bold text-white mb-2">Customers Management</h2>
          <p className="text-gray-400">Manage all registered customers</p>
        </div>
        <TextField
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: 300,
            backgroundColor: '#1f2937',
            borderRadius: '8px',
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
                borderColor: '#f97316'
              }
            },
            '& .MuiInputLabel-root': {
              color: '#9ca3af'
            }
          }}
        />
      </div>

      {/* Customers DataGrid */}
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
          rows={filteredCustomers}
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

      {/* Customer Details Modal */}
      <Modal open={!!selectedCustomer} onClose={() => setSelectedCustomer(null)}>
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
          {selectedCustomer && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Customer Details</h3>
                <IconButton onClick={() => setSelectedCustomer(null)} sx={{ color: 'grey.400' }}>
                  <X />
                </IconButton>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar sx={{ width: 80, height: 80, bgcolor: '#3b82f6' }}>
                    <User size={32} />
                  </Avatar>
                  <div>
                    <Typography variant="h6" color="white">{selectedCustomer.name}</Typography>
                    <Chip
                      label={selectedCustomer.isBlocked ? 'Blocked' : 'Active'}
                      color={selectedCustomer.isBlocked ? 'error' : 'success'}
                      sx={{ mt: 1, color: 'white', fontWeight: 'bold' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="body2" color="grey.400">Customer ID</Typography>
                    <Typography variant="body1" color="white">{selectedCustomer.id}</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" color="grey.400">Join Date</Typography>
                    <Typography variant="body1" color="white">{selectedCustomer.joinDate}</Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="body2" color="grey.400">Contact Information</Typography>
                  <Typography variant="body1" color="white">{selectedCustomer.email}</Typography>
                  <Typography variant="body1" color="white">{selectedCustomer.phone}</Typography>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card sx={{ bgcolor: '#374151', borderRadius: '8px' }}>
                    <CardContent>
                      <Typography variant="body2" color="grey.400">Total Bookings</Typography>
                      <Typography variant="h4" color="white">{selectedCustomer.totalBookings}</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ bgcolor: '#374151', borderRadius: '8px' }}>
                    <CardContent>
                      <Typography variant="body2" color="grey.400">Total Spent</Typography>
                      <Typography variant="h4" color="white">
                        ₹{selectedCustomer.totalSpent.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Typography variant="body2" color="grey.400">Last Service</Typography>
                  <Typography variant="body1" color="white">{selectedCustomer.lastService}</Typography>
                </div>

                <Button
                  variant={selectedCustomer.isBlocked ? "contained" : "outlined"}
                  color={selectedCustomer.isBlocked ? "success" : "error"}
                  fullWidth
                  onClick={() => toggleCustomerBlock(selectedCustomer.id)}
                  startIcon={selectedCustomer.isBlocked ? <CheckCircle /> : <Block />}
                  sx={{
                    ...(selectedCustomer.isBlocked ? {
                      bgcolor: '#10b981',
                      '&:hover': { bgcolor: '#059669' }
                    } : {
                      color: '#ef4444',
                      borderColor: '#ef4444',
                      '&:hover': {
                        borderColor: '#dc2626',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)'
                      }
                    })
                  }}
                >
                  {selectedCustomer.isBlocked ? 'Unblock Customer' : 'Block Customer'}
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </motion.div>
  );
};

export default CustomersManagement;