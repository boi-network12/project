import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { StatusBar } from "expo-status-bar"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { ThemeContext } from '../context/ThemeContext';

export default function SavedCardHeader({router}) {
    const theme = useContext(ThemeContext)
    const returnBack =() => {
        router.replace('profile')
    }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} >
        <StatusBar style='auto'/>
        <TouchableOpacity onPress={returnBack} style={[styles.click]} >
            <MaterialIcons name='keyboard-backspace' size={hp(3)} color={theme.text} />
            <Text style={[styles.text, { color : theme.text }]}>Saved Card</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        height: hp(10),
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        paddingHorizontal: hp(3),
        paddingVertical: hp(1),
        shadowColor: '#ccc',  
        shadowOffset: { width: 0, height: 2 },  
        shadowOpacity: 0.3, 
        shadowRadius: 4, 
        elevation: 2,  
        
    },
    text: {
        fontFamily: "Roboto-Bold",
        fontSize: hp(2),
        
    },
    click: {
        flexDirection: "row",
        alignItems: "center",
        gap: hp(1),
    }
})