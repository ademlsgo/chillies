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
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { userService, User, CreateUserData, UpdateUserData } from '../../services/userService';
import { SelectChangeEvent } from '@mui/material/Select';

const Users: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    first_name: '',
    last_name: '',
    identifiant: '',
    password: '',
    role: 'user',
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
    fetchUsers();
  }, [isAuthenticated, user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      console.log('Utilisateurs reçus:', data);
      setUsers(data);
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      if (error.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/login';
      } else {
        setError('Erreur lors du chargement des utilisateurs. Veuillez réessayer.');
        showSnackbar('Erreur lors du chargement des utilisateurs', 'error');
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

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        identifiant: user.identifiant,
        password: '',
        role: user.role,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        first_name: '',
        last_name: '',
        identifiant: '',
        password: '',
        role: 'user',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      console.log('Données du formulaire:', formData);
      if (selectedUser) {
        console.log('Mise à jour de l\'utilisateur:', selectedUser.id);
        await userService.updateUser(selectedUser.id.toString(), formData);
        showSnackbar('Utilisateur mis à jour avec succès', 'success');
      } else {
        console.log('Création d\'un nouvel utilisateur');
        await userService.createUser(formData);
        showSnackbar('Utilisateur créé avec succès', 'success');
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      showSnackbar(error.response?.data?.message || 'Erreur lors de la sauvegarde de l\'utilisateur', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        console.log('Suppression de l\'utilisateur:', id);
        await userService.deleteUser(id);
        showSnackbar('Utilisateur supprimé avec succès', 'success');
        fetchUsers();
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        showSnackbar(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur', 'error');
      }
    }
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
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchUsers}>
          Réessayer
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Utilisateurs</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Ajouter un utilisateur
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Identifiant</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.identifiant}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {isAuthenticated && (
                      <>
                        <IconButton 
                          onClick={() => handleOpenDialog(user)}
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(user.id.toString())}
                          color="error"
                        >
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
          {selectedUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="first_name"
                label="Prénom"
                fullWidth
                value={formData.first_name}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="last_name"
                label="Nom"
                fullWidth
                value={formData.last_name}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="identifiant"
                label="Identifiant"
                fullWidth
                value={formData.identifiant}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Mot de passe"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required={!selectedUser}
                helperText={selectedUser ? "Laisser vide pour ne pas modifier" : "Minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial"}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Rôle</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value="user">Utilisateur</MenuItem>
                  <MenuItem value="superuser">Super Utilisateur</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedUser ? 'Mettre à jour' : 'Créer'}
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

export default Users; 