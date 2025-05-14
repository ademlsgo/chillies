import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Suppression de /api car les routes sont déjà montées sur /api

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Requête API:', {
    method: config.method,
    url: config.url,
    headers: config.headers,
    data: config.data
  });
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    console.log('Réponse API:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Erreur API:', {
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const cocktailService = {
  getAllCocktails: async () => {
    try {
      const response = await api.get('/api/cocktails');
      console.log('Response API:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getAllCocktails:', error);
      throw error;
    }
  },
  
  getCocktailById: async (id: string) => {
    const response = await api.get(`/api/cocktails/${id}`);
    return response.data;
  },
};
