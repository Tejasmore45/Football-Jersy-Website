import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define the initial state
const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || [], // Load cart from localStorage or start with an empty array
};

// Define the reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item._id !== action.payload._id) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
};

// Create the CartContext
const CartContext = createContext();

// Create the CartProvider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Sync cart state with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
