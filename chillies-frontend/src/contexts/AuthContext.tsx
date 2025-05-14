import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  identifiant: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Vérifier si un token et les données utilisateur existent dans le localStorage au chargement
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    console.log('AuthContext - Chargement initial:', { token, userData });
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('AuthContext - Utilisateur trouvé:', parsedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('AuthContext - Erreur lors du parsing des données utilisateur:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (token: string, userData: User) => {
    console.log('AuthContext - Connexion:', { token, userData });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    console.log('AuthContext - Déconnexion');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 