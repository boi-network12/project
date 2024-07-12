import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Entypo from '@expo/vector-icons/Entypo';

export default function AccountMail({ user, theme, onClose, changeEmail }) {
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEmailTyped, setIsEmailTyped] = useState(false);

    

    const handleEmailChange = (text) => {
        setNewEmail(text);
        setIsEmailTyped(text.length > 0);
    };

    const handleSubmit = async () => {
        if (!newEmail || !password) {
            alert('Please fill in both fields');
            return;
        }
    
        setLoading(true);
    
        try {
            await changeEmail(newEmail, password);  
            alert('Email changed successfully');
            onClose();  
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]} >
            <View style={styles.navbar} >
                <TouchableOpacity onPress={onClose} >
                    <Entypo name="chevron-left" size={hp(5)} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.textHeader, { color: theme.text }]} >Change Your Mail</Text>
                <View></View>
            </View>
            <View style={styles.secondDiv}>
                <View style={[styles.form, {}]} >
                    <TextInput
                        style={[styles.input, { color: theme.text, backgroundColor: theme.btnTab }]}
                        value={newEmail}  // Update to use newEmail
                        onChangeText={handleEmailChange}
                        placeholderTextColor="#444"
                        placeholder={user?.email}
                    />
                    {isEmailTyped && (
                        <>
                            <TextInput
                                style={[styles.input, { color: theme.text, backgroundColor: theme.btnTab }]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder='Confirm Your Password'
                                placeholderTextColor="#444"
                                secureTextEntry
                            />
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: theme.primaryBtn }]}
                                onPress={handleSubmit}  // Call handleSubmit on press
                            >
                                {loading ? (
                                    <Text style={{
                                        fontSize: hp("2rem"),
                                        color: theme.text,
                                        fontFamily: "Roboto-Regular"
                                    }}>Loading...</Text>
                                ) : (
                                    <Text style={{
                                        fontSize: hp("2rem"),
                                        color: theme.text,
                                        fontFamily: "Roboto-Regular"
                                    }}>Submit</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                <TouchableOpacity>
                    <Text style={[styles.text, { color: theme.text, fontFamily: "Roboto-Regular" }]} >Forgot Password?</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        width: "100%",
        height: "100%",
    },
    navbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: hp(2),
        paddingVertical: hp(1.5),
        shadowColor: '#444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
        position: "fixed",
        left: 0,
        top: 0
    },
    textHeader: {
        fontFamily: "Roboto-Regular",
        fontWeight: "500"
    },
    secondDiv: {
        width: "100%",
        height: "100%",
        paddingHorizontal: hp(2.5),
    },
    form: {
        paddingVertical: hp(4),
        paddingHorizontal: hp(1.5),
        borderRadius: hp(1),
    },
    input: {
        width: "100%",
        height: hp(6),
        marginBottom: hp(2.5),
        padding: hp(1),
        borderRadius: hp(0.4),
        fontFamily: "Roboto-Regular"
    },
    btn: {
        width: "90%",
        alignSelf: 'center',
        height: hp(6),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: hp(1),
    }
})
