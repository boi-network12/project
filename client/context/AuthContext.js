import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const SERVER_URL = 'http://192.168.43.132:4000';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await fetch(`${SERVER_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
            setIsAuthenticated(true);
          } else {
            // Token may be expired or invalid
            await AsyncStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to check auth status', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${SERVER_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      await AsyncStorage.setItem('token', data.token);
      // Optionally save the refresh token if you have one
      // await AsyncStorage.setItem('refreshToken', data.refreshToken);
      const userResponse = await fetch(`${SERVER_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${data.token}`,
        },
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${SERVER_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      // Optionally handle response if needed
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      // Optionally remove the refresh token if you have one
      // await AsyncStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to refresh token (if using a refresh token)
  const refreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        const response = await fetch(`${SERVER_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) {
          throw new Error('Refresh token failed');
        }
        const data = await response.json();
        await AsyncStorage.setItem('token', data.token); 
      } else {
        throw new Error('No refresh token available');
      }
    } catch (error) {
      console.error('Refresh token error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, refreshToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
