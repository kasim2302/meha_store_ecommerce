import React, { createContext, useState, useEffect, useContext } from 'react';

export const RecentlyViewedContext = createContext();

const MAX_ITEMS = 5;
const STORAGE_KEY = 'recentlyViewed';

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRecentlyViewed(JSON.parse(saved));
    } catch (e) {
      console.error('RecentlyViewed: failed to parse localStorage', e);
    }
  }, []);

  // Persist to localStorage whenever list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    } catch (e) {
      console.error('RecentlyViewed: failed to save to localStorage', e);
    }
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product) => {
    if (!product?._id) return;
    setRecentlyViewed((prev) => {
      // Remove if already exists (so it moves to front)
      const filtered = prev.filter((p) => p._id !== product._id);
      // Add to front, cap at MAX_ITEMS
      return [product, ...filtered].slice(0, MAX_ITEMS);
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);
