import api from './api';

export const wishlistService = {
  // Get wishlist
  getWishlist: async (): Promise<unknown> => {
    const response = await api.get('/Wishlist');
    return response.data;
  },

  // Add product to wishlist
  addToWishlist: async (productId: number): Promise<void> => {
    await api.post(`/Wishlist/items/${productId}`);
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId: number): Promise<void> => {
    await api.delete(`/Wishlist/items/${productId}`);
  },

  // Check if product is in wishlist
  isInWishlist: async (productId: number): Promise<boolean> => {
    const response = await api.get(`/Wishlist/check/${productId}`);
    return response.data;
  },

  // Clear wishlist
  clearWishlist: async (): Promise<void> => {
    await api.delete('/Wishlist');
  },

  // Move all wishlist items to cart
  moveToCart: async (): Promise<void> => {
    await api.post('/Wishlist/move-to-cart');
  },

  // Get wishlist item count
  getWishlistCount: async (): Promise<number> => {
    const response = await api.get('/Wishlist/count');
    return response.data;
  },
};
