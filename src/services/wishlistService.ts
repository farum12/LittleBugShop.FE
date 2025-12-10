import api from './api';

export interface WishlistItem {
  id: number;
  name: string;
  author: string;
  genre: string;
  price: number;
  stockQuantity: number;
  averageRating: number;
  reviewCount: number;
  inStock: boolean;
}

interface WishlistResponse {
  userId: number;
  items: WishlistItem[];
  totalItems: number;
}

export const wishlistService = {
  // Get wishlist
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await api.get<WishlistResponse>('/Wishlist');
    return response.data.items || [];
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
    const response = await api.get<{ productId: number; inWishlist: boolean }>(`/Wishlist/check/${productId}`);
    return response.data.inWishlist;
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
