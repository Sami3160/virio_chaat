import { useState, useEffect } from "react";
import AuthContext from "./AuthProvider";

const loginUser = () => {};
const registerUser = () => {};
const logoutUser = () => {};
const fetchUserProfile = () => {};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user on app load
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await fetchUserProfile(token);
          setUser(userData);
        } catch (err) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeUser();
  }, []);

  const login = async (credentials) => {
    const { token, user } = await loginUser(credentials);
    localStorage.setItem("token", token);
    setUser(user);
  };

  const register = async (data) => {
    const { token, user } = await registerUser(data);
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    logoutUser(); // optionally hit an endpoint
    localStorage.removeItem("token");
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const userData = await fetchUserProfile(token);
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, refreshUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
