import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Import our Navbar
import Sidebar from './Sidebar'; // Import our Sidebar

const Layout = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 opacity-50 pointer-events-none z-0">
        <div className="absolute inset-0 bg-white/30"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      {/* 1. Navbar (Top) - Fixed height */}
      <Navbar />

      {/* Main container - Takes up the remaining height */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* 2. Sidebar (Left) - Fixed position, full height */}
        <div className="w-64 flex-shrink-0 h-full">
          <Sidebar />
        </div>

        {/* 3. Main Content (Right) - Scrollable */}
        {/* 'flex-1' means: take up all the remaining space except for the Sidebar’s 'w-64'. */}
        {/* 'p-8' gives a bit of padding for nicer spacing. */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden h-full">
          <div className="p-4 md:p-6 lg:p-8 h-full">
            {/* Content wrapper with a card-like aesthetic */}
            <div className="relative h-full">
              {/* Top gradient line */}
              <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>

              {/* Main content card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 min-h-full">
                {/* Header gradient accent line */}
                <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>

                {/* Content area */}
                <div className="p-6 lg:p-8">
                  {/* '<Outlet />' is the placeholder from react-router-dom.
                      When we navigate to '/dashboard', this is where
                      the 'DashboardPage' component will be rendered. */}
                  <Outlet />
                </div>
              </div>

              {/* Decorative glowing elements */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;