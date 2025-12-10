import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await authService.login({
        username: formData.username,
        password: formData.password,
      });
      navigate('/');
      window.location.reload(); // Refresh to update header
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid username or password';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="max-w-md mx-auto"
      data-testid="login-page"
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <span className="text-5xl">🐛</span>
          <h1 
            className="text-2xl font-bold text-gray-900 mt-4"
            data-testid="login-title"
          >
            Welcome Back!
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your LittleBugShop account</p>
        </div>

        <form onSubmit={handleSubmit} data-testid="login-form">
          {error && (
            <div 
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
              data-testid="login-error"
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your username"
                autoComplete="username"
                data-testid="login-username-input"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
                autoComplete="current-password"
                data-testid="login-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6"
            data-testid="login-submit-button"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-bug-primary hover:underline font-medium"
              data-testid="register-link"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
