import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Grid, Container, Card, CardMedia, CardContent,
  Typography, CssBaseline, CircularProgress, Alert, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Snackbar, Alert as MuiAlert
} from '@mui/material';
import { Cocktail } from '../types/cocktail';
import { cocktailService } from '../services/cocktailService';

const defaultImageUrl = '/images/default-cocktail.jpg';

export const CocktailList = () => {
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
        <Box sx={{ mt: 4, pb: 10, textAlign: 'center' }}>
          <Box sx={{ mb: 4 }}>
            <img src="/images/logo.png" alt="Logo Chillies" style={{ maxWidth: '250px' }} />
          </Box>

          <Box sx={{ mb: 4 }}>
            <TextField
                label="Rechercher un cocktail"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: '300px' }}
            />
          </Box>

          <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={4} columns={12} sx={{ maxWidth: '1000px' }}>
              {filteredCocktails.map((cocktail) => (
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
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#56008A' }}>

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
                          <Typography variant="body2" color="text.primary">
                            {cocktail.category}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#56008A'  }}>
                            {parseFloat(cocktail.price.toString()).toFixed(2)}€
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="xs">
          <DialogTitle>Commander {selectedCocktail?.name}</DialogTitle>
          <DialogContent>
            <TextField
                fullWidth
                margin="normal"
                label="Numéro de table"
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
            />
            <TextField
                fullWidth
                margin="normal"
                label="Quantité"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Annuler</Button>
            <Button onClick={handleConfirmOrder} variant="contained"
                    sx={{ backgroundColor: '#56008A', '&:hover': { backgroundColor: '#4a007a' } }}>
              Valider la commande
            </Button>

          </DialogActions>
        </Dialog>

        <Dialog open={openDetails} onClose={handleCloseDetails} fullWidth maxWidth="xs">
          <DialogTitle sx={{ color: '#56008A' }}>
            {selectedCocktail?.name}
          </DialogTitle>

          <DialogContent>
            <Box sx={{ textAlign: 'center' }}>
              <img
                  src={selectedCocktail?.image}
                  alt={selectedCocktail?.name}
                  style={{ width: '100%', maxWidth: '300px', height: 'auto', marginBottom: '1rem', borderRadius: '10px' }}
                  onError={handleImageError}
              />
            </Box>
            <Typography variant="body1" gutterBottom>
              {selectedCocktail?.description}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#A678C8' }}>
              Origine : {selectedCocktail?.origin}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#56008A' }}>
              Prix : {parseFloat(selectedCocktail?.price.toString() || '0').toFixed(2)}€
            </Typography>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              handleCloseDetails();
              handleOpenModal(selectedCocktail!);
            }} variant="contained">
              Commander
            </Button>
            <Button onClick={handleCloseDetails}>Fermer</Button>
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
