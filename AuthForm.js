import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = () => {
  const [formType, setFormType] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation
    if (name === 'email' && value) {
      const isValid = validateEmail(value);
      setErrors({
        ...errors,
        email: isValid ? '' : 'Please enter a valid email address'
      });
    } else if (name === 'password' && value) {
      const isValid = validatePassword(value);
      setErrors({
        ...errors,
        password: isValid ? '' : 'Password must be at least 8 characters'
      });
    }
  };

  // Switch between login and register forms
  const toggleFormType = () => {
    setFormType(formType === 'login' ? 'register' : 'login');
    setErrors({});
    setServerMessage(null);
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formType === 'register' && !formData.username) {
      newErrors.username = 'Username is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setServerMessage(null);

    try {
      const endpoint = formType === 'register' ? '/api/register' : '/api/login';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setServerMessage({ type: 'error', text: data.error || 'An error occurred' });
      } else {
        setUser(data);
        setServerMessage({ 
          type: 'success', 
          text: formType === 'register' 
            ? 'Registration successful!' 
            : 'Login successful!' 
        });
      }
    } catch (error) {
      setServerMessage({ type: 'error', text: 'Server error. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Log out
  const handleLogout = () => {
    setUser(null);
    setServerMessage(null);
  };

  return (
    <div className="auth-container">
      {user ? (
        <div className="profile-summary">
          <h2>Welcome, {user.username}!</h2>
          <p>You are logged in with email: {user.email}</p>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      ) : (
        <>
          <h2>{formType === 'login' ? 'Login' : 'Register'}</h2>
          
          {serverMessage && (
            <div className={`message ${serverMessage.type}`}>
              {serverMessage.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            {formType === 'register' && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'invalid' : ''}
                />
                {errors.username && <div className="error">{errors.username}</div>}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'invalid' : ''}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'invalid' : ''}
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : formType === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
          
          <div className="form-switch">
            {formType === 'login' ? (
              <p>Don't have an account? <button onClick={toggleFormType}>Register</button></p>
            ) : (
              <p>Already have an account? <button onClick={toggleFormType}>Login</button></p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AuthForm;