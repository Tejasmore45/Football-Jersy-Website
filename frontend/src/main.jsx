import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; 
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router } from 'react-router-dom'; // Ensure Router is imported
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* Router should be here */}
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);
