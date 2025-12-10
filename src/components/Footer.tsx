import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer 
      className="bg-bug-dark text-white py-8 mt-auto"
      data-testid="footer"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div data-testid="footer-brand">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🐛</span>
              <span className="text-xl font-bold">LittleBugShop</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your friendly neighborhood bookstore with a bug-themed twist!
            </p>
          </div>

          {/* Quick Links */}
          <div data-testid="footer-quick-links">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link 
                  to="/products" 
                  className="hover:text-bug-accent transition-colors"
                  data-testid="footer-link-products"
                >
                  Browse Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className="hover:text-bug-accent transition-colors"
                  data-testid="footer-link-cart"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link 
                  to="/orders" 
                  className="hover:text-bug-accent transition-colors"
                  data-testid="footer-link-orders"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link 
                  to="/wishlist" 
                  className="hover:text-bug-accent transition-colors"
                  data-testid="footer-link-wishlist"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div data-testid="footer-account">
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link 
                  to="/login" 
                  className="hover:text-bug-accent transition-colors"
                  data-testid="footer-link-login"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="hover:text-bug-accent transition-colors"
                  data-testid="footer-link-register"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="hover:text-bug-accent transition-colors"
                  data-testid="footer-link-profile"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div data-testid="footer-contact">
            <h3 className="font-semibold mb-4">Test Automation</h3>
            <p className="text-sm text-gray-400 mb-2">
              This app is built with test automation in mind.
            </p>
            <p className="text-sm text-gray-400">
              Every interactive element has a <code className="bg-bug-primary px-1 rounded">data-testid</code> attribute!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400"
          data-testid="footer-copyright"
        >
          <p>© 2024 LittleBugShop. Built for testing, made with 🐛</p>
        </div>
      </div>
    </footer>
  );
}
