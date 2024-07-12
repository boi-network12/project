import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import React, { useContext } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ThemeContext } from '../context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function KycHeader({router}) {
    const theme = useContext(ThemeContext)

    const returnBtn = () => {
        router.replace('account');  
    }


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={returnBtn}>
            <Ionicons name="chevron-back" size={hp(4)} color={theme.text}/>
        </TouchableOpacity>
        <Text style={{
            color: theme.text, 
            fontFamily: "Roboto-Regular",
            fontWeight: "300",
            fontSize: hp("2rem")
        }}>Kyc Verification</Text>
        <View></View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: hp(10),
      paddingHorizontal: hp(2),
      paddingTop: hp(4),
      shadowColor: '#444',  
      shadowOffset: { width: 0, height: 2 },  
      shadowOpacity: 0.3, 
      shadowRadius: 4, 
      elevation: 2, 
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
})
