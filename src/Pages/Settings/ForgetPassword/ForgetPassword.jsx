import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
const setStoredEmail = useAuthStore((state) => state.setEmail);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Make API call to forgot password endpoint
      await api.post('/auth/forgot-password', {
        email: email
      });
      setStoredEmail(email); // Store email in Zustand for later use in verification step

      // If successful, navigate to email verification page
      // You can also pass the email as state if needed
      navigate("/settings/email-verification", { 
        state: { email: email } // Optional: pass email to verification page
      });
    } catch (err) {
      // Handle error response
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-4 mt-20">
      <div className="w-full ">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center">
          <Link to="/settings/change-password">
            <button className="mr-4">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
            </button>
          </Link>
          <h1 className="text-2xl font-medium">Forget Password</h1>
        </div>

        {/* Content */}
        <div className="bg-white p-8 rounded-b-lg shadow-sm">
          <p className="text-gray-800 text-lg mb-8">
            Enter your email address to get a verification code for resetting your password.
          </p>

          {/* Error message display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-800 font-medium mb-3">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-400"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Sending...' : 'Get OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}