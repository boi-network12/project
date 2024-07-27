import { View, Text, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import TransferHeader from './TransferHeader'
import { Stack, useRouter } from 'expo-router'
import TransferForm from './TransferForm'
import { ThemeContext } from '../context/ThemeContext'
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

export default function TransferDetails({sendMoney, handleGetUserToTransfer}) {
  const theme = useContext(ThemeContext)
  const router = useRouter()
  return (
    <View style={{ flex: 1}}>
      <Stack.Screen
          options={{
            header: () => (
              <View style={[styles.heading, { backgroundColor: theme.background}]} >
                <TransferHeader router={router}/>
              </View>
            )
          }}
      />
      <TransferForm 
          sendMoney={sendMoney}
          handleGetUserToTransfer={handleGetUserToTransfer}
          router={router}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
        width: "100%",
        height: hp(40),
        overflow: "hidden"
    }
})