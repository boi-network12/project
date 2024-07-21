import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StatusBar } from "expo-status-bar";

export default function Login() {
  const { login } = useAuth();
  const theme = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      setError('');
      await login(email, password);
      setLoading(false)
    } catch (err) {
      setLoading(false);
      setError('Failed to login. Please check your credentials and try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="auto" />
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: theme.text }]}>Login</Text>
        <Text style={[styles.subHeader, { color: theme.text }]}>Access your account</Text>
      </View>
      <View style={styles.formContainer}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: "#f2f2f2" }]}>Email</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.text, color: theme.text }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#888"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: "#f2f2f2" }]}>Password</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.text, color: theme.text }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#888"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.btn, styles.shadow, { backgroundColor: theme.primaryBtn }]}
        >
          {loading ? (
            <Text style={[styles.btnText, { color: "#f2f2f2", fontFamily: "Roboto-Bold" }]}>
            Loading...
          </Text>
          ) : (
            <Text style={[styles.btnText, { color: "#f2f2f2", fontFamily: "Roboto-Bold" }]}>
            Login
          </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  headerContainer: {
    marginBottom: hp(3),
  },
  header: {
    fontSize: hp(4),
    fontFamily: 'Roboto-Bold',
  },
  subHeader: {
    fontSize: hp(2),
    fontFamily: 'Roboto-Regular',
    color: '#6c6c6c',
  },
  formContainer: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
  btn: {
    width: "100%",
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: hp(2),
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  btnText: {
    fontSize: hp(2.5),
    fontFamily: 'Roboto-Bold',
  },
});
