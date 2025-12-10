import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { wishlistService, cartService, authService } from '../services';
import { WishlistItem } from '../services/wishlistService';
import { LoadingSpinner, ErrorMessage } from '../components';

export default function WishlistPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [movingToCart, setMovingToCart] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [navigate]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wishlistService.getWishlist();
      setItems(data as WishlistItem[]);
    } catch (err) {
      setError('Failed to load wishlist');
      console.error('Error loading wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      setRemovingId(productId);
      await wishlistService.removeFromWishlist(productId);
      await loadWishlist();
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await cartService.addToCart({ productId, quantity: 1 });
      await wishlistService.removeFromWishlist(productId);
      await loadWishlist();
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart');
    }
  };

  const handleMoveAllToCart = async () => {
    try {
      setMovingToCart(true);
      await wishlistService.moveToCart();
      await loadWishlist();
      navigate('/cart');
    } catch (err) {
      console.error('Error moving to cart:', err);
      alert('Failed to move items to cart');
    } finally {
      setMovingToCart(false);
    }
  };

  const handleClearWishlist = async () => {
    if (!confirm('Are you sure you want to clear your wishlist?')) return;
    
    try {
      setLoading(true);
      await wishlistService.clearWishlist();
      await loadWishlist();
    } catch (err) {
      console.error('Error clearing wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading wishlist..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadWishlist} />;
  }

  return (
    <div data-testid="wishlist-page">
      <div className="flex items-center justify-between mb-8">
        <h1 
          className="text-3xl font-bold text-gray-900"
          data-testid="wishlist-title"
        >
          My Wishlist ❤️
        </h1>
        
        {items.length > 0 && (
          <span 
            className="text-gray-500"
            data-testid="wishlist-count"
          >
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div 
          className="text-center py-16"
          data-testid="empty-wishlist"
        >
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love to buy later!</p>
          <Link
            to="/products"
            className="btn-primary"
            data-testid="browse-products-button"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {/* Action Buttons */}
          <div 
            className="flex flex-wrap gap-4 mb-6"
            data-testid="wishlist-actions"
          >
            <button
              onClick={handleMoveAllToCart}
              disabled={movingToCart}
              className="btn-primary"
              data-testid="move-all-to-cart-button"
            >
              {movingToCart ? 'Moving...' : '🛒 Move All to Cart'}
            </button>
            <button
              onClick={handleClearWishlist}
              className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
              data-testid="clear-wishlist-button"
            >
              Clear Wishlist
            </button>
          </div>

          {/* Wishlist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div 
                key={item.id}
                className={`bg-white rounded-xl shadow p-4 ${removingId === item.id ? 'opacity-50' : ''}`}
                data-testid={`wishlist-item-${item.id}`}
              >
                {/* Item Image */}
                <div 
                  className="bg-gradient-to-br from-bug-primary to-bug-dark h-40 rounded-lg mb-4 flex items-center justify-center"
                  data-testid={`wishlist-item-image-${item.id}`}
                >
                  <span className="text-5xl">📚</span>
                </div>

                {/* Item Details */}
                <Link 
                  to={`/products/${item.id}`}
                  className="font-semibold text-gray-900 hover:text-bug-primary block mb-1"
                  data-testid={`wishlist-item-name-${item.id}`}
                >
                  {item.name}
                </Link>
                <p 
                  className="text-sm text-gray-500 mb-2"
                  data-testid={`wishlist-item-author-${item.id}`}
                >
                  by {item.author || 'Unknown'}
                </p>
                <p 
                  className="text-xl font-bold text-bug-primary mb-4"
                  data-testid={`wishlist-item-price-${item.id}`}
                >
                  ${item.price.toFixed(2)}
                </p>

                {/* Item Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="btn-primary flex-grow text-sm"
                    data-testid={`wishlist-add-to-cart-${item.id}`}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removingId === item.id}
                    className="btn-outline text-red-500 border-red-300 hover:bg-red-50 px-3"
                    data-testid={`wishlist-remove-${item.id}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
