import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // While loading, you can return a loading spinner or nothing
    return null; // Optionally, replace with a loading spinner component if desired
  }

  if (user) {
    // User is authenticated, return the element
    return element;
  } else {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
