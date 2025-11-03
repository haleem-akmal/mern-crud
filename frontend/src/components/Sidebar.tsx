import { NavLink } from 'react-router-dom';

// --- SVG Icons (as Components) ---
// Keeping icons as separate JSX components makes the code cleaner.

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6" // The icon size has been adjusted from 'h-10 w-10' to 'h-6 w-6'
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// --- Sidebar Main Component ---

const Sidebar = () => {
  return (
    <div className="w-64 bg-white h-full border-r border-gray-200">
      <div className="flex flex-col h-full">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Navigation
          </h2>
        </div>

        {/* Navigation Links - Scrollable */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          
          {/* Link 1: Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ' +
              (isActive
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600' // Active style
                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600') // Inactive style
            }
            title="Dashboard"
          >
            {({ isActive }) => (
              <>
                <span
                  className={
                    'relative transition-colors duration-200 ' +
                    (isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600')
                  }
                >
                  <UserIcon />
                </span>
                <span className="relative font-medium">Dashboard</span>
                <span
                  className={
                    'relative ml-auto w-1 h-8 bg-indigo-600 rounded-full transition-opacity duration-200 ' +
                    (isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100') // Active indicator
                  }
                ></span>
              </>
            )}
          </NavLink>

          {/* Link 2: My Profile */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ' +
              (isActive
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600')
            }
            title="My Profile"
          >
            {({ isActive }) => (
              <>
                <span
                  className={
                    'relative transition-colors duration-200 ' +
                    (isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600')
                  }
                >
                  <ProfileIcon />
                </span>
                <span className="relative font-medium">My Profile</span>
                <span
                  className={
                    'relative ml-auto w-1 h-8 bg-indigo-600 rounded-full transition-opacity duration-200 ' +
                    (isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')
                  }
                ></span>
              </>
            )}
          </NavLink>

          {/* (Add additional NavLink components here as needed) */}
          
        </nav>

        {/* Footer Section */}
        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center justify-center">
            <div className="flex space-x-1">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse delay-75"></span>
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse delay-150"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;