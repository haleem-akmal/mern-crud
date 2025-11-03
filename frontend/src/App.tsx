import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardPage from './pages/DashboardPage'; // DashboardPage should be imported here
import Layout from './components/Layout'; // <-- 1. Import our Layout component
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // <-- 1. Import it
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 3. Route for Forgot Password Page */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* 4. Route for link coming from email (with token) */}
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* --- Private Routes --- */}
      <Route element={<PrivateRoute />}>
        {/* 2. Place our 'Layout' component here */}
        {/* This will display Navbar and Sidebar */}
        <Route element={<Layout />}>
          {/* 3. Pages rendered inside the Layout (in its Outlet) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;