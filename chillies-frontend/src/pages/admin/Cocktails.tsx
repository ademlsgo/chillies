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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  SelectChangeEvent,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { cocktailService } from '../../services/cocktailService';
import { Cocktail } from '../../types/cocktail';

const Cocktails: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const [formData, setFormData] = useState<Partial<Cocktail>>({
    name: '',
    description: '',
    price: 0,
    category: 'Cocktails classiques',
    image: 'https://placehold.co/300x200',
    isAvailable: true,
    ingredients: [],
    instructions: '',
    origin: '',
    status: 'active'
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    console.log('État de l\'authentification:', { isAuthenticated, user });
    fetchCocktails();
  }, [isAuthenticated, user]);

  const fetchCocktails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Token:', localStorage.getItem('token'));
      const data = await cocktailService.getAllCocktails();
      console.log('Cocktails reçus:', data);
      setCocktails(data);
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      if (error.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/login';
      } else {
        setError('Erreur lors du chargement des cocktails. Veuillez réessayer.');
        showSnackbar('Erreur lors du chargement des cocktails', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleOpenDialog = (cocktail?: Cocktail) => {
    if (cocktail) {
      setSelectedCocktail(cocktail);
      setFormData({
        ...cocktail,
        price: Number(cocktail.price), // S'assurer que le prix est un nombre
      });
    } else {
      setSelectedCocktail(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'Cocktails classiques',
        image: 'https://placehold.co/300x200',
        isAvailable: true,
        ingredients: [],
        instructions: '',
        origin: '',
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCocktail(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string | boolean>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isAvailable' ? value === 'true' : value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Validation des données
      if (!formData.name || formData.name.length < 2) {
        showSnackbar('Le nom doit contenir au moins 2 caractères', 'error');
        return;
      }

      if (!formData.price || formData.price <= 0) {
        showSnackbar('Le prix doit être supérieur à 0', 'error');
        return;
      }

      if (!formData.category || !['Cocktail', 'Mocktail', 'Shot', 'Long Drink', 'Autre'].includes(formData.category)) {
        showSnackbar('Veuillez sélectionner une catégorie valide', 'error');
        return;
      }

      // Préparation des données
      const cocktailData = {
        ...formData,
        price: Number(formData.price),
        ingredients: Array.isArray(formData.ingredients) ? formData.ingredients : [],
        isAvailable: Boolean(formData.isAvailable)
      };

      console.log('Données du formulaire:', cocktailData);
      
      if (selectedCocktail) {
        console.log('Mise à jour du cocktail:', selectedCocktail.id);
        await cocktailService.updateCocktail(selectedCocktail.id.toString(), cocktailData);
        showSnackbar('Cocktail mis à jour avec succès', 'success');
      } else {
        console.log('Création d\'un nouveau cocktail');
        await cocktailService.createCocktail(cocktailData as Omit<Cocktail, 'id'>);
        showSnackbar('Cocktail créé avec succès', 'success');
      }
      
      fetchCocktails();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erreur lors de la sauvegarde du cocktail';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cocktail ?')) {
      try {
        console.log('Suppression du cocktail:', id);
        await cocktailService.deleteCocktail(id);
        showSnackbar('Cocktail supprimé avec succès', 'success');
        fetchCocktails();
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        showSnackbar(error.response?.data?.message || 'Erreur lors de la suppression du cocktail', 'error');
      }
    }
  };

  const categories = [
    'Cocktail',
    'Mocktail',
    'Shot',
    'Long Drink',
    'Autre'
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchCocktails}>
          Réessayer
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Cocktails</Typography>
        {isAuthenticated && user?.role === 'superuser' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter un cocktail
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Disponibilité</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cocktails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucun cocktail trouvé
                </TableCell>
              </TableRow>
            ) : (
              cocktails.map((cocktail) => (
                <TableRow key={cocktail.id}>
                  <TableCell>
                    <img 
                      src={cocktail.image || 'https://placehold.co/50x50'} 
                      alt={cocktail.name} 
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/50x50';
                      }}
                    />
                  </TableCell>
                  <TableCell>{cocktail.name}</TableCell>
                  <TableCell>{cocktail.description}</TableCell>
                  <TableCell>{Number(cocktail.price).toFixed(2)} €</TableCell>
                  <TableCell>{cocktail.category}</TableCell>
                  <TableCell>
                    <Chip 
                      label={cocktail.isAvailable ? 'Disponible' : 'Indisponible'} 
                      color={cocktail.isAvailable ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {isAuthenticated && user?.role === 'superuser' && (
                      <>
                        <IconButton onClick={() => handleOpenDialog(cocktail)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(cocktail.id.toString())}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCocktail ? 'Modifier le cocktail' : 'Ajouter un cocktail'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Nom"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Prix"
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleInputChange}
                margin="normal"
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="image"
                label="URL de l'image"
                fullWidth
                value={formData.image}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleSelectChange}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Disponibilité</InputLabel>
                <Select
                  name="isAvailable"
                  value={formData.isAvailable}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="true">Disponible</MenuItem>
                  <MenuItem value="false">Indisponible</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedCocktail ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Cocktails; 