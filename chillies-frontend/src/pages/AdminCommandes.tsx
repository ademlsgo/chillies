import { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableHead, TableRow,
    TableCell, TableBody, Select, MenuItem, IconButton,
    CircularProgress, Box, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { orderService } from '../services/orderService';
import { cocktailService } from '../services/cocktailService';
import { Order, OrderStatus } from '../types/order';
import { Cocktail } from '../types/cocktail';

const AdminCommandes = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [ordersData, cocktailsData] = await Promise.all([
                    orderService.getAllOrders(),
                    cocktailService.getAllCocktails()
                ]);
                setOrders(ordersData);
                setCocktails(cocktailsData);
            } catch (error) {
                console.error('Erreur lors du chargement :', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCocktailNameById = (id: number): string => {
        const found = cocktails.find(c => c.id === id);
        return found ? found.name : `#${id}`;
    };

    const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
        try {
            console.log('Changement de statut pour ID', id, '->', newStatus);
            await orderService.updateOrderStatus(id, newStatus);
            setOrders(prev =>
                prev.map(order =>
                    order.id === parseInt(id) ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Erreur lors du changement de statut :', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await orderService.deleteOrder(id);
            setOrders(prev => prev.filter(order => order.id !== parseInt(id)));
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
                                            {getCocktailNameById(c.cocktail_id)} – Qty: {c.quantity}
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

export default AdminCommandes;
