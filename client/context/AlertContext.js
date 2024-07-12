// context/AlertContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from './ThemeContext';

// Define the context
const AlertContext = createContext();

// Create a custom hook to use the AlertContext
export const useAlert = () => {
  return useContext(AlertContext);
};

// Create the AlertProvider component
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const theme = useContext(ThemeContext); // Access the theme from ThemeContext

  const showAlert = (type, title, message, onOk, onCancel) => {
    setAlert({ type, title, message, onOk, onCancel });
  };

  const showPrompt = (title, message, onSubmit, onCancel) => {
    setPrompt({ title, message, onSubmit, onCancel });
  };

  useEffect(() => {
    if (alert) {
      const { type, title, message, onOk, onCancel } = alert;

      let buttons = [
        { text: 'Cancel', onPress: () => { if (onCancel) onCancel(); }, style: 'cancel' },
        { text: 'OK', onPress: () => { if (onOk) onOk(); } },
      ];

      const alertStyles = StyleSheet.create({
        container: {
          backgroundColor: theme.background,
          padding: 20,
          borderRadius: 10,
        },
        title: {
          color: theme.text,
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        message: {
          color: theme.text,
          fontSize: 16,
          marginBottom: 20,
        },
        button: {
          padding: 10,
          borderRadius: 5,
        },
      });

      if (type === 'success') {
        Alert.alert(title, message, buttons);
      } else if (type === 'error') {
        Alert.alert(title, message, buttons);
      } else if (type === 'info') {
        Alert.alert(title, message, buttons);
      }

      setAlert(null); // Clear the alert after showing
    }
  }, [alert, theme]);

  useEffect(() => {
    if (prompt) {
      const { title, message, onSubmit, onCancel } = prompt;

      Alert.prompt(
        title,
        message,
        [
          { text: 'Cancel', onPress: () => { if (onCancel) onCancel(); }, style: 'cancel' },
          { text: 'Submit', onPress: (text) => { if (onSubmit) onSubmit(text); } },
        ],
        'plain-text'
      );

      setPrompt(null); // Clear the prompt after showing
    }
  }, [prompt]);

  return (
    <AlertContext.Provider value={{ showAlert, showPrompt }}>
      {children}
    </AlertContext.Provider>
  );
};
