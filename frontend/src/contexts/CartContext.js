import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.product.id === product.id);

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += quantity;

        if (updatedCart[existingProductIndex].quantity <= 0) {
          updatedCart.splice(existingProductIndex, 1);
        }
        return updatedCart;
      } else {
        if (quantity <= 0) return prevCart;
        const newCart = [...prevCart, { product, quantity }];
        return newCart;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.product.id === productId) {
          if (newQuantity <= 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item !== null);

      return updatedCart;
    });
  };

 
  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};
