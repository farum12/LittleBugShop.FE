import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartService, authService } from '../services';
import { LoadingSpinner, ErrorMessage } from '../components';
import type { Cart } from '../types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [navigate]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
      
      if (!data.items || data.items.length === 0) {
        navigate('/cart');
      }
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setProcessing(true);
      setError(null);
      const order = await cartService.checkout();
      navigate(`/orders?newOrder=${order.id}`);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Error placing order:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading checkout..." />;
  }

  if (error && !cart) {
    return <ErrorMessage message={error} onRetry={loadCart} />;
  }

  return (
    <div 
      className="max-w-4xl mx-auto"
      data-testid="checkout-page"
    >
      <h1 
        className="text-3xl font-bold text-gray-900 mb-8"
        data-testid="checkout-title"
      >
        Checkout 💳
      </h1>

      {error && (
        <div 
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          data-testid="checkout-error"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Review */}
        <div>
          <div 
            className="bg-white rounded-xl shadow p-6"
            data-testid="order-review-section"
          >
            <h2 className="text-xl font-semibold mb-4">Order Review</h2>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {cart?.items?.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-3 pb-3 border-b last:border-0"
                  data-testid={`checkout-item-${item.id}`}
                >
                  <div className="bg-gradient-to-br from-bug-primary to-bug-dark w-16 h-16 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="flex-grow">
                    <p 
                      className="font-medium text-sm"
                      data-testid={`checkout-item-name-${item.id}`}
                    >
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p 
                    className="font-semibold"
                    data-testid={`checkout-item-total-${item.id}`}
                  >
                    ${item.totalPrice.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Link 
                to="/cart" 
                className="text-bug-primary hover:underline text-sm"
                data-testid="edit-cart-link"
              >
                ← Edit Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div>
          <div 
            className="bg-white rounded-xl shadow p-6"
            data-testid="payment-summary-section"
          >
            <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cart?.totalItems} items)</span>
                <span data-testid="checkout-subtotal">${cart?.subtotal.toFixed(2)}</span>
              </div>
              
              {cart?.discountAmount && cart.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span data-testid="checkout-discount">-${cart.discountAmount.toFixed(2)}</span>
                </div>
              )}

              {cart?.appliedCouponCode && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Coupon Applied</span>
                  <span 
                    className="text-green-600"
                    data-testid="checkout-coupon"
                  >
                    {cart.appliedCouponCode}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600" data-testid="checkout-shipping">Free</span>
              </div>

              <div className="flex justify-between font-bold text-xl pt-3 border-t">
                <span>Total</span>
                <span data-testid="checkout-total">${cart?.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Demo Notice */}
            <div 
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6"
              data-testid="demo-notice"
            >
              <p className="text-yellow-800 text-sm">
                <strong>🧪 Demo Mode:</strong> This is a test environment. 
                No real payment will be processed.
              </p>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              className="btn-primary w-full mt-6 py-3 text-lg"
              data-testid="place-order-button"
            >
              {processing ? 'Processing...' : '🐛 Place Order'}
            </button>

            <p className="text-center text-gray-500 text-xs mt-4">
              By placing your order, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
