import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true // Important for handling cookies
      });
  
      const { user: loggedInUser } = response.data;
      
      if (!loggedInUser) {
        throw new Error('Login failed: No user data received');
      }

      console.log("User logged in", loggedInUser);
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    axios.post('http://localhost:5000/api/auth/logout', {}, {
      withCredentials: true
    }).catch(error => {
      console.error('Logout failed:', error);
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 