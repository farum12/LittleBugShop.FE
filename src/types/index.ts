// Product types
export interface Product {
  id: number;
  name: string | null;
  author: string | null;
  genre: string | null;
  isbn: string | null;
  price: number;
  description: string | null;
  type: string | null;
  stockQuantity: number;
  lowStockThreshold: number;
  stockStatus: string | null;
  averageRating: number;
  reviewCount: number;
}

export interface StockUpdateRequest {
  quantity: number;
}

export interface StockChangeRequest {
  amount: number;
}

// Cart types
export interface Cart {
  id: number;
  userId: number;
  items: CartItem[] | null;
  appliedCouponCode: string | null;
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
  totalItems: number;
  lastUpdated: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string | null;
  author: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ApplyCouponRequest {
  code: string | null;
}

// Order types
export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4,
}

export enum PaymentStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3,
  Cancelled = 4,
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[] | null;
  totalPrice: number;
  orderDate: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
  paymentMethodId: number | null;
  shippingAddressId: number | null;
  expiresAt: string | null;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderRequest {
  shippingAddressId?: number | null;
}

export interface PlaceOrderRequest {
  userId: number;
  items: OrderItemRequest[] | null;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// User types
export interface User {
  id: number;
  username: string | null;
  password: string | null;
  role: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  addressIds: number[] | null;
}

export interface UserInfo {
  id: number;
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  role: string | null;
  createdAt: string;
}

export interface RegisterRequest {
  username: string | null;
  password: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
}

export interface RegisterResponse {
  message: string | null;
  user: UserInfo;
}

export interface LoginRequest {
  username: string | null;
  password: string | null;
}

export interface LoginResponse {
  message: string | null;
  token: string | null;
  user: UserInfo;
}

export interface UpdateProfileRequest {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
}

export interface ChangePasswordRequest {
  oldPassword: string | null;
  newPassword: string | null;
}

// Address types
export enum AddressType {
  Shipping = 0,
  Billing = 1,
  Both = 2,
}

export interface AddAddressRequest {
  addressType: AddressType;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  isDefault: boolean;
}

// Review types
export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string | null;
  rating: number;
  reviewText: string | null;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  reviewText: string | null;
}

export interface ModerateReviewRequest {
  isHidden: boolean;
}

// Payment types
export enum PaymentMethodType {
  CreditCard = 0,
  DebitCard = 1,
  PayPal = 2,
}

export interface AddPaymentMethodRequest {
  type: PaymentMethodType;
  cardHolderName: string | null;
  cardNumber: string | null;
  expiryMonth: string | null;
  expiryYear: string | null;
  cvv: string | null;
  payPalEmail: string | null;
}

export interface PaymentRequest {
  orderId: number;
  paymentMethodId: number;
}

export interface RefundRequest {
  transactionId: string | null;
  amount: number;
  reason: string | null;
}

// Coupon types
export enum DiscountType {
  Percentage = 0,
  FixedAmount = 1,
}

export interface CreateCouponRequest {
  code: string | null;
  type: DiscountType;
  value: number;
  expirationDate: string | null;
  maxUsesTotal: number | null;
}

export interface UpdateCouponRequest {
  code: string | null;
  value: number | null;
  expirationDate: string | null;
  maxUsesTotal: number | null;
  isActive: boolean | null;
}

// Admin types
export interface AdminUpdateUserRequest {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  role: string | null;
}

export interface ResetPasswordRequest {
  newPassword: string | null;
}
