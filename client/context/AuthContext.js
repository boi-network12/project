import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const SERVER_URL = 'http://192.168.43.132:4000';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [nextOfKin, setNextOfKin] = useState(null)
  

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
        console.log('Fetched Token:', token);

        const userId = await AsyncStorage.getItem('userId');
        console.log('Fetched userId:', userId); 

        if (token) {
          const response = await fetch(`${SERVER_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
  
          if (response.ok) {
            const data = await response.json();
            setUser(data);
            setIsAuthenticated(true);
            await fetchNextOfKin();
            
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
      console.log('Register response data:', data);

      await storeTokenAndUserId(data.token, data.user.id);
      setIsAuthenticated(true);

      const userResponse = await fetch(`${SERVER_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${data.token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);//
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

  
  // fetch nextOfKin data from AsyncStorage
  const fetchNextOfKin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${SERVER_URL}/nextOfKin/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if(!response.ok) {
        throw new Error('Failed to fetch next of kin data');
      }

      const data = await response.json();
      setNextOfKin(data.nextOfKin);

      return data.nextOfKin;

    } catch (error) {
      console.error('Fetch next of kin error: ', error);
    }
  };
  
  const fetchTokenAndUserId = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
  
      // Retrieve the userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found');
  
      return { token, userId };
    } catch (error) {
      console.error('Error fetching token and userId:', error.message);
      throw error;
    }
  };
  

  // add next of kin data
  const addNextOfKin = async (nextOfKinData) => {
    try {
      // Fetch token and userId
      const { token, userId } = await fetchTokenAndUserId();
  
      const response = await fetch(`${SERVER_URL}/nextOfKin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...nextOfKinData, userId }),  // Ensure userId is included
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Failed to add next of kin:', data.errors || data.message);
        throw new Error(data.errors ? data.errors.map(err => err.msg).join(', ') : data.message);
      }
  
      console.log('Add next of kin response data:', data);
      return data;
    } catch (error) {
      console.error('Add next of kin error:', error.message);
      throw error;
    }
  };
  

  
  const updateNextOfKin = async (id, updates) => {
    try {
      if (!id) throw new Error('No next of kin ID provided');
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token available');
  
      const response = await fetch(`${SERVER_URL}/nextOfKin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update next of kin error:', errorData);
        throw new Error(errorData.message || 'Failed to update next of kin');
      }
  
      // Fetch the updated list of next of kin
      await fetchNextOfKin();
  
    } catch (error) {
      console.error('Update next of kin error:', error);
      throw error;
    }
  };
  
  
  
  const updateUserStatus = async (userId, newStatus) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token available');
  
      const response = await fetch(`${SERVER_URL}/users/status/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('User status updated:', data);
      } else {
        console.error('Error updating status:', data.msg);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  
  
  const changeEmail = async (newEmail, password) => {
    try {
      const token = await AsyncStorage.getItem('token');  // Fetch the token from AsyncStorage
  
      if (!token) throw new Error('No token available');  // Check if token is available
      
      const response = await fetch(`${SERVER_URL}/auth/change-email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newEmail, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Email changed successfully:', data);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      throw new Error('Network error: ' + error.message);
    }
  };
  
  // Add role based functionality
  const confirmKyc = async (kycId) => {
    try {
      if (user.role !== 'admin') throw new Error('Only admin can confirm KYC');
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token available');

      const response = await fetch(`${SERVER_URL}/kyc/confirm-kyc/${kycId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to confirm KYC');
      }

      const data = await response.json();
      console.log('KYC confirmed:', data);
      return data;
    } catch (error) {
      console.error('Confirm KYC error:', error);
      throw error;
    }
  }

  const getAllKyc = async () => {
    try {
      if (user.role !== 'admin') throw new Error('Only admin can get all KYC');
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token available');

      const response = await fetch(`${SERVER_URL}/kyc/get-all-records`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch all KYC');
      }

      const data = await response.json();
      console.log('Fetched all KYC data:', data);
      return data;
    } catch (error) {
      console.error('Get all KYC error:', error);
      throw error;
    }
  };

  const rejectKyc = async (kycId) => {
    try {
      if (user.role !== 'admin') throw new Error('Only admin can reject KYC');
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token available');

      const response = await fetch(`${SERVER_URL}/kyc/reject-kyc/${kycId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject KYC');
      }

      const data = await response.json();
      console.log('KYC rejected:', data);
      return data;
    } catch (error) {
      console.error('Reject KYC error:', error);
      throw error;
    }
  };
  
  const postKycData = async (kycData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      const response = await fetch(`${SERVER_URL}/kyc/upload-kyc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...kycData, userId }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to post KYC data:', errorData);
        throw new Error(errorData.message || 'Failed to post KYC data');
      }

      const data = await response.json();
      console.log('KYC data posted:', data);
      return data;
    } catch (error) {
      console.error('Post KYC data error:', error);
      throw error;
    }
  };
  
  


  return (
    <AuthContext.Provider value={{ 
      user,
      isAuthenticated, 
      login, 
      register, 
      logout, 
      refreshToken, 
      setIsAuthenticated, 
      setUser, 
      deleteUser,  
      fetchNextOfKin, 
      addNextOfKin, 
      updateNextOfKin,
      nextOfKin,
      fetchNextOfKin,
      updateUserStatus,
      changeEmail,
      confirmKyc,
      getAllKyc,
      rejectKyc,
      postKycData
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
