import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productService } from '../services';
import { ProductCard, LoadingSpinner, ErrorMessage } from '../components';
import type { Product } from '../types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await productService.getProducts({ sortBy: 'name', sortOrder: 'asc' });
      setFeaturedProducts(products.slice(0, 4)); // Show first 4 products
    } catch (err) {
      setError('Failed to load products. Is the backend running?');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section 
        className="bg-gradient-to-r from-bug-primary to-bug-dark text-white rounded-2xl p-8 md:p-12 mb-12"
        data-testid="hero-section"
      >
        <div className="max-w-2xl">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            data-testid="hero-title"
          >
            Welcome to LittleBugShop 🐛
          </h1>
          <p 
            className="text-lg md:text-xl mb-6 text-gray-200"
            data-testid="hero-subtitle"
          >
            Your friendly neighborhood bookstore with a bug-themed twist! 
            Discover amazing books and build your collection.
          </p>
          <Link
            to="/products"
            className="inline-block bg-bug-accent text-bug-dark font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
            data-testid="hero-cta-button"
          >
            Browse All Products
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section data-testid="featured-products-section">
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-2xl font-bold text-gray-900"
            data-testid="featured-title"
          >
            Featured Books
          </h2>
          <Link
            to="/products"
            className="text-bug-primary hover:text-bug-dark font-medium"
            data-testid="view-all-link"
          >
            View All →
          </Link>
        </div>

        {loading && <LoadingSpinner message="Loading books..." />}
        
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={loadFeaturedProducts}
          />
        )}

        {!loading && !error && featuredProducts.length === 0 && (
          <div 
            className="text-center py-12 text-gray-500"
            data-testid="no-products-message"
          >
            <p>No products available yet. Check back soon!</p>
          </div>
        )}

        {!loading && !error && featuredProducts.length > 0 && (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-testid="featured-products-grid"
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section 
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        data-testid="features-section"
      >
        <div 
          className="text-center p-6"
          data-testid="feature-testing"
        >
          <div className="text-4xl mb-4">🧪</div>
          <h3 className="font-bold text-lg mb-2">Test-Friendly</h3>
          <p className="text-gray-600">
            Every element has a data-testid for easy test automation
          </p>
        </div>
        <div 
          className="text-center p-6"
          data-testid="feature-api"
        >
          <div className="text-4xl mb-4">🔌</div>
          <h3 className="font-bold text-lg mb-2">Full API Integration</h3>
          <p className="text-gray-600">
            Connected to a real REST backend with all CRUD operations
          </p>
        </div>
        <div 
          className="text-center p-6"
          data-testid="feature-modern"
        >
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="font-bold text-lg mb-2">Modern Stack</h3>
          <p className="text-gray-600">
            Built with React 18, TypeScript, and Tailwind CSS
          </p>
        </div>
      </section>
    </div>
  );
}
