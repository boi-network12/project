import { View, Text, TouchableWithoutFeedback, Image, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import Entypo from '@expo/vector-icons/Entypo';
import Constants from "expo-constants"

export default function ProfileList({router, theme, user}) {

    const pushToAccount = () => {
        router.push("account");
    }

    console.log("Constants.manifest.version:", Constants.manifest ? Constants.manifest.version : null);

  return (
    <ScrollView contentContainerStyle={[styles.container]} >
        <TouchableWithoutFeedback>
            <View style={[styles.profileAccount, { backgroundColor: theme.clickBackGround }]}>
                <Image
                    source={user?.profilePicture ? { uri: user.profilePicture } : require("../assets/images/profilePic.png")}
                    style={[styles.img, { borderColor: theme.primaryBtn }]}
                />
                <View style={styles.textContainer}>
                    <Text
                        style={[styles.textBold, { color: theme.text }]}
                    >{`${user?.firstName} ${user?.lastName}`}</Text>
                    <Text
                        style={[styles.textTin, { color: theme.text }]}
                    >{user?.email}</Text>
                    <Text
                        style={[styles.textTin, { color: theme.text }]}
                    >{`Account Number - ${user?.accountNumber}`}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
        <Text style={[styles.textBold, { color: theme.text }]}>Account</Text>
        <View style={[styles.downContainer, { backgroundColor: theme.clickBackGround }]}>
            
            <TouchableWithoutFeedback onPress={pushToAccount}>
                <View style={styles.click}>
                <Text style={[styles.textTin, { color: theme.text }]}>Account Details</Text>
                <Entypo name='chevron-right' size={hp(3)} color={theme.text}/>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
                <View style={styles.click}>
                <Text style={[styles.textTin, { color: theme.text }]}>Security</Text>
                <Entypo name='chevron-right' size={hp(3)} color={theme.text}/>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
                <View style={styles.click}>
                <Text style={[styles.textTin, { color: theme.text }]}>Statements & Reports </Text>
                <Entypo name='chevron-right' size={hp(3)} color={theme.text}/>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
                <View style={styles.click}>
                <Text style={[styles.textTin, { color: theme.text }]}>Account Limits </Text>
                <Entypo name='chevron-right' size={hp(3)} color={theme.text}/>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
                <View style={styles.click}>
                <Text style={[styles.textTin, { color: theme.text }]}>Saved Cards </Text>
                <Entypo name='chevron-right' size={hp(3)} color={theme.text}/>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
                <View style={styles.click}>
                <Text style={[styles.textTin, { color: theme.text }]}>Lived Chat </Text>
                <Entypo name='chevron-right' size={hp(3)} color={theme.text}/>
                </View>
            </TouchableWithoutFeedback>


        </View>
        <View style={{
            width: "100%",
            alignItems: "center",
            gap: hp(2),
            flexDirection: "column",marginTop: hp(2)
        }}>
            <Text style={
                {
                    fontSize: hp(1.5),
                    color: theme.text,
                    fontFamily: "Roboto-Regular"
                }
            }>Version: {Constants.manifest && Constants.manifest.version ? Constants.manifest.version : "Unknown"}</Text>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container : {
        width: "100%",
        paddingHorizontal: hp(3),
        paddingTop: hp(2),
        flexGrow: 1
    }, 
    profileAccount: {
        width: "100%",
        height: hp(15),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: hp(1),
        marginBottom: hp(2)
    },
    img: {
        height: hp(12),
        width: hp(12),
        borderRadius: hp(6),
        borderWidth: hp(0.3),
        padding: hp(0.7)
    },
    textContainer: {
        width: "65%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        gap: hp(1.5),
        paddingLeft: hp(1)
    },
    textBold: {
        fontFamily: "Roboto-Bold",
        fontSize: hp("2.3rem")
    },
    textTin: {
        fontFamily: "Roboto-Regular",
        fontSize: hp("2rem")
    },
    downContainer: {
        width: "100%",
        marginTop: hp(3),
        borderRadius: hp(0.5)
    },
    click: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "97%",
        padding: hp(2),
    }
}) 