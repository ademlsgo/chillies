import { api } from './api';
import { Cocktail } from '../types/cocktail';

export const cocktailService = {
  // Récupérer tous les cocktails
  getAllCocktails: async () => {
    try {
      const response = await api.get('/api/cocktails');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des cocktails:', error);
      throw error;
    }
  },

  // Récupérer un cocktail par ID
  getCocktailById: async (id: string) => {
    try {
      const response = await api.get(`/api/cocktails/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du cocktail ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau cocktail
  createCocktail: async (cocktail: Omit<Cocktail, 'id'>) => {
    try {
      const response = await api.post('/api/cocktails', cocktail);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du cocktail:', error);
      throw error;
    }
  },

  // Mettre à jour un cocktail
  updateCocktail: async (id: string, cocktail: Partial<Cocktail>) => {
    try {
      const response = await api.put(`/api/cocktails/${id}`, cocktail);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du cocktail ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un cocktail
  deleteCocktail: async (id: string) => {
    try {
      await api.delete(`/api/cocktails/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du cocktail ${id}:`, error);
      throw error;
    }
  }
}; 