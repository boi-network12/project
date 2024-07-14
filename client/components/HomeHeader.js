import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ThemeContext } from '../context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from "expo-router"

export default function HomeHeader({ user }) {
  const theme = useContext(ThemeContext);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const router = useRouter()

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const copyToClipboard = () => {
    Clipboard.setString(user?.accountNumber || '');
  };

  const account = () => {
    router.push("account")
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryBtn }]}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={account}>
            <Image
              source={user?.profilePicture ? { uri: user.profilePicture } : require("../assets/images/profilePic.png")}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={{
            color: theme.dashBoardColorText, 
            fontFamily: "Roboto-Regular",
            fontWeight: "300",
            fontSize: hp("2rem")
            }} >Hello {user?.firstName || 'user'}</Text>

          <TouchableOpacity style={[styles.notBtn, { backgroundColor: theme.btnTab}]} >
            <MaterialCommunityIcons name="bell-badge-outline" size={hp(3.5)} color={theme.primaryBtn} />
          </TouchableOpacity>
        </View>
        <View style={styles.balanceSectionText} >
          <Text style={{
            color: theme.dashBoardColorText, 
            fontFamily: "Roboto-Regular",
            fontWeight: "300",
            fontSize: hp("2rem")
            }} >Main Balance:</Text>
            <View style={styles.balanceSection} >
              <View style={[styles.bAmount, { 
                justifyContent: "flex-start" 
                }]}>
                <Text style={{
                  color: theme.dashBoardColorText,
                  fontFamily: "Roboto-Bold",
                  fontSize: hp("3.5rem")
                }}>
                  {isBalanceVisible ? `₦ ${user?.balance || 0.00}` : '****'}
                </Text>
                <TouchableOpacity onPress={toggleBalanceVisibility}>
                  <FontAwesome6 name={isBalanceVisible ? "eye-slash" : "eye"} size={hp(2.2)} color={theme.dashBoardColorText} />
                </TouchableOpacity>
              </View>
              <View style={[styles.bAmount, { 
                  justifyContent: "flex-end" ,
                }]}>
                <Text style={{
                  fontFamily: "Roboto-Regular",
                  color: theme.dashBoardColorText,
                  fontSize: hp("2.4rem")
                }} >{user?.accountNumber}</Text>
                <TouchableOpacity onPress={copyToClipboard}>
                  <Ionicons name="copy-outline" size={hp(2.2)} color={theme.dashBoardColorText}/>
                </TouchableOpacity>
              </View>
            </View>
        </View>
        <View style={styles.icons} >
          <TouchableOpacity style={styles.tIcon} >
              <Feather name="send" size={hp(3.1)} color={theme.dashBoardColorText}/>
              <Text style={{
                color: theme.dashBoardColorText,
                fontFamily: "Roboto-Regular",
                  fontSize: hp("2rem")
                }} >Other Banks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tIcon}>
              <MaterialIcons name="compare-arrows" size={hp(3.3)} color={theme.dashBoardColorText}/>
              <Text style={{
                color: theme.dashBoardColorText,
                fontFamily: "Roboto-Regular",
                  fontSize: hp("2.2rem")
                }}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tIcon}>
              <MaterialIcons name="add-card" size={hp(3.2)} color={theme.dashBoardColorText}/>
              <Text style={{
                color: theme.dashBoardColorText,
                fontFamily: "Roboto-Regular",
                  fontSize: hp("2.1rem")
                }}>Request</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: hp(40),
    paddingTop: hp(3.8)
  },
  safeArea: {
    padding: 15,
    alignItems: 'center',
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  profileContainer: {
    alignItems: 'center',
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(5)
  },
  profileImage: {
    width: hp(4),
    height: hp(4),
    borderRadius: 50,
    objectFit: "cover"
  },
  notBtn: {
    borderRadius: hp(2),
    padding: hp(0.3)
  },
  balanceSectionText: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: hp(1),
    gap: hp(2),
    marginBottom: hp(4)
  },
  balanceSection: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: hp(1.5),
    justifyContent: 'space-between',
    gap: hp(0.5)
  },
  bAmount: {
    flexDirection: "row",
    alignItems: "center",
    gap: hp(2),
    width: "50%",
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: 'space-between',
    paddingHorizontal: hp(3)
  },
  tIcon: {
    flexDirection: "column",
    alignItems: "center",
    gap: hp(0.3)
  }

});
