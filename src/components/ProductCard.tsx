import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold;

  return (
    <div 
      className="card flex flex-col h-full"
      data-testid={`product-card-${product.id}`}
    >
      {/* Book Cover Placeholder */}
      <div 
        className="bg-gradient-to-br from-bug-primary to-bug-dark h-48 rounded-lg mb-4 flex items-center justify-center"
        data-testid={`product-image-${product.id}`}
      >
        <span className="text-6xl">📚</span>
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <h3 
          className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2"
          data-testid={`product-name-${product.id}`}
        >
          {product.name}
        </h3>
        
        <p 
          className="text-sm text-gray-600 mb-2"
          data-testid={`product-author-${product.id}`}
        >
          by {product.author || 'Unknown Author'}
        </p>

        {product.genre && (
          <span 
            className="inline-block bg-bug-light text-bug-primary text-xs px-2 py-1 rounded-full mb-2"
            data-testid={`product-genre-${product.id}`}
          >
            {product.genre}
          </span>
        )}

        {/* Rating */}
        <div 
          className="flex items-center gap-1 mb-2"
          data-testid={`product-rating-${product.id}`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span 
              key={star}
              className={star <= Math.round(product.averageRating) ? 'text-yellow-500' : 'text-gray-300'}
            >
              ★
            </span>
          ))}
          <span className="text-sm text-gray-500 ml-1">
            ({product.reviewCount})
          </span>
        </div>
      </div>

      {/* Price & Stock */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span 
            className="text-xl font-bold text-bug-primary"
            data-testid={`product-price-${product.id}`}
          >
            ${product.price.toFixed(2)}
          </span>
          
          <span 
            className={`text-xs px-2 py-1 rounded-full ${
              isOutOfStock 
                ? 'bg-red-100 text-red-700' 
                : isLowStock 
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
            }`}
            data-testid={`product-stock-status-${product.id}`}
          >
            {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
          </span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="btn-primary w-full text-center block"
          data-testid={`product-view-button-${product.id}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
