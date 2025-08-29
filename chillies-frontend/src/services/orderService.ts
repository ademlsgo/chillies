import { api } from './api';
import { Order, OrderStatus } from '../types/order';

const API_PREFIX = '/api';

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

    const response = await api.get(`${API_PREFIX}/orders?${params.toString()}`, getAuthHeaders());
    return response.data;
  },

  // Récupérer une commande par son ID (auth requise)
  getOrderById: async (id: string) => {
    const response = await api.get(`${API_PREFIX}/orders/${id}`, getAuthHeaders());
    return response.data;
  },

  // Créer une commande (publique pour les clients)
  createOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const response = await api.post(`${API_PREFIX}/orders`, order);
    return response.data;
  },

  // Mettre à jour une commande (auth requise)
  updateOrder: async (id: string, order: Partial<Order>) => {
    const response = await api.put(`${API_PREFIX}/orders/${id}`, order, getAuthHeaders());
    return response.data;
  },

  // Supprimer une commande (auth requise)
  deleteOrder: async (id: string) => {
    const response = await api.delete(`${API_PREFIX}/orders/${id}`, getAuthHeaders());
    return response.data;
  },

  // Mettre à jour le statut d'une commande (auth requise)
  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const response = await api.patch(`${API_PREFIX}/orders/${id}/status`, { status }, getAuthHeaders());
    return response.data;
  },
};
