import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Modal } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { useAlert } from '../context/AlertContext'
import ForgetPassword from './ForgetPassword'



export default function PasswordChange({ changePassword, forgetPassword, verifyOtpAndResetPassword, theme, user, onClose }) {
    const [loading, setLoading] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const { showAlert } = useAlert();
    const [showForgetPasswordModel, setShowForgetPasswordModel] = useState(false)

    const handleForgetPasswordOpen = () => {
        setShowForgetPasswordModel(true)
    }

    const handleForgetPasswordClose = () => {
        setShowForgetPasswordModel(false)
    }

    const handleChangePassword = async () => {
        setLoading(true)
        try {
            await changePassword(oldPassword, newPassword)
            showAlert(
                'success',
                'Success',
                'Password Changed'
            )
            setLoading(false)
        } catch (error) {
            alert(error.message)
            console.error(error.message)
        }
    }



  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} >
       <View style={[styles.header, ]} >
        <TouchableOpacity
            onPress={onClose}
        >
        <MaterialIcons name='keyboard-backspace' size={hp(3)} color={theme.text}/>
        </TouchableOpacity>
        <Text style={[styles.text, { color: theme.text }]} >change password</Text>
       </View>

        <View style={styles.form}>
            <>
                <Text style={[styles.label, { color: theme.text }]} >old password</Text>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                    placeholderTextColor={theme.clickBackGround}
                    placeholder='Input your old password'
                    value={oldPassword}
                    onChangeText={setOldPassword}
                />
            </>
            <>
                <Text style={[styles.label, { color: theme.text }]} >New password</Text>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                    placeholderTextColor={theme.clickBackGround}
                    placeholder='Set New password'
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
            </>
            <TouchableOpacity
                onPress={handleForgetPasswordOpen}
            >
                <Text style={[styles.label, { color: theme.text }]} >Forget Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={handleChangePassword}
            style={[styles.btn, { backgroundColor: theme.primaryBtn }]}>
                {loading ? (
                    <Text style={[styles.label, { color: "#f2f2f2" }]} >
                        Loading...
                    </Text>
                ) : (
                    <Text style={[styles.label, { color: "#f2f2f2" }]} >
                        Save Changes
                    </Text>
                )}
            </TouchableOpacity>
        </View>

        <Modal
            animationType='slide'
            transparent={false}
            visible={showForgetPasswordModel}
            onRequestClose={handleForgetPasswordClose}
        >
            <ForgetPassword
                forgetPassword={forgetPassword}
                verifyOtpAndResetPassword={verifyOtpAndResetPassword}
                theme={theme}
                user={user}
                onClose={handleForgetPasswordClose}
            />
        </Modal>
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