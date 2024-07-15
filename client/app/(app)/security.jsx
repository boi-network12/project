import { View, Text, StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native'
import React, { useContext, useState } from 'react'
import SecurityHeader from "../../components/SecurityHeader"
import { useAuth } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'
import { useRouter } from "expo-router"
import Ionicons from '@expo/vector-icons/Ionicons';
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import PasswordChange from '../../components/PasswordChange'

export default function Security() {
    const { user, changePassword, forgetPassword, verifyOtpAndResetPassword } = useAuth()
    const theme = useContext(ThemeContext)
    const router = useRouter()
    const [showPasswordModel, setPasswordModel] = useState(false)
    

    const handlePasswordModelOpen = () => {
        setPasswordModel(true)
    }

    const handlePasswordModelClose = () => {
        setPasswordModel(false)
    }


    return (
        <View style={[styles.container]} >
            <SecurityHeader
                theme={theme}
                user={user}
                router={router}
            />
        <View style={[styles.secondContainer, { backgroundColor: theme.background }]} >
            <TouchableWithoutFeedback
                onPress={handlePasswordModelOpen}
            >
                <View style={styles.click}>
                    <Ionicons name="lock-closed" size={hp(2.5)} color={theme.text} />
                    <Text style={[styles.text, { color: theme.text }]}>Change password</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
                <View style={styles.click}>
                    <Ionicons name="key-sharp" size={hp(2.5)} color={theme.text} />
                    <Text style={[styles.text, { color: theme.text }]}>Change Pin</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>

        <Modal
            animationType='slide'
            transparent={false}
            visible={showPasswordModel}
            onRequestClose={handlePasswordModelClose}
        >
            <PasswordChange
                changePassword={changePassword}
                forgetPassword={forgetPassword}
                verifyOtpAndResetPassword={verifyOtpAndResetPassword}
                theme={theme}
                user={user}
                onClose={handlePasswordModelClose}
            />
        </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    secondContainer: {
        flex: 1,
        width: "100%",
        paddingTop: hp(4),
        paddingHorizontal: hp(2)
    },
    click: {
        padding: 10,
        width: "100%",
        flexDirection: "row",gap: hp(1.2),
        alignItems: "center",
        borderBottomColor: "#ccc",
        borderBottomWidth: hp(0.025),
        marginBottom: hp(2)
    },
    text: {
        fontSize: hp(2),
        fontFamily: "Roboto-Regular"
    }
  });
  