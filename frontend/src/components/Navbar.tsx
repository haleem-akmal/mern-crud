import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  // Get user info and the logout function from our AuthContext
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 w-full sticky top-0 z-10">
      
      {/* Padding logic:
          pl-[calc(16rem+...)] = (Sidebar width 'w-64' + Main content padding 'p-4/6/8')
          pr-[...] = padding matching the main content ('p-4/6/8')
          This ensures perfect horizontal alignment between the Navbar and the content below it.
      */}
      <div className="pl-[calc(16rem+1rem)] md:pl-[calc(16rem+1.5rem)] lg:pl-[calc(16rem+2rem)] pr-4 md:pr-6 lg:pr-8">
        
        <div className="flex justify-between items-center h-16">
          
          {/* Left side: Logo section */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-3">
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              {/* Logo Text */}
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Logo
              </span>
            </div>
          </div>

          {/* Right side: User Profile and Logout */}
          <div className="flex items-center space-x-4">
            
            {/* User Profile Section */}
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
              
              {/* User Avatar */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-sm">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-white" 
                    viewBox="0 0 20 20" 
                    fill="currentColor">
                    <path 
                      fillRule="evenodd" 
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                {/* Online status indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              
              {/* User Info */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            </div>
            
            {/* Divider line */}
            <div className="h-8 w-px bg-gray-200"></div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 shadow-sm hover:shadow"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}>
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;