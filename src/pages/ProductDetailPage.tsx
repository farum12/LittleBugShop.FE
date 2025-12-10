import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService, cartService, wishlistService, reviewService, authService } from '../services';
import { LoadingSpinner, ErrorMessage } from '../components';
import type { Product, Review } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const isLoggedIn = authService.isAuthenticated();

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      const [productData, reviewsData] = await Promise.all([
        productService.getProduct(productId),
        reviewService.getProductReviews(productId).catch(() => []),
      ]);
      setProduct(productData);
      setReviews(reviewsData);
      
      // Check wishlist status only if user is logged in
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const isInWishlist = await wishlistService.isInWishlist(productId);
          setInWishlist(isInWishlist);
        } catch {
          // Ignore wishlist check errors
        }
      }
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      await cartService.addToCart({ productId: product.id, quantity });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    
    try {
      if (inWishlist) {
        await wishlistService.removeFromWishlist(product.id);
        setInWishlist(false);
      } else {
        await wishlistService.addToWishlist(product.id);
        setInWishlist(true);
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewText.trim()) return;

    try {
      setSubmittingReview(true);
      setReviewError(null);
      await reviewService.createReview(product.id, {
        rating: reviewRating,
        reviewText: reviewText.trim(),
      });
      // Reset form and reload reviews
      setReviewText('');
      setReviewRating(5);
      setShowReviewForm(false);
      // Reload product to get updated review count and reviews
      await loadProduct(product.id);
    } catch (err: unknown) {
      console.error('Error submitting review:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit review. You may have already reviewed this product.';
      setReviewError(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <ErrorMessage 
        message={error || 'Product not found'} 
        onRetry={() => id && loadProduct(parseInt(id))}
      />
    );
  }

  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold;

  return (
    <div data-testid="product-detail-page">
      {/* Breadcrumb */}
      <nav 
        className="mb-6 text-sm"
        data-testid="breadcrumb"
      >
        <Link to="/" className="text-bug-primary hover:underline">Home</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/products" className="text-bug-primary hover:underline">Products</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div 
          className="bg-gradient-to-br from-bug-primary to-bug-dark rounded-2xl h-96 flex items-center justify-center"
          data-testid="product-image"
        >
          <span className="text-9xl">📚</span>
        </div>

        {/* Product Info */}
        <div data-testid="product-info">
          <h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            data-testid="product-title"
          >
            {product.name}
          </h1>
          
          <p 
            className="text-lg text-gray-600 mb-4"
            data-testid="product-author"
          >
            by {product.author || 'Unknown Author'}
          </p>

          {/* Rating */}
          <div 
            className="flex items-center gap-2 mb-4"
            data-testid="product-rating"
          >
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star}
                  className={star <= Math.round(product.averageRating) ? 'text-yellow-500' : 'text-gray-300'}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-600">
              ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
            </span>
          </div>

          {/* Genre & ISBN */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.genre && (
              <span 
                className="bg-bug-light text-bug-primary text-sm px-3 py-1 rounded-full"
                data-testid="product-genre"
              >
                {product.genre}
              </span>
            )}
            {product.isbn && (
              <span 
                className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                data-testid="product-isbn"
              >
                ISBN: {product.isbn}
              </span>
            )}
          </div>

          {/* Price */}
          <p 
            className="text-4xl font-bold text-bug-primary mb-4"
            data-testid="product-price"
          >
            ${product.price.toFixed(2)}
          </p>

          {/* Stock Status */}
          <div 
            className={`inline-block px-4 py-2 rounded-lg mb-6 ${
              isOutOfStock 
                ? 'bg-red-100 text-red-700' 
                : isLowStock 
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
            }`}
            data-testid="product-stock-status"
          >
            {isOutOfStock 
              ? '❌ Out of Stock' 
              : isLowStock 
                ? `⚠️ Only ${product.stockQuantity} left!`
                : `✅ In Stock (${product.stockQuantity} available)`
            }
          </div>

          {/* Description */}
          {product.description && (
            <p 
              className="text-gray-700 mb-6"
              data-testid="product-description"
            >
              {product.description}
            </p>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label htmlFor="quantity" className="text-gray-600">Qty:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                disabled={isOutOfStock}
                className="input-field w-20"
                data-testid="quantity-select"
              >
                {[...Array(Math.min(10, product.stockQuantity))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className={`btn-primary flex-grow sm:flex-grow-0 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              data-testid="add-to-cart-button"
            >
              {addingToCart ? 'Adding...' : addedToCart ? '✓ Added!' : '🛒 Add to Cart'}
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`btn-outline ${inWishlist ? 'bg-red-50 border-red-300 text-red-600' : ''}`}
              data-testid="wishlist-button"
            >
              {inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>

          {/* Go to Cart */}
          {addedToCart && (
            <Link
              to="/cart"
              className="inline-block text-bug-primary hover:underline"
              data-testid="go-to-cart-link"
            >
              View Cart →
            </Link>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <section 
        className="mt-12"
        data-testid="reviews-section"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Reviews ({reviews.length})
          </h2>
          {isLoggedIn && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn-primary"
              data-testid="write-review-button"
            >
              ✍️ Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div 
            className="bg-white rounded-xl shadow-md p-6 mb-6"
            data-testid="review-form"
          >
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
            
            {reviewError && (
              <div 
                className="bg-red-50 text-red-700 p-3 rounded-lg mb-4"
                data-testid="review-error"
              >
                {reviewError}
              </div>
            )}

            <form onSubmit={handleSubmitReview}>
              {/* Rating Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div 
                  className="flex gap-1"
                  data-testid="rating-selector"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-3xl transition-colors ${
                        star <= reviewRating ? 'text-yellow-500' : 'text-gray-300'
                      } hover:text-yellow-400`}
                      data-testid={`rating-star-${star}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600 self-center">
                    ({reviewRating}/5)
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label 
                  htmlFor="reviewText" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  rows={4}
                  className="input-field w-full"
                  required
                  data-testid="review-text-input"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submittingReview || !reviewText.trim()}
                  className="btn-primary"
                  data-testid="submit-review-button"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewError(null);
                    setReviewText('');
                    setReviewRating(5);
                  }}
                  className="btn-outline"
                  data-testid="cancel-review-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Login prompt for non-logged users */}
        {!isLoggedIn && (
          <div 
            className="bg-bug-light rounded-lg p-4 mb-6 text-center"
            data-testid="login-to-review-prompt"
          >
            <p className="text-gray-700">
              <Link to="/login" className="text-bug-primary font-semibold hover:underline">
                Log in
              </Link>
              {' '}to write a review
            </p>
          </div>
        )}

        {reviews.length === 0 ? (
          <p 
            className="text-gray-500 text-center py-8"
            data-testid="no-reviews-message"
          >
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div 
                key={review.id}
                className="bg-white rounded-lg shadow p-4"
                data-testid={`review-${review.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{review.userName}</span>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star}
                        className={star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.reviewText}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
