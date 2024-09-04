import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to handle auth check

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false); // Auth check is complete even if no token is found
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (error) {
        console.error('Error verifying user:', error);
        localStorage.removeItem('token');
        setUser(null);
        // Redirect to login page if the token is invalid or expired
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false); // Set loading to false after auth check
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/'; // Redirect to home page after logout
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export { AuthContext, AuthProvider };
