import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, profileService } from '../services';
import { LoadingSpinner, ErrorMessage } from '../components';
import type { UserInfo } from '../types';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          email: currentUser.email || '',
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          phoneNumber: currentUser.phoneNumber || '',
        });
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      await profileService.updateProfile({
        email: formData.email || null,
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        phoneNumber: formData.phoneNumber || null,
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await profileService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to change password. Check your current password.');
      console.error('Error changing password:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (!user) {
    return <ErrorMessage message="Please log in to view your profile" />;
  }

  return (
    <div 
      className="max-w-2xl mx-auto"
      data-testid="profile-page"
    >
      <h1 
        className="text-3xl font-bold text-gray-900 mb-8"
        data-testid="profile-title"
      >
        My Profile 👤
      </h1>

      {error && (
        <div 
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          data-testid="profile-error"
        >
          {error}
        </div>
      )}

      {success && (
        <div 
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
          data-testid="profile-success"
        >
          {success}
        </div>
      )}

      {/* Account Info */}
      <div 
        className="bg-white rounded-xl shadow p-6 mb-6"
        data-testid="account-info-section"
      >
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Username:</span>
            <p className="font-medium" data-testid="profile-username">{user.username}</p>
          </div>
          <div>
            <span className="text-gray-500">Role:</span>
            <p className="font-medium" data-testid="profile-role">{user.role || 'Customer'}</p>
          </div>
          <div>
            <span className="text-gray-500">Member Since:</span>
            <p className="font-medium" data-testid="profile-created">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Update Profile Form */}
      <div 
        className="bg-white rounded-xl shadow p-6 mb-6"
        data-testid="update-profile-section"
      >
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
        <form onSubmit={handleUpdateProfile} data-testid="update-profile-form">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                data-testid="profile-email-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  data-testid="profile-firstname-input"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                  data-testid="profile-lastname-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="input-field"
                data-testid="profile-phone-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary mt-6"
            data-testid="update-profile-button"
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div 
        className="bg-white rounded-xl shadow p-6"
        data-testid="change-password-section"
      >
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} data-testid="change-password-form">
          <div className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className="input-field"
                data-testid="current-password-input"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="input-field"
                data-testid="new-password-input"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="input-field"
                data-testid="confirm-new-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-secondary mt-6"
            data-testid="change-password-button"
          >
            {saving ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
