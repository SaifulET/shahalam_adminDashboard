import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 // Adjust the path as neededmport axios from 'axios';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';

export default function EmailVerification() {
  const [code, setCode] = useState(['', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get email from Zustand store
  const email = useAuthStore((state) => state.email);
 

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(''); // Clear error when user types

    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const arrowback = () => {
    navigate("/settings/forget-password");
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    // Validate OTP
    if (verificationCode.length !== 4) {
      setError('Please enter complete 4-digit code');
      return;
    }

    // Check if email exists in store
    if (!email) {
      setError('Email not found. Please try again from forgot password.');
      setTimeout(() => {
        navigate("/settings/forget-password");
      }, 2000);
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // API call to verify OTP
       await api.post('/auth/verify-otp', {
        email: email,
        otp: verificationCode
      });

      
      

      // Navigate to settings or reset password page
      // You can change this based on your flow
      navigate("/settings/set-new-password");
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Email not found. Please try again from forgot password.');
      setTimeout(() => {
        navigate("/settings/forget-password");
      }, 2000);
      return;
    }

    setIsResending(true);
    setError('');

    try {
      // API call to resend OTP
       await api.post('/auth/forgot-password', {
        email: email
      });

      // Clear code inputs
      setCode(['', '', '', '']);
      
      // You can show a success message here if needed
      console.log('OTP resent successfully');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Optional: Redirect if no email in store
  if (!email) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-start justify-center py-4 mt-20">
        <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden mt-8 p-8">
          <p className="text-red-500 text-center">
            No email found. Redirecting to forgot password...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-4 mt-20">
      <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden mt-8">
        {/* Header */}
        <div className="bg-blue-500 px-6 py-4 flex items-center">
          <button onClick={arrowback} className="text-white mr-4 hover:bg-blue-600 rounded p-1 transition-colors">
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
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>
          <h1 className="text-white text-2xl font-semibold">Email Verification</h1>
        </div>

        {/* Content */}
        <div className="px-6 py-12">
          <div className="max-w-md mx-auto">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Instruction Text */}
            <p className="text-gray-800 text-center text-lg mb-8">
              Please check your email. We have sent a code to <br />
              <span className="font-semibold">{email}</span>
            </p>

            {/* Code Input Boxes */}
            <div className="flex justify-center gap-4 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-16 h-16 text-center text-2xl font-semibold border-2 rounded-lg focus:outline-none transition-colors ${
                    error && !digit ? 'border-red-300' : 'border-gray-300'
                  } focus:border-blue-500`}
                  placeholder="–"
                  disabled={isVerifying || isResending}
                />
              ))}
            </div>

            {/* Resend Link */}
            <div className="flex justify-between items-center mb-6 px-1">
              <span className="text-sm text-gray-600">Didn't receive code?</span>
              <button
                onClick={handleResend}
                disabled={isResending || isVerifying}
                className="text-sm text-gray-800 underline hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend'}
              </button>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isVerifying || isResending}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors ${
                (isVerifying || isResending) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}