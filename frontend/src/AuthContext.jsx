// import React, { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is logged in (e.g., from localStorage or session)
//     const user = localStorage.getItem('user');
//     if (user) {
//       setCurrentUser(JSON.parse(user));
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData) => {
//     // In a real app, you would validate credentials with your backend
//     // For this example, we'll just store the user in localStorage
//     localStorage.setItem('user', JSON.stringify(userData));
//     setCurrentUser(userData);
//     return Promise.resolve(userData);
//   };

//   const register = (userData) => {
//     // In a real app, you would send this data to your backend
//     // For this example, we'll simulate a successful registration
//     return Promise.resolve(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     setCurrentUser(null);
//   };

//   const value = {
//     currentUser,
//     login,
//     register,
//     logout,
//     loading
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };
// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      // Set authorization header if token exists
      if (parsedUser.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      const user = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      
      return user;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};