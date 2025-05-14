import { api } from './api';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  identifiant: string;
  role: string;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  identifiant: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  identifiant?: string;
  password?: string;
  role?: string;
}

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/api/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/api/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post<User>('/api/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: UpdateUserData): Promise<User> => {
    const response = await api.put<User>(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  }
}; 