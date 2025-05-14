import React from 'react';
import {
    Box, AppBar, Toolbar, Typography, IconButton, Drawer, List,
    ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon, Dashboard, LocalBar, Person, ExitToApp
} from '@mui/icons-material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';




const drawerWidth = 240;

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const location = useLocation();


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Cocktails', icon: <LocalBar />, path: '/admin/cocktails' },
        { text: 'Utilisateurs', icon: <Person />, path: '/admin/users' },
        { text: 'Commandes', icon: <ReceiptIcon />, path: '/admin/commande' }, // 👈 Ajouté ici
    ];

    const drawer = (
        <Box>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Admin Panel
                </Typography>
            </Toolbar>
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        selected={location.pathname.includes(item.path)} // ✅ met en surbrillance
                    >

                    <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon><ExitToApp /></ListItemIcon>
                    <ListItemText primary="Déconnexion" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {user?.email}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default AdminLayout;
