import api from './api';
import type { Product } from '../types';

export interface ProductSearchParams {
  searchTerm?: string;
  genre?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const productService = {
  // Get all products with optional filtering
  getProducts: async (params?: ProductSearchParams): Promise<Product[]> => {
    const response = await api.get<Product[]>('/Products', { params });
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/Products/${id}`);
    return response.data;
  },

  // Check product availability
  checkAvailability: async (id: number, quantity: number = 1): Promise<boolean> => {
    const response = await api.get(`/Products/${id}/availability`, {
      params: { quantity },
    });
    return response.data;
  },

  // Admin: Create product
  createProduct: async (product: Omit<Product, 'id' | 'stockStatus' | 'averageRating' | 'reviewCount'>): Promise<Product> => {
    const response = await api.post<Product>('/Products', product);
    return response.data;
  },

  // Admin: Update product
  updateProduct: async (id: number, product: Partial<Product>): Promise<void> => {
    await api.put(`/Products/${id}`, product);
  },

  // Admin: Delete product
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/Products/${id}`);
  },

  // Admin: Update stock
  updateStock: async (id: number, quantity: number): Promise<void> => {
    await api.put(`/Products/${id}/stock`, { quantity });
  },

  // Admin: Increase stock
  increaseStock: async (id: number, amount: number): Promise<void> => {
    await api.post(`/Products/${id}/stock/increase`, { amount });
  },

  // Admin: Decrease stock
  decreaseStock: async (id: number, amount: number): Promise<void> => {
    await api.post(`/Products/${id}/stock/decrease`, { amount });
  },
};
