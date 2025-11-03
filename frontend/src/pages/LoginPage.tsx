// 1. Import 'Link' as well
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- 'Link' is imported here
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  // --- State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // <-- Added loading state

  const navigate = useNavigate();
  const { login } = useAuth(); 

  // --- Functions ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // <-- Start loading

    try {
      const data = await authService.login(email, password);
      login(data.token); 
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsLoading(false); // <-- Stop loading even if there’s an error
    }
    // On success, the component unmounts automatically, so no need to stop loading manually.
  };

  // --- JSX (Updated UI) ---
  return (
    // Use the same background style as the RegisterPage
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* A card styled similarly to the dashboard design */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200/50">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back!
          </h2>
          <p className="mt-2 text-gray-500">
            Login to access your inventory dashboard.
          </p>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              // Matches the Profile page input styling
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot Password?
            </Link>
          </div>
          
          {/* Submit Button (Styled like the Dashboard buttons) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50 transition duration-300"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        {/* Register Link */}
        <div className="text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link 
            to="/register" 
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;