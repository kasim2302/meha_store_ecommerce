import React, { createContext, useState, useEffect } from 'react';

export const PrePurchaseContext = createContext();

export const PrePurchaseProvider = ({ children }) => {
  const [prePurchaseItems, setPrePurchaseItems] = useState([]);

  useEffect(() => {
    const savedItems = localStorage.getItem('prePurchaseItems');
    if (savedItems) {
      try {
        setPrePurchaseItems(JSON.parse(savedItems));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('prePurchaseItems', JSON.stringify(prePurchaseItems));
  }, [prePurchaseItems]);

  const addToPrePurchase = (product, quantity) => {
    setPrePurchaseItems((prev) => {
      const existing = prev.find(item => item.product._id === product._id);
      if (existing) {
        return prev.map(item => 
          item.product._id === product._id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, priceAtSelection: product.price }];
    });
  };

  const removeFromPrePurchase = (productId) => {
    setPrePurchaseItems(prev => prev.filter(item => item.product._id !== productId));
  };

  const clearPrePurchase = () => {
    setPrePurchaseItems([]);
  };

  const getPrePurchaseTotal = () => {
    return prePurchaseItems.reduce((total, item) => total + (item.priceAtSelection * item.quantity), 0);
  };

  return (
    <PrePurchaseContext.Provider value={{ 
      prePurchaseItems, 
      addToPrePurchase, 
      removeFromPrePurchase, 
      clearPrePurchase,
      getPrePurchaseTotal
    }}>
      {children}
    </PrePurchaseContext.Provider>
  );
};
