import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { StatusBar } from "expo-status-bar"
import React from 'react'
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Security({ theme, router}) {
  const returnBack = () => {
    router.back()
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style='auto'/>
      <TouchableWithoutFeedback
          onPress={returnBack}
      >
        <View style={[styles.btn, { backgroundColor: theme.btnTab }]} >
          <MaterialIcons name="arrow-back" size={hp(3)} color={theme.text}/>
          <Text style={[styles.text, { color: theme.text }]} >Security</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
      width: '100%',
      height: hp(11),
      flexDirection: "row",
      alignItems: "center",
      paddingTop: hp(4),
      paddingHorizontal: hp(3),
      justifyContent: "flex-start",
      shadowColor: '#ccc',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.95,
      shadowRadius: 0.2,
      elevation: 2,
    },
    btn: {
      flexDirection: "row",
      padding: hp(0.5),
      alignItems: "center",borderRadius: hp(.5),
      gap: hp(0.4)
    },
    text: {
      fontFamily: "Roboto-Bold",
      fontSize: hp(2.5)
    }
})