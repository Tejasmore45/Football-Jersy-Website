import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define the initial state
const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || [], // Load cart from localStorage or start with an empty array
};

// Define the reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cart.findIndex(item => item._id === action.payload._id);

      if (existingItemIndex !== -1) {
        // If item exists, increase the quantity
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return { ...state, cart: updatedCart };
      } else {
        // If item does not exist, add with quantity 1
        return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
      }
    }

    case 'REMOVE_FROM_CART': {
      const existingItemIndex = state.cart.findIndex(item => item._id === action.payload._id);

      if (existingItemIndex !== -1) {
        const updatedCart = [...state.cart];

        if (updatedCart[existingItemIndex].quantity > 1) {
          // Reduce quantity by 1
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity - 1
          };
        } else {
          // Remove item from cart if quantity is 1
          updatedCart.splice(existingItemIndex, 1);
        }

        return { ...state, cart: updatedCart };
      }

      return state;
    }

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
