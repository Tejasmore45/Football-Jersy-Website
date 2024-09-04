import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css'; // Import the CSS file for styling

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://football-jersy-website-backend.onrender.com/api/users/login', { email, password });
      console.log('Login successful:', response.data); // Check the response
      localStorage.setItem('token', response.data.token);

      // Redirect based on user role
      if (response.data.isAdmin) {
        window.location.href = '/admin'; // Redirect to admin dashboard if user is admin
      } else {
        window.location.href = '/jerseys'; // Redirect to jerseys page if user is not admin
      }
    } catch (error) {
      console.error('Login error:', error); // Log the error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-group">
            <input
              type={showPassword ? 'text' : 'password'} // Toggle password visibility
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
