import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // 1. Get both 'token' and 'isLoading' from the AuthContext
  const { token, isLoading } = useAuth();

  // 2. First, check if it’s still loading
  if (isLoading) {
    // The context is still checking localStorage for existing auth data
    // You could show a loading spinner here—or show nothing at all
    return <div>Loading user...</div>; // (or simply return null;)
  }

  // 3. Once loading is done, check for the token
  if (token) {
    // Token exists → allow the user in
    return <Outlet />;
  } else {
    // No token → redirect to login page
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;