import { View, Text, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { StatusBar } from "expo-status-bar"
import { ThemeContext } from '../context/ThemeContext'
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

export default function ProfileHeader({ user }) {
  const theme = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} >
      <StatusBar style='auto' />
      <Text style={[styles.text, {color: theme.text}]} >My profile</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: hp(6),
    height: hp(11),
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: hp(3)
  },
  text: {
    fontFamily: "Roboto-Bold",
    fontSize: hp("2.5rem"),
    textTransform: "capitalize"
  }
})
