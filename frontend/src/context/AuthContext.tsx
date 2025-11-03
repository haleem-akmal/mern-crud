import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Helper library to decode JWT tokens

// 1. Install 'jwt-decode'
//    Before saving this file, open your terminal (inside the frontend folder)
//    and run the command:  npm install jwt-decode

// --- TypeScript Interface ---
// Defines what data our AuthContext will contain
interface AuthContextType {
  token: string | null;
  user: { userId: string; email: string } | null;
  isLoading: boolean; // <-- 1. Added this state
  login: (token: string) => void;
  logout: () => void;
}

// 1. Create the Context (the “box”)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create the Provider (the one who gives the “box” to others)
//    This holds and provides the state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ userId: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // When the app loads, check if there's a token in localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('userToken');
      if (storedToken) {
        setToken(storedToken);
        const decodedUser: { userId: string; email: string } = jwtDecode(storedToken);
        setUser(decodedUser);
      }
    } catch (error) {
      // If the token is invalid or malformed, clear it
      console.error("Failed to parse token:", error);
      localStorage.removeItem('userToken');
    } finally {
      // 3. After checking (whether a token was found or not),
      //    mark loading as false.
      setIsLoading(false);
    }
  }, []); // [] = Runs only once when the app loads

  // --- Login function ---
  const login = (newToken: string) => {
    localStorage.setItem('userToken', newToken); // Save token to localStorage
    setToken(newToken);
    const decodedUser: { userId: string; email: string } = jwtDecode(newToken);
    setUser(decodedUser);
  };

  // --- Logout function ---
  const logout = () => {
    localStorage.removeItem('userToken'); // Remove token from localStorage
    setToken(null);
    setUser(null);
    // (authService.logout() would remove it too,
    //  but clearing state here is equally important)
  };

  // Provide our context data (value) to all child components
  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook (for easier access to the AuthContext)
//    Instead of writing useContext(AuthContext) everywhere,
//    we can simply call useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};