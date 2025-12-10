import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div 
      className="text-center py-16"
      data-testid="not-found-page"
    >
      <div className="text-8xl mb-6">🐛❓</div>
      <h1 
        className="text-4xl font-bold text-gray-900 mb-4"
        data-testid="not-found-title"
      >
        404 - Page Not Found
      </h1>
      <p 
        className="text-xl text-gray-600 mb-8"
        data-testid="not-found-message"
      >
        Oops! Looks like this bug crawled away...
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="btn-primary"
          data-testid="go-home-button"
        >
          🏠 Go Home
        </Link>
        <Link
          to="/products"
          className="btn-outline"
          data-testid="browse-products-button"
        >
          📚 Browse Products
        </Link>
      </div>
    </div>
  );
}
