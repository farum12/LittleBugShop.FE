import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { orderService, authService } from '../services';
import { LoadingSpinner, ErrorMessage } from '../components';
import type { Order, OrderStatus } from '../types';

const statusLabels: Record<OrderStatus, string> = {
  0: 'Pending',
  1: 'Processing',
  2: 'Shipped',
  3: 'Delivered',
  4: 'Cancelled',
};

const statusColors: Record<OrderStatus, string> = {
  0: 'bg-yellow-100 text-yellow-800',
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-purple-100 text-purple-800',
  3: 'bg-green-100 text-green-800',
  4: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const newOrderId = searchParams.get('newOrder');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderService.cancelOrder(orderId);
      await loadOrders();
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadOrders} />;
  }

  return (
    <div data-testid="orders-page">
      <h1 
        className="text-3xl font-bold text-gray-900 mb-8"
        data-testid="orders-title"
      >
        My Orders 📦
      </h1>

      {/* New Order Success Message */}
      {newOrderId && (
        <div 
          className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6"
          data-testid="order-success-message"
        >
          <p className="font-semibold">🎉 Order #{newOrderId} placed successfully!</p>
          <p className="text-sm mt-1">Thank you for shopping with LittleBugShop!</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div 
          className="text-center py-16"
          data-testid="no-orders"
        >
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
          <Link
            to="/products"
            className="btn-primary"
            data-testid="shop-now-button"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              className={`bg-white rounded-xl shadow p-6 ${newOrderId === String(order.id) ? 'ring-2 ring-green-500' : ''}`}
              data-testid={`order-${order.id}`}
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order #</p>
                  <p 
                    className="font-bold text-lg"
                    data-testid={`order-id-${order.id}`}
                  >
                    {order.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p data-testid={`order-date-${order.id}`}>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p 
                    className="font-bold text-bug-primary"
                    data-testid={`order-total-${order.id}`}
                  >
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                    data-testid={`order-status-${order.id}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Items:</p>
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div 
                      key={item.id}
                      className="flex justify-between text-sm"
                      data-testid={`order-item-${order.id}-${item.id}`}
                    >
                      <span>
                        <Link 
                          to={`/products/${item.productId}`}
                          className="text-bug-primary hover:underline"
                        >
                          {item.productName}
                        </Link>
                        <span className="text-gray-500"> × {item.quantity}</span>
                      </span>
                      <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              {order.status === 0 && (
                <div className="border-t mt-4 pt-4">
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                    data-testid={`cancel-order-${order.id}`}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
