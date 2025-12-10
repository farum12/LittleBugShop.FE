import api from './api';
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  UserInfo,
  UpdateProfileRequest,
  ChangePasswordRequest,
  AddAddressRequest
} from '../types';

export const authService = {
  // Register new user
  register: async (request: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/Users/register', request);
    return response.data;
  },

  // Login
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/Users/login', request);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/Users/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser: (): UserInfo | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get session info
  getSession: async (): Promise<unknown> => {
    const response = await api.get('/Session');
    return response.data;
  },
};

export const profileService = {
  // Get user profile
  getProfile: async (): Promise<unknown> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (request: UpdateProfileRequest): Promise<void> => {
    await api.put('/users/profile', request);
  },

  // Change password
  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    await api.put('/users/profile/change-password', request);
  },

  // Add address
  addAddress: async (request: AddAddressRequest): Promise<void> => {
    await api.post('/users/profile/addresses', request);
  },

  // Update address
  updateAddress: async (id: number, request: AddAddressRequest): Promise<void> => {
    await api.put(`/users/profile/addresses/${id}`, request);
  },

  // Delete address
  deleteAddress: async (id: number): Promise<void> => {
    await api.delete(`/users/profile/addresses/${id}`);
  },

  // Set default address
  setDefaultAddress: async (id: number): Promise<void> => {
    await api.put(`/users/profile/addresses/${id}/set-default`);
  },
};
