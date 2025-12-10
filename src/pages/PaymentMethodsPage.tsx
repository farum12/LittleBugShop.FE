import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentMethodService, authService, PaymentMethodType } from '../services';
import type { PaymentMethod, AddPaymentMethodRequest } from '../services';
import { LoadingSpinner, ErrorMessage } from '../components';

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);
  
  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<PaymentMethodType>(PaymentMethodType.CreditCard);
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    payPalEmail: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadPaymentMethods();
  }, [navigate]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentMethodService.getPaymentMethods();
      setMethods(data);
    } catch (err) {
      setError('Failed to load payment methods');
      console.error('Error loading payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    
    try {
      setDeletingId(id);
      await paymentMethodService.deletePaymentMethod(id);
      await loadPaymentMethods();
    } catch (err) {
      console.error('Error deleting payment method:', err);
      alert('Failed to delete payment method');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      setSettingDefaultId(id);
      await paymentMethodService.setDefaultPaymentMethod(id);
      await loadPaymentMethods();
    } catch (err) {
      console.error('Error setting default payment method:', err);
      alert('Failed to set default payment method');
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setFormError(null);

      const request: AddPaymentMethodRequest = {
        type: formType,
      };

      if (formType === PaymentMethodType.PayPal) {
        request.payPalEmail = formData.payPalEmail;
      } else {
        request.cardHolderName = formData.cardHolderName;
        request.cardNumber = formData.cardNumber;
        request.expiryMonth = formData.expiryMonth;
        request.expiryYear = formData.expiryYear;
        request.cvv = formData.cvv;
      }

      await paymentMethodService.addPaymentMethod(request);
      
      // Reset form
      setFormData({
        cardHolderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        payPalEmail: '',
      });
      setShowAddForm(false);
      await loadPaymentMethods();
    } catch (err) {
      console.error('Error adding payment method:', err);
      setFormError('Failed to add payment method. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setFormError(null);
    setFormData({
      cardHolderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      payPalEmail: '',
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading payment methods..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadPaymentMethods} />;
  }

  return (
    <div data-testid="payment-methods-page">
      <div className="flex items-center justify-between mb-8">
        <h1 
          className="text-3xl font-bold text-gray-900"
          data-testid="payment-methods-title"
        >
          Payment Methods 💳
        </h1>
        
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
            data-testid="add-payment-method-button"
          >
            + Add Payment Method
          </button>
        )}
      </div>

      {/* Add Payment Method Form */}
      {showAddForm && (
        <div 
          className="bg-white rounded-xl shadow-md p-6 mb-8"
          data-testid="add-payment-form"
        >
          <h2 className="text-xl font-semibold mb-4">Add New Payment Method</h2>
          
          {formError && (
            <div 
              className="bg-red-50 text-red-700 p-3 rounded-lg mb-4"
              data-testid="form-error"
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleAddPaymentMethod}>
            {/* Payment Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type
              </label>
              <div 
                className="flex gap-4"
                data-testid="payment-type-selector"
              >
                {[
                  { type: PaymentMethodType.CreditCard, label: '💳 Credit Card' },
                  { type: PaymentMethodType.DebitCard, label: '💳 Debit Card' },
                  { type: PaymentMethodType.PayPal, label: '🅿️ PayPal' },
                ].map(({ type, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormType(type)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      formType === type 
                        ? 'border-bug-primary bg-bug-light text-bug-primary' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    data-testid={`payment-type-${type}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Details */}
            {formType !== PaymentMethodType.PayPal ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="cardHolderName"
                    value={formData.cardHolderName}
                    onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
                    className="input-field w-full"
                    required
                    placeholder="John Doe"
                    data-testid="cardholder-name-input"
                  />
                </div>

                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                    className="input-field w-full"
                    required
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                    data-testid="card-number-input"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Month
                    </label>
                    <select
                      id="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                      className="input-field w-full"
                      required
                      data-testid="expiry-month-select"
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Year
                    </label>
                    <select
                      id="expiryYear"
                      value={formData.expiryYear}
                      onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                      className="input-field w-full"
                      required
                      data-testid="expiry-year-select"
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={String(new Date().getFullYear() + i)}>
                          {new Date().getFullYear() + i}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      className="input-field w-full"
                      required
                      placeholder="123"
                      maxLength={4}
                      data-testid="cvv-input"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* PayPal Email */
              <div>
                <label htmlFor="payPalEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  PayPal Email
                </label>
                <input
                  type="email"
                  id="payPalEmail"
                  value={formData.payPalEmail}
                  onChange={(e) => setFormData({ ...formData, payPalEmail: e.target.value })}
                  className="input-field w-full"
                  required
                  placeholder="your@email.com"
                  data-testid="paypal-email-input"
                />
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                data-testid="submit-payment-method-button"
              >
                {submitting ? 'Adding...' : 'Add Payment Method'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-outline"
                data-testid="cancel-add-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Methods List */}
      {methods.length === 0 ? (
        <div 
          className="text-center py-16"
          data-testid="no-payment-methods"
        >
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No payment methods</h2>
          <p className="text-gray-500 mb-6">Add a payment method to make checkout faster!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {methods.map((method) => (
            <div 
              key={method.id}
              className={`bg-white rounded-xl shadow p-6 ${
                deletingId === method.id || settingDefaultId === method.id ? 'opacity-50' : ''
              }`}
              data-testid={`payment-method-${method.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div 
                    className="text-4xl"
                    data-testid={`payment-method-icon-${method.id}`}
                  >
                    {paymentMethodService.getTypeIcon(method.type)}
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="font-semibold text-lg"
                        data-testid={`payment-method-type-${method.id}`}
                      >
                        {paymentMethodService.getTypeLabel(method.type)}
                      </span>
                      {method.isDefault && (
                        <span 
                          className="bg-bug-primary text-white text-xs px-2 py-0.5 rounded-full"
                          data-testid={`payment-method-default-${method.id}`}
                        >
                          Default
                        </span>
                      )}
                    </div>

                    {method.type === PaymentMethodType.PayPal ? (
                      <p 
                        className="text-gray-600"
                        data-testid={`payment-method-email-${method.id}`}
                      >
                        {method.payPalEmail}
                      </p>
                    ) : (
                      <>
                        <p 
                          className="text-gray-600"
                          data-testid={`payment-method-masked-${method.id}`}
                        >
                          {method.cardNumberMasked}
                        </p>
                        <p 
                          className="text-sm text-gray-500"
                          data-testid={`payment-method-holder-${method.id}`}
                        >
                          {method.cardHolderName} • Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
                      Added {new Date(method.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      disabled={settingDefaultId === method.id}
                      className="text-sm text-bug-primary hover:underline"
                      data-testid={`set-default-button-${method.id}`}
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    disabled={deletingId === method.id}
                    className="text-sm text-red-600 hover:underline"
                    data-testid={`delete-payment-method-${method.id}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
