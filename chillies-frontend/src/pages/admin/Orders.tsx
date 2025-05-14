import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types/order';
import { useAuth } from '../../contexts/AuthContext';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'view' | 'edit' | 'delete'>('view');
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAllOrders(filters);
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      await orderService.deleteOrder(orderId);
      loadOrders();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'preparing':
        return 'info';
      case 'served':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des commandes
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Rechercher"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={filters.status}
            label="Statut"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="pending">En attente</MenuItem>
            <MenuItem value="preparing">En préparation</MenuItem>
            <MenuItem value="served">Servi</MenuItem>
            <MenuItem value="cancelled">Annulé</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N° Table</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.tableNumber}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{order.total.toFixed(2)} €</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedOrder(order);
                      setDialogType('view');
                      setOpenDialog(true);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  {isAuthenticated && (
                    <>
                      <IconButton
                        onClick={() => {
                          setSelectedOrder(order);
                          setDialogType('edit');
                          setOpenDialog(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setSelectedOrder(order);
                          setDialogType('delete');
                          setOpenDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'view' && 'Détails de la commande'}
          {dialogType === 'edit' && 'Modifier la commande'}
          {dialogType === 'delete' && 'Supprimer la commande'}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              {dialogType === 'view' && (
                <Box>
                  <Typography variant="h6">Table {selectedOrder.tableNumber}</Typography>
                  <Typography variant="subtitle1">
                    Date: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1">
                    Statut: {selectedOrder.status}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Articles commandés:
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Cocktail</TableCell>
                          <TableCell>Quantité</TableCell>
                          <TableCell>Prix unitaire</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.cocktailId}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.price.toFixed(2)} €</TableCell>
                            <TableCell>
                              {(item.quantity * item.price).toFixed(2)} €
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Total: {selectedOrder.total.toFixed(2)} €
                  </Typography>
                </Box>
              )}

              {dialogType === 'edit' && (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Statut</InputLabel>
                    <Select
                      value={selectedOrder.status}
                      label="Statut"
                      onChange={(e) =>
                        handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                      }
                    >
                      <MenuItem value="pending">En attente</MenuItem>
                      <MenuItem value="preparing">En préparation</MenuItem>
                      <MenuItem value="served">Servi</MenuItem>
                      <MenuItem value="cancelled">Annulé</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}

              {dialogType === 'delete' && (
                <Typography>
                  Êtes-vous sûr de vouloir supprimer cette commande ?
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
          {dialogType === 'delete' && (
            <Button
              onClick={() => selectedOrder && handleDelete(selectedOrder.id)}
              color="error"
            >
              Supprimer
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders; 