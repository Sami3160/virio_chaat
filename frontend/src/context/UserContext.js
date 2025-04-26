import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { Spinner } from '../components/ui/shadcn-io/spinner';
const VITE_API_BASE = import.meta.env.VITE_API_BASE;

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch updated user info from backend
  const fetchUserInfo = async (token) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${VITE_API_BASE}/api/auth/profile`);
      if (response.data) {
        setUser({ ...response.data, token });
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', token);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      if (err.response?.status === 401) {
        // Token expired or invalid
        await logout();
      }
    }
  };

  // Function to check token expiration
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.exp * 1000 < Date.now();
    } catch (err) {
      console.error('Error checking token expiration:', err);
      return true;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Failed to logout');
    }
  };

  // Effect to handle Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          if (!isTokenExpired(token)) {
            await fetchUserInfo(token);
          } else {
            await logout();
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    // Check for existing user session
    const checkExistingSession = async () => {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');

      if (savedUser && savedToken && !isTokenExpired(savedToken)) {
        setUser(JSON.parse(savedUser));
        await fetchUserInfo(savedToken);
      } else if (savedToken && isTokenExpired(savedToken)) {
        await logout();
      }
      setLoading(false);
    };

    checkExistingSession();
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    error,
    logout,
    fetchUserInfo,
    isTokenExpired
  };

  return (
    <UserContext.Provider value={value}>
      {!loading ? children : <div className="flex items-center justify-center h-screen"><Spinner /></div>}
    </UserContext.Provider>
  );
};