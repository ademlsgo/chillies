import React from 'react';
import '@fontsource/fredoka'; // 👈 ajoute ceci tout en haut
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CocktailList } from './pages/CocktailList'; // ✅ Composant client réel
import { Login } from './pages/auth/Login';
import AdminLayout from './layouts/AdminLayout';
import AdminCocktails from './pages/admin/cocktails'; // ✅ Composant admin
import Users from './pages/admin/Users';
import AdminCommandes from './pages/AdminCommandes';
import { AuthProvider } from './contexts/AuthContext';

// Composant de protection des routes admin
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const theme = createTheme({
  typography: {
    fontFamily: 'Fredoka, Arial, sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#56008A',
    },
    secondary: {
      main: '#c62828',
    },
  },
});


function App() {
  return (
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* ✅ Routes publiques */}
              <Route path="/" element={<CocktailList />} />
              <Route path="/login" element={<Login />} />

              {/* ✅ Routes protégées */}
              <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <Outlet />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
              >
                <Route index element={<Navigate to="cocktails" replace />} />
                <Route path="cocktails" element={<AdminCocktails />} />
                <Route path="users" element={<Users />} />
                <Route path="commande" element={<AdminCommandes />} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
  );
}

export default App;
