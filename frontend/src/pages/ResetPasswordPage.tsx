import { useState } from 'react';
// 'useParams' - needed to get the token from the URL
import { useParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const ResetPasswordPage = () => {
  // Retrieves the token from the URL
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    
    setIsLoading(true);

    try {
      const data = await authService.resetPassword(token, password);
      setIsLoading(false);
      setMessage(data.message); // "Password reset successfully..."
      
      // After 2 seconds, redirect to the login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200/50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Set New Password
          </h2>
          <p className="mt-2 text-gray-500">
            Please enter your new password below.
          </p>
        </div>

        {/* Show the form only if no message */}
        {!message && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
        )}

        {error && <p className="text-red-500 text-center font-medium">{error}</p>}
        {message && <p className="text-green-500 text-center font-medium">{message}</p>}

        {/* Show the login link only if no message */}
        {!message && (
          <div className="text-center text-sm text-gray-600">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;