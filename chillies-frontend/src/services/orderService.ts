import axios from 'axios';
import { Order, OrderStatus } from '../types/order';

const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const orderService = {
  // Récupérer toutes les commandes avec filtrage (auth requise)
  getAllOrders: async (filters?: { status?: OrderStatus; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const response = await axios.get(`${API_URL}/orders?${params.toString()}`, getAuthHeaders());
    return response.data;
  },

  // Récupérer une commande par son ID (auth requise)
  getOrderById: async (id: string) => {
    const response = await axios.get(`${API_URL}/orders/${id}`, getAuthHeaders());
    return response.data;
  },

  // Créer une commande (publique pour les clients)
  createOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const response = await axios.post(`${API_URL}/orders`, order);
    return response.data;
  },

  // Mettre à jour une commande (auth requise)
  updateOrder: async (id: string, order: Partial<Order>) => {
    const response = await axios.put(`${API_URL}/orders/${id}`, order, getAuthHeaders());
    return response.data;
  },

  // Supprimer une commande (auth requise)
  deleteOrder: async (id: string) => {
    const response = await axios.delete(`${API_URL}/orders/${id}`, getAuthHeaders());
    return response.data;
  },

  // Mettre à jour le statut d'une commande (auth requise)
  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const response = await axios.patch(`${API_URL}/orders/${id}/status`, { status }, getAuthHeaders());
    return response.data;
  },
};
