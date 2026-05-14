import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  useEffect(() => {
    const fetchUser = async () => {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        try {
          const item = JSON.parse(userInfoStr);
          
          // Check if item has an expiry and if it has expired
          if (item.expiry) {
            if (new Date().getTime() > item.expiry) {
              localStorage.removeItem('userInfo');
              setUser(null);
            } else {
              setUser(item.value);
            }
          } else {
            // Legacy format fallback (no expiry stored)
            setUser(item);
          }
        } catch (error) {
          console.error("Failed to parse user info", error);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data);
      const item = {
        value: res.data,
        expiry: new Date().getTime() + EXPIRATION_TIME,
      };
      localStorage.setItem('userInfo', JSON.stringify(item));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      setUser(res.data);
      const item = {
        value: res.data,
        expiry: new Date().getTime() + EXPIRATION_TIME,
      };
      localStorage.setItem('userInfo', JSON.stringify(item));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const updateProfile = async (formData) => {
    try {
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}` 
        }
      };
      const res = await axios.put('/api/auth/profile', formData, config);
      setUser(res.data);
      const item = {
        value: res.data,
        expiry: new Date().getTime() + EXPIRATION_TIME,
      };
      localStorage.setItem('userInfo', JSON.stringify(item));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
