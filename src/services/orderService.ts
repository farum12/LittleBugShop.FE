import api from './api';
import type { Order, CreateOrderRequest, UpdateOrderStatusRequest, OrderStatus } from '../types';

export const orderService = {
  // Get all orders (admin)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/Orders');
    return response.data;
  },

  // Get user's orders
  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/Orders/my-orders');
    return response.data;
  },

  // Get single order
  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/Orders/${id}`);
    return response.data;
  },

  // Create order
  createOrder: async (request: CreateOrderRequest): Promise<unknown> => {
    const response = await api.post('/Orders/create', request);
    return response.data;
  },

  // Place order (alternative method)
  placeOrder: async (userId: number, items: { productId: number; quantity: number }[]): Promise<Order> => {
    const response = await api.post<Order>('/Orders/place', { userId, items });
    return response.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const request: UpdateOrderStatusRequest = { status };
    const response = await api.put<Order>(`/Orders/${id}/status`, request);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: number): Promise<void> => {
    await api.delete(`/Orders/${id}/cancel`);
  },

  // Delete order (admin)
  deleteOrder: async (id: number): Promise<void> => {
    await api.delete(`/Orders/${id}`);
  },

  // Get pending orders (admin)
  getPendingOrders: async (): Promise<unknown> => {
    const response = await api.get('/Orders/pending');
    return response.data;
  },
};
