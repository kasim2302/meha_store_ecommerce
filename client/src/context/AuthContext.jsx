import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app load: verify the httpOnly cookie with the server and restore user state.
    // Nothing is read from localStorage — the cookie does all the work.
    const restoreSession = async () => {
      try {
        const res = await axios.get('/api/auth/profile');
        setUser(res.data); // safe fields only: _id, name, email, role, profilePicture
      } catch {
        // Cookie missing or expired — user is not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // @desc Login — server sets JWT as httpOnly cookie, we only keep display state in memory
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data); // stored in React state (memory) only — NOT localStorage
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // @desc Register — same as login
  const register = async (name, email, password, phone) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, phone: phone || '' });
      setUser(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  // @desc Update profile — cookie sent automatically, no Authorization header needed
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put('/api/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  };

  // @desc Logout — server expires the httpOnly cookie, state is cleared from memory
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch {
      // proceed with local logout even if request fails
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
