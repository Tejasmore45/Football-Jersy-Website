import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Cart from './components/Cart';
import UserProfilePage from './pages/UserProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import JerseyList from './components/JerseyList';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/jerseys" element={<JerseyList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Routes */}
        <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
        <Route path="/checkout" element={<PrivateRoute element={<CheckoutPage />} />} />
        <Route path="/profile" element={<PrivateRoute element={<UserProfilePage />} />} />
        <Route path="/orders" element={<PrivateRoute element={<MyOrdersPage />} />} />
        <Route path="/orders/:orderId" element={<PrivateRoute element={<OrderDetailsPage />} />} />
      </Routes>
    </div>
  );
};

export default App;
