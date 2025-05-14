import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Grid, Container, Card, CardMedia, CardContent,
  Typography, CssBaseline, CircularProgress, Alert, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Snackbar, Alert as MuiAlert, Paper, Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import { Cocktail } from '../types/cocktail';
import { cocktailService } from '../services/cocktailService';

const defaultImageUrl = '/images/default-cocktail.jpg';

const Cocktails = () => {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [filteredCocktails, setFilteredCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusTable, setOrderStatusTable] = useState('');
  const [tableOrders, setTableOrders] = useState<any[]>([]);
  const [openTracking, setOpenTracking] = useState(false);

  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    if (target.src !== defaultImageUrl) {
      target.src = defaultImageUrl;
    }
  }, []);

  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        setLoading(true);
        const data = await cocktailService.getAllCocktails();
        const filtered = data.filter((c: Cocktail) => c.name !== 'Sweet Honey').slice(0, 8);
        const prepared = filtered.map((cocktail: Cocktail) => {
          let imagePath = defaultImageUrl;
          if (cocktail.image && cocktail.image !== 'null') {
            imagePath = cocktail.image.startsWith('/images/') ? cocktail.image : `/images/${cocktail.image}`;
          }
          return { ...cocktail, image: imagePath };
        });
        setCocktails(prepared);
        setFilteredCocktails(prepared);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des cocktails');
      } finally {
        setLoading(false);
      }
    };
    fetchCocktails();
  }, []);

  useEffect(() => {
    if (!orderStatusTable) return;
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/orders`);
        const allOrders = await response.json();
        if (!Array.isArray(allOrders)) throw new Error('Format de réponse invalide');
        const filtered = allOrders.filter((o: any) => o.table_number.toString() === orderStatusTable);
        setTableOrders(filtered);
      } catch (e) {
        console.error('Erreur récupération commandes table', e);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [orderStatusTable]);

  const handleOpenModal = (cocktail: Cocktail) => {
    setSelectedCocktail(cocktail);
    setTableNumber('');
    setQuantity(1);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCocktail(null);
  };

  const handleOpenDetails = (cocktail: Cocktail) => {
    setSelectedCocktail(cocktail);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedCocktail(null);
  };

  const handleConfirmOrder = async () => {
    if (!selectedCocktail || !tableNumber || quantity <= 0) return;
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: parseInt(tableNumber),
          cocktails: [{ cocktail_id: selectedCocktail.id, quantity }]
        })
      });
      if (!response.ok) throw new Error('Erreur lors de la commande');
      setSnackbarMessage('Commande envoyée avec succès !');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (err) {
      setSnackbarMessage("Erreur lors de l'envoi de la commande");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error(err);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredCocktails(
        cocktails.filter(cocktail =>
            cocktail.name.toLowerCase().includes(value) ||
            cocktail.category?.toLowerCase().includes(value) ||
            cocktail.origin?.toLowerCase().includes(value)
        )
    );
  };

  const handleTrackingSubmit = () => {
    if (orderStatusTable) setOpenTracking(false);
  };

  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
    );
  }

  if (error) {
    return (
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
    );
  }

  return (
      <>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, mt: 2 }}>
          <Box sx={{ flex: 1 }} />
          <Box>
            <img src="/images/logo.png" alt="Logo Chillies" style={{ maxWidth: '200px' }} />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => setOpenTracking(true)}>Suivre ma commande</Button>
          </Box>
        </Box>

        <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <TextField
              label="Rechercher un cocktail"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ width: '300px' }}
          />
        </Container>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Grid container spacing={4} columns={12} justifyContent="center">
            {filteredCocktails.map(cocktail => (
                <Grid item key={cocktail.id} xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card
                      sx={{
                        width: 230,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 6,
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => handleOpenDetails(cocktail)}
                  >
                    <CardMedia
                        component="img"
                        height="160"
                        image={cocktail.image}
                        alt={cocktail.name}
                        onError={handleImageError}
                        sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                    />
                    <CardContent>
                      <Typography
                          variant="h6"
                          component="h2"
                          noWrap
                          sx={{ fontWeight: 'bold !important', color: '#56008A !important' }}
                      >
                        {cocktail.name}
                      </Typography>

                      <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1,
                            minHeight: '3em',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                      >
                        {cocktail.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.primary">{cocktail.category}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#56008A' }}>
                          {parseFloat(cocktail.price.toString()).toFixed(2)}€
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
            ))}
          </Grid>
        </Container>

        {orderStatusTable && tableOrders.length > 0 && (
            <Container sx={{ mt: 6 }}>
              <Typography variant="h5" gutterBottom>Commandes de la table {orderStatusTable}</Typography>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Nombre de cocktails</TableCell>
                      <TableCell>Statut</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableOrders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.cocktails.reduce((sum, c) => sum + c.quantity, 0)}</TableCell>
                          <TableCell>{order.status}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Container>
        )}

        <Dialog open={openTracking} onClose={() => setOpenTracking(false)}>
          <DialogTitle>Suivre ma commande</DialogTitle>
          <DialogContent>
            <TextField
                fullWidth
                label="Numéro de table"
                type="number"
                value={orderStatusTable}
                onChange={(e) => setOrderStatusTable(e.target.value)}
                autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTracking(false)}>Annuler</Button>
            <Button variant="contained" onClick={handleTrackingSubmit}>Valider</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </>
  );
};

export default Cocktails;
