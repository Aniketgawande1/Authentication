// AuthContext.js - Updated with API calls

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; // You'll need to install axios: npm install axios

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is logged in
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await api.get('/auth/verify');
        setCurrentUser(response.data.user);
      } catch (error) {
        // Token invalid or expired
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Save token and user data
      localStorage.setItem('token', token);
      setToken(token);
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      // Optional: notify backend about logout
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout notification failed:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// Example backend API structure (Express.js)
// server.js
/*
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173' // Your frontend URL
}));

// Mock User DB (replace with real database)
const users = [];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword
    };
    
    users.push(newUser);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    // Return user data (without password) and token
    const userData = { ...user };
    delete userData.password;
    
    res.json({ user: userData, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  // User data is already attached in the middleware
  const user = users.find(user => user.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const userData = { ...user };
  delete userData.password;
  
  res.json({ user: userData });
});

app.post('/api/auth/logout', (req, res) => {
  // In a real implementation, you might invalidate the token on the server
  // For JWT, clients typically just remove the token
  res.json({ message: 'Logout successful' });
});

// Protected route example
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(user => user.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const userData = { ...user };
  delete userData.password;
  
  res.json(userData);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
*/