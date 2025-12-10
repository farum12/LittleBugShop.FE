import api from './api';
import type { Review, CreateReviewRequest } from '../types';

interface ProductReviewsResponse {
  productId: number;
  productName: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (
    productId: number,
    params?: {
      rating?: number;
      verifiedOnly?: boolean;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<Review[]> => {
    const response = await api.get<ProductReviewsResponse>(`/products/${productId}/Reviews`, { params });
    return response.data.reviews || [];
  },

  // Get single review
  getReview: async (productId: number, reviewId: number): Promise<Review> => {
    const response = await api.get<Review>(`/products/${productId}/Reviews/${reviewId}`);
    return response.data;
  },

  // Get current user's review for a product
  getMyReview: async (productId: number): Promise<Review> => {
    const response = await api.get<Review>(`/products/${productId}/my-review`);
    return response.data;
  },

  // Create review
  createReview: async (productId: number, request: CreateReviewRequest): Promise<Review> => {
    const response = await api.post<Review>(`/products/${productId}/Reviews`, request);
    return response.data;
  },

  // Delete review
  deleteReview: async (productId: number, reviewId: number): Promise<void> => {
    await api.delete(`/products/${productId}/Reviews/${reviewId}`);
  },

  // Mark review as helpful
  markHelpful: async (reviewId: number): Promise<void> => {
    await api.post(`/reviews/${reviewId}/helpful`);
  },

  // Admin: Moderate review (hide/unhide)
  moderateReview: async (productId: number, reviewId: number, isHidden: boolean): Promise<Review> => {
    const response = await api.put<Review>(`/products/${productId}/Reviews/${reviewId}/moderate`, { isHidden });
    return response.data;
  },

  // Admin: Get all reviews
  getAllReviews: async (includeHidden: boolean = true, productId?: number): Promise<Review[]> => {
    const response = await api.get<Review[]>('/admin/reviews', {
      params: { includeHidden, productId },
    });
    return response.data;
  },
};
