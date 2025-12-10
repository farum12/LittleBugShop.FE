import api from './api';

export enum PaymentMethodType {
  CreditCard = 0,
  DebitCard = 1,
  PayPal = 2,
}

export interface PaymentMethod {
  id: number;
  userId: number;
  type: PaymentMethodType;
  cardHolderName: string | null;
  cardNumberMasked: string | null;
  cardNumberLast4: string | null;
  expiryMonth: string | null;
  expiryYear: string | null;
  payPalEmail: string | null;
  isDefault: boolean;
  createdAt: string;
}

export interface AddPaymentMethodRequest {
  type: PaymentMethodType;
  cardHolderName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  payPalEmail?: string;
}

interface PaymentMethodsResponse {
  value: PaymentMethod[];
  Count: number;
}

export const paymentMethodService = {
  // Get all payment methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await api.get<PaymentMethodsResponse>('/payment-methods');
    return response.data.value || [];
  },

  // Get single payment method
  getPaymentMethod: async (id: number): Promise<PaymentMethod> => {
    const response = await api.get<PaymentMethod>(`/payment-methods/${id}`);
    return response.data;
  },

  // Add new payment method
  addPaymentMethod: async (request: AddPaymentMethodRequest): Promise<void> => {
    await api.post('/payment-methods', request);
  },

  // Update payment method
  updatePaymentMethod: async (id: number, request: AddPaymentMethodRequest): Promise<void> => {
    await api.put(`/payment-methods/${id}`, request);
  },

  // Delete payment method
  deletePaymentMethod: async (id: number): Promise<void> => {
    await api.delete(`/payment-methods/${id}`);
  },

  // Set as default
  setDefaultPaymentMethod: async (id: number): Promise<void> => {
    await api.put(`/payment-methods/${id}/set-default`);
  },

  // Helper to get type label
  getTypeLabel: (type: PaymentMethodType): string => {
    switch (type) {
      case PaymentMethodType.CreditCard:
        return 'Credit Card';
      case PaymentMethodType.DebitCard:
        return 'Debit Card';
      case PaymentMethodType.PayPal:
        return 'PayPal';
      default:
        return 'Unknown';
    }
  },

  // Helper to get type icon
  getTypeIcon: (type: PaymentMethodType): string => {
    switch (type) {
      case PaymentMethodType.CreditCard:
        return '💳';
      case PaymentMethodType.DebitCard:
        return '💳';
      case PaymentMethodType.PayPal:
        return '🅿️';
      default:
        return '💰';
    }
  },
};
