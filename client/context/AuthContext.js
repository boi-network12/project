import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const SERVER_URL = 'http://192.168.43.132:4000';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  const storeTokenAndUserId = async (token, userId) => {
    try {
      if (token) {
        await AsyncStorage.setItem('token', token);
      }
      if (userId) {
        await AsyncStorage.setItem('userId', userId);
      }
    } catch (error) {
      console.error('Error storing token and userId:', error);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        if (token) {
          const response = await fetch(`${SERVER_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
            setIsAuthenticated(true);
          } else {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

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
      await storeTokenAndUserId(data.token, data.user.id);
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
      const data = await response.json();
      await storeTokenAndUserId(data.token, data.user.id);
      setIsAuthenticated(true);
      const userResponse = await fetch(`${SERVER_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${data.token}`,
        },
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
        await storeTokenAndUserId(data.token, data.user.id);
      } else {
        throw new Error('No refresh token available');
      }
    } catch (error) {
      console.error('Refresh token error:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${SERVER_URL}/auth/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Delete user failed');
      }
  
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Delete User error', error);
      throw error;
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, refreshToken, setIsAuthenticated, setUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
