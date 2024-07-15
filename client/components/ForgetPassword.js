import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

export default function ForgetPassword({ forgetPassword, verifyOtpAndResetPassword, theme, user, onClose }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState(1) // 1: email, 2: OTP, 3: new password
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleForgetPassword = async () => {
    setLoading(true)
    try {
      await forgetPassword(email)
      alert('OTP sent successfully')
      setCountdown(60) // 1 minute countdown
      setStep(2)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp === '1234') { // Replace with actual OTP verification logic
      setStep(3)
    } else {
      alert('Invalid OTP')
    }
  }

  const handleResetPassword = async () => {
    setLoading(true)
    try {
      await verifyOtpAndResetPassword(email, otp, newPassword)
      alert('Password reset successfully')
      onClose()
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name='keyboard-backspace' size={hp(3)} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.text, { color: theme.text }]}>Request for an OTP</Text>
      </View>

      <View style={styles.form}>
        {step === 1 && (
          <>
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
              placeholderTextColor={theme.clickBackGround}
              placeholder='Email Address'
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: theme.primaryBtn }]}
              onPress={handleForgetPassword}
            >
              {loading ? (
                <Text style={[styles.label, { color: "#f2f2f2" }]}>
                  Loading...
                </Text>
              ) : (
                <Text style={[styles.label, { color: "#f2f2f2" }]}>
                  Send OTP
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={[styles.label, { color: theme.text }]}>OTP</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
              placeholderTextColor={theme.clickBackGround}
              placeholder='Input OTP'
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: theme.primaryBtn }]}
              onPress={handleVerifyOtp}
            >
              <Text style={[styles.label, { color: "#f2f2f2" }]}>
                Verify OTP
              </Text>
            </TouchableOpacity>
            {countdown > 0 && (
              <Text style={[styles.label, { color: theme.text }]}>
                Resend OTP in {countdown}s
              </Text>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <Text style={[styles.label, { color: theme.text }]}>New Password</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
              placeholderTextColor={theme.clickBackGround}
              placeholder='Set New Password'
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: theme.primaryBtn }]}
              onPress={handleResetPassword}
            >
              {loading ? (
                <Text style={[styles.label, { color: "#f2f2f2" }]}>
                  Loading...
                </Text>
              ) : (
                <Text style={[styles.label, { color: "#f2f2f2" }]}>
                  Confirm Password
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  header: {
    padding: hp(2),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: hp(2)
  },
  text: {
    fontFamily: "Roboto-Bold",
    fontSize: hp(2.5),
  },
  label: {
    fontFamily: "Roboto-Regular",
    fontSize: hp(2)
  },
  form: {
    padding: hp(3),
    marginTop: hp(3)
  },
  input: {
    fontFamily: "Roboto-Regular",
    borderWidth: hp(.1),
    padding: hp(1),
    marginBottom: hp(4),
    marginTop: hp(1)
  },
  btn: {
    padding: hp(2),
    marginTop: hp(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
})
