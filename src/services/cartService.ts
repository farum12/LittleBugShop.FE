import api from './api';
import type { Cart, AddToCartRequest, Order } from '../types';

export const cartService = {
  // Get current cart
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/Cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (request: AddToCartRequest): Promise<Cart> => {
    const response = await api.post<Cart>('/Cart/items', request);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const response = await api.put<Cart>(`/Cart/items/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId: number): Promise<Cart> => {
    const response = await api.delete<Cart>(`/Cart/items/${itemId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async (): Promise<Cart> => {
    const response = await api.delete<Cart>('/Cart');
    return response.data;
  },

  // Apply coupon code
  applyCoupon: async (code: string): Promise<void> => {
    await api.post('/Cart/apply-coupon', { code });
  },

  // Remove coupon
  removeCoupon: async (): Promise<void> => {
    await api.delete('/Cart/remove-coupon');
  },

  // Checkout - creates order from cart
  checkout: async (): Promise<Order> => {
    const response = await api.post<Order>('/Cart/checkout');
    return response.data;
  },
};
