import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/custom components/spinner';
const VITE_API_BASE = import.meta.env.VITE_API_BASE;


const UserContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
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

  
  const saveSession=(userData, token)=>{
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
  }

  const clearSession = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      return decoded.exp * 1000 < Date.now();
    } catch (err) {
      console.error('Invalid token', err);
      return true;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${VITE_API_BASE}/api/auth/login`, { email, password });
      const { token, user: userData } = res.data;
      saveSession(userData, token);
      setUser(userData);
    } catch (err) {
      throw err.response?.data?.message || 'Login failed';
    }
  };

  const logout = async () => {
      clearSession();
  };

  const isLoggedIn = () => {
    return !!user;
  };
  // Function to fetch updated user info from backend

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE}/api/auth/profile`);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      clearSession();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !isTokenExpired(token)) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          await fetchProfile();
        } catch (err) {
          clearSession();
        }
      } else {
        clearSession();
      }
      setLoading(false);
    };
    initAuth();
  }, []);



  const value = {
    user,
    loading,
    login,
    logout,
    fetchProfile,
    isLoggedIn,
  };
  
  return (
    <UserContext.Provider value={value}>
      {!loading ? children : <div className="flex items-center justify-center h-screen"><Spinner /></div>}
    </UserContext.Provider>
  );
};