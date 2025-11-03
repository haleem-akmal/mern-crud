import { Link } from 'react-router-dom';

// You can add a custom icon
const InventoryIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-16 w-16 text-indigo-500" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 01.707-.293H17" 
    />
  </svg>
);

const HomePage = () => {
  return (
    // Same background style as the Login/Register pages
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-center p-8">
      
      {/* A neat, elegant card */}
      <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-lg border border-gray-200/50">
        
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <InventoryIcon />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hardware Inventory
        </h1>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-10">
          Your one-stop solution to manage, track, and organize your hardware assets efficiently.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {/* Login Link (Primary button style) */}
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg transition duration-300"
          >
            Login
          </Link>
          
          {/* Register Link (Secondary button style) */}
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3 font-bold text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 shadow-sm transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Footer text */}
      <footer className="mt-8 text-gray-500 text-sm">
        © 2025 Hardware Shop. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;