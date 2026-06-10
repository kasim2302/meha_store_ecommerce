import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import { AuthContext } from './AuthContext';
import { useToast } from './ToastContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [wishlist, setWishlist] = useState([]); // array of populated product objects

  // Fetch wishlist from server whenever user changes
  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlist([]); return; }
    try {
      const { data } = await axios.get('/api/wishlist');
      setWishlist(data);
    } catch {
      setWishlist([]);
    }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const isWishlisted = (productId) =>
    wishlist.some((p) => p._id === productId || p === productId);

  const addToWishlist = async (product) => {
    if (!user) {
      toast.info('Please log in to save to wishlist.', 'Login Required');
      return;
    }
    try {
      await axios.post(`/api/wishlist/${product._id}`);
      setWishlist((prev) => (prev.find((p) => p._id === product._id) ? prev : [product, ...prev]));
      toast.success(`${product.name} added to wishlist!`, 'Wishlist');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to wishlist', 'Error');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`/api/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Removed from wishlist', 'Wishlist');
    } catch {
      toast.error('Failed to remove from wishlist', 'Error');
    }
  };

  const toggleWishlist = async (product) => {
    if (isWishlisted(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, addToWishlist, removeFromWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
