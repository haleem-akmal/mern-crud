// 1. Import 'Link'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- 'Link' here
import authService from '../services/authService';

// RegisterPage component
const RegisterPage = () => {
  // --- State ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // <-- 2. Loading state

  const navigate = useNavigate();

  // --- Functions ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(null); 
    setMessage(null);
    setIsLoading(true); // <-- 3. Start loading

    try {
      const data = await authService.register(name, email, password);
      setMessage(data.message);
      setIsLoading(false); // <-- Even if successful, stop loading
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setIsLoading(false); // <-- 4. Even if there's an error, stop loading
    }
  };

  // --- 5. New UI (JSX) ---
  return (
    // We'll modify the background like 'LoginPage'
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 'LoginPage' card style */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200/50">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Your Account
          </h2>
          <p className="mt-2 text-gray-500">
            Get started with your inventory.
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              // 'LoginPage' input style
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
          
          {/* Submit Button (Gradient style) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50 transition duration-300"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Error/Success Messages */}
        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}
        {message && (
          <p className="text-green-500 text-center font-medium">{message}</p>
        )}

        {/* Login Link */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" // <-- Goes to '/login' page
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;