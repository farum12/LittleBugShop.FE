import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../services';

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(authService.isAuthenticated());
    setUser(authService.getCurrentUser());
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  return (
    <header 
      className="bg-bug-primary text-white shadow-lg"
      data-testid="header"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            data-testid="header-logo"
          >
            <span className="text-2xl">🐛</span>
            <span className="text-xl font-bold">LittleBugShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center space-x-6"
            data-testid="desktop-navigation"
          >
            <Link 
              to="/products" 
              className="hover:text-bug-accent transition-colors"
              data-testid="nav-products"
            >
              Products
            </Link>
            <Link 
              to="/cart" 
              className="hover:text-bug-accent transition-colors flex items-center"
              data-testid="nav-cart"
            >
              <span className="mr-1">🛒</span>
              Cart
            </Link>
            <Link 
              to="/wishlist" 
              className="hover:text-bug-accent transition-colors flex items-center"
              data-testid="nav-wishlist"
            >
              <span className="mr-1">❤️</span>
              Wishlist
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/orders" 
                  className="hover:text-bug-accent transition-colors"
                  data-testid="nav-orders"
                >
                  My Orders
                </Link>
                <Link 
                  to="/profile" 
                  className="hover:text-bug-accent transition-colors"
                  data-testid="nav-profile"
                >
                  {user?.username || 'Profile'}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                  data-testid="logout-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:text-bug-accent transition-colors"
                  data-testid="nav-login"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-secondary text-sm"
                  data-testid="nav-register"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav 
            className="md:hidden py-4 border-t border-bug-dark"
            data-testid="mobile-navigation"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                to="/products" 
                className="hover:text-bug-accent transition-colors"
                data-testid="mobile-nav-products"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/cart" 
                className="hover:text-bug-accent transition-colors"
                data-testid="mobile-nav-cart"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🛒 Cart
              </Link>
              <Link 
                to="/wishlist" 
                className="hover:text-bug-accent transition-colors"
                data-testid="mobile-nav-wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ❤️ Wishlist
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/orders" 
                    className="hover:text-bug-accent transition-colors"
                    data-testid="mobile-nav-orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link 
                    to="/profile" 
                    className="hover:text-bug-accent transition-colors"
                    data-testid="mobile-nav-profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="text-left hover:text-bug-accent transition-colors"
                    data-testid="mobile-logout-button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="hover:text-bug-accent transition-colors"
                    data-testid="mobile-nav-login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="hover:text-bug-accent transition-colors"
                    data-testid="mobile-nav-register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
