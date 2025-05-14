import { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableHead, TableRow,
    TableCell, TableBody, Select, MenuItem, IconButton,
    CircularProgress, Box, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types/order';

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Erreur lors du chargement des commandes :', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
        try {
            await orderService.updateOrderStatus(id, newStatus);
            setOrders(prev =>
                prev.map(order =>
                    order.id === id ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Erreur lors du changement de statut :', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await orderService.deleteOrder(id);
            setOrders(prev => prev.filter(order => order.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des commandes
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Table</TableCell>
                            <TableCell>Cocktails</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.table_number}</TableCell>
                                <TableCell>
                                    {order.cocktails.map((c, index) => (
                                        <div key={index}>
                                            Cocktail ID: {c.cocktail_id}, Quantité: {c.quantity}
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={order.status}
                                        onChange={(e) =>
                                            handleStatusChange(order.id.toString(), e.target.value as OrderStatus)
                                        }
                                    >
                                        <MenuItem value="Pending">En attente</MenuItem>
                                        <MenuItem value="In Progress">En préparation</MenuItem>
                                        <MenuItem value="Served">Servi</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={() => handleDelete(order.id.toString())}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default AdminOrders;
