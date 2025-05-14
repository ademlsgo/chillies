import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { authService } from '../../services/auth';

export const Login = () => {
    const navigate = useNavigate();
    const [identifiant, setIdentifiant] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Début de la tentative de connexion');
            const response = await authService.login(identifiant, password);
            console.log('Réponse reçue:', response);

            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                console.log('Connexion réussie, redirection vers l\'admin');
                navigate('/admin'); // ✅ redirige vers /admin (puis redirection automatique vers /admin/cocktails)
            } else {
                setError('Réponse invalide du serveur');
            }
        } catch (err: any) {
            console.error('Erreur complète:', err);
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Erreur de connexion au serveur';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'primary.main',
                            borderRadius: '50%',
                            p: 1,
                            mb: 2,
                        }}
                    >
                        <LockOutlinedIcon sx={{ color: 'white' }} />
                    </Box>
                    <Typography component="h1" variant="h5" gutterBottom>
                        Connexion Administration
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="identifiant"
                            label="Identifiant"
                            name="identifiant"
                            autoComplete="username"
                            autoFocus
                            value={identifiant}
                            onChange={(e) => setIdentifiant(e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Se connecter'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};
