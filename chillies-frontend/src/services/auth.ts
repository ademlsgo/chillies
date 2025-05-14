import { api } from './api';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  identifiant: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (identifiant: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('Tentative de connexion avec:', { identifiant });
      const response = await api.post<LoginResponse>('/api/auth/login', { identifiant, password });
      console.log('Réponse de connexion:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion détaillée:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};
