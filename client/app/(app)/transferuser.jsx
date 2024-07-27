import { View, Text, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import TransferDetails from '../../components/TransferDetails'
import { useAuth } from '../../context/AuthContext'

export default function TransferUser() {
  const theme = useContext(ThemeContext)
  const { sendMoney, handleGetUserToTransfer } = useAuth()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} >
        <TransferDetails 
            sendMoney={sendMoney} 
            handleGetUserToTransfer={handleGetUserToTransfer}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection: "column",
    width: "100%"
  }
})