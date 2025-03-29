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


// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Set up axios defaults
//   useEffect(() => {
//     const user = localStorage.getItem('user');
//     if (user) {
//       const parsedUser = JSON.parse(user);
//       setCurrentUser(parsedUser);
//       // Set authorization header if token exists
//       if (parsedUser.token) {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
//       const user = response.data;
      
//       localStorage.setItem('user', JSON.stringify(user));
//       setCurrentUser(user);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      
//       return user;
//     } catch (error) {
//       throw error.response?.data?.message || 'Login failed';
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/register', userData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data?.message || 'Registration failed';
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     setCurrentUser(null);
//     delete axios.defaults.headers.common['Authorization'];
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
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize axios defaults
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/profile');
      setCurrentUser(res.data.user);
    } catch (err) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
      
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setCurrentUser(res.data.user);
      navigate('/dashboard');
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    error,
    loading,
    login,
    register,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}