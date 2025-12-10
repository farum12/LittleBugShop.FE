import { useState, useEffect } from 'react';
import { productService } from '../services';
import { ProductCard, LoadingSpinner, ErrorMessage } from '../components';
import type { Product } from '../types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Available genres (extracted from products)
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, [searchTerm, selectedGenre, sortBy, sortOrder]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts({
        searchTerm: searchTerm || undefined,
        genre: selectedGenre || undefined,
        sortBy,
        sortOrder,
      });
      setProducts(data);
      
      // Extract unique genres
      const uniqueGenres = [...new Set(data.map(p => p.genre).filter(Boolean))] as string[];
      setGenres(uniqueGenres);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <div data-testid="products-page">
      <h1 
        className="text-3xl font-bold text-gray-900 mb-8"
        data-testid="products-page-title"
      >
        Browse Our Books 📚
      </h1>

      {/* Search and Filters */}
      <div 
        className="bg-white rounded-xl shadow-md p-6 mb-8"
        data-testid="filters-section"
      >
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field flex-grow"
              data-testid="search-input"
            />
            <button
              type="submit"
              className="btn-primary"
              data-testid="search-button"
            >
              Search
            </button>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Genre Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="genre" className="text-sm text-gray-600">Genre:</label>
              <select
                id="genre"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="input-field w-auto"
                data-testid="genre-filter"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm text-gray-600">Sort by:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-auto"
                data-testid="sort-by-filter"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="author">Author</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2">
              <label htmlFor="sortOrder" className="text-sm text-gray-600">Order:</label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="input-field w-auto"
                data-testid="sort-order-filter"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              type="button"
              onClick={clearFilters}
              className="btn-outline text-sm"
              data-testid="clear-filters-button"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results Count */}
      {!loading && !error && (
        <p 
          className="text-gray-600 mb-4"
          data-testid="results-count"
        >
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner message="Loading products..." />}

      {/* Error State */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={loadProducts}
        />
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div 
          className="text-center py-12"
          data-testid="no-results-message"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="btn-primary"
            data-testid="clear-filters-empty-button"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          data-testid="products-grid"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
