import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartService } from '../services';
import { LoadingSpinner, ErrorMessage } from '../components';
import type { Cart, CartItem } from '../types';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
    try {
      setUpdatingItem(item.id);
      if (newQuantity === 0) {
        await cartService.removeFromCart(item.id);
      } else {
        await cartService.updateCartItem(item.id, newQuantity);
      }
      await loadCart();
    } catch (err) {
      console.error('Error updating cart:', err);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      setUpdatingItem(itemId);
      await cartService.removeFromCart(itemId);
      await loadCart();
    } catch (err) {
      console.error('Error removing item:', err);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      setLoading(true);
      await cartService.clearCart();
      await loadCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      setApplyingCoupon(true);
      await cartService.applyCoupon(couponCode);
      await loadCart();
      setCouponCode('');
    } catch (err) {
      console.error('Error applying coupon:', err);
      alert('Invalid or expired coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await cartService.removeCoupon();
      await loadCart();
    } catch (err) {
      console.error('Error removing coupon:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your cart..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadCart} />;
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <div data-testid="cart-page">
      <h1 
        className="text-3xl font-bold text-gray-900 mb-8"
        data-testid="cart-page-title"
      >
        Shopping Cart 🛒
      </h1>

      {isEmpty ? (
        <div 
          className="text-center py-16"
          data-testid="empty-cart"
        >
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any books yet!</p>
          <Link
            to="/products"
            className="btn-primary"
            data-testid="continue-shopping-button"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart?.items?.map((item) => (
              <div 
                key={item.id}
                className={`bg-white rounded-xl shadow p-4 flex gap-4 ${updatingItem === item.id ? 'opacity-50' : ''}`}
                data-testid={`cart-item-${item.id}`}
              >
                {/* Item Image */}
                <div 
                  className="bg-gradient-to-br from-bug-primary to-bug-dark w-24 h-24 rounded-lg flex items-center justify-center flex-shrink-0"
                  data-testid={`cart-item-image-${item.id}`}
                >
                  <span className="text-3xl">📚</span>
                </div>

                {/* Item Details */}
                <div className="flex-grow">
                  <Link 
                    to={`/products/${item.productId}`}
                    className="font-semibold text-gray-900 hover:text-bug-primary"
                    data-testid={`cart-item-name-${item.id}`}
                  >
                    {item.productName}
                  </Link>
                  <p 
                    className="text-sm text-gray-500"
                    data-testid={`cart-item-author-${item.id}`}
                  >
                    by {item.author || 'Unknown'}
                  </p>
                  <p 
                    className="text-bug-primary font-semibold mt-1"
                    data-testid={`cart-item-price-${item.id}`}
                  >
                    ${item.unitPrice.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      disabled={updatingItem === item.id}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      data-testid={`cart-item-decrease-${item.id}`}
                    >
                      -
                    </button>
                    <span 
                      className="w-8 text-center font-semibold"
                      data-testid={`cart-item-quantity-${item.id}`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      disabled={updatingItem === item.id}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      data-testid={`cart-item-increase-${item.id}`}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p 
                      className="font-bold text-lg"
                      data-testid={`cart-item-total-${item.id}`}
                    >
                      ${item.totalPrice.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updatingItem === item.id}
                      className="text-red-500 hover:text-red-700 text-sm"
                      data-testid={`cart-item-remove-${item.id}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={handleClearCart}
              className="text-gray-500 hover:text-red-500 text-sm"
              data-testid="clear-cart-button"
            >
              Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div 
              className="bg-white rounded-xl shadow p-6 sticky top-4"
              data-testid="order-summary"
            >
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              {/* Coupon Code */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">Coupon Code</label>
                {cart?.appliedCouponCode ? (
                  <div 
                    className="flex items-center justify-between bg-green-50 p-2 rounded"
                    data-testid="applied-coupon"
                  >
                    <span className="text-green-700 font-medium">{cart.appliedCouponCode}</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 text-sm hover:underline"
                      data-testid="remove-coupon-button"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="input-field flex-grow"
                      data-testid="coupon-input"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                      className="btn-outline text-sm"
                      data-testid="apply-coupon-button"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span data-testid="cart-subtotal">${cart?.subtotal.toFixed(2)}</span>
                </div>
                {cart?.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span data-testid="cart-discount">-${cart.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span data-testid="cart-total">${cart?.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="btn-primary w-full text-center mt-6 block"
                data-testid="checkout-button"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="block text-center text-bug-primary hover:underline mt-4"
                data-testid="continue-shopping-link"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
