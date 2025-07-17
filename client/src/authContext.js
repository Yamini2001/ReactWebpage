import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        return jwtDecode(storedToken);
      } catch (e) {
        console.error('Error decoding token from localStorage:', e);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const signIn = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      setToken(newToken);
      setUser(decoded);
      localStorage.setItem('token', newToken);
    } catch (err) {
      console.error('Invalid token during signIn:', err);
      setToken(null);
      setUser(null);
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
