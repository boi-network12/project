import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Clipboard from 'expo-clipboard';

export default function Account() {
  const theme = useContext(ThemeContext)
  const { user, logout, deleteUser } = useAuth()

  
  const scaleAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (user?.kycVerified) {
      
      Animated.spring(scaleAnim, {
        toValue: 1.2, 
        friction: 2, 
        tension: 100, 
        useNativeDriver: true
      }).start()
    } else {
      
      scaleAnim.setValue(0)
    }
  }, [user?.kycVerified])

  const copyToClipboard = () => {
    Clipboard.setString(user?.accountNumber || '');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={user?.profilePicture ? { uri: user.profilePicture } : require("../../assets/images/profilePic.png")}
        style={styles.profile}
      />
      <View style={styles.displayNameContainer}>
        <Text style={[styles.Displayname, { color: theme.text }]}>
          {`${user?.lastName} ${user?.firstName} ${user?.otherName} `}
        </Text>
        {user && user?.kycVerified === true ? (
          <Animated.View style={[styles.badgeContainer, { transform: [{ scale: scaleAnim }] }]}>
            <MaterialCommunityIcons name="check-decagram" size={20} color={theme.primaryBtn} />
          </Animated.View>
        ) : null}
      </View>
      <View style={styles.list}>
        <TouchableOpacity 
        onPress={copyToClipboard}
        style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: theme.text }]}>{user?.accountNumber}</Text>
            <Ionicons name="copy" size={20} color={theme.primaryBtn} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: theme.text }]}>{user?.phoneNumber}</Text>
            <Feather name="chevron-right" size={20} color={theme.primaryBtn} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: theme.text }]}>{user?.email}</Text>
          <Feather name="chevron-right" size={20} color={theme.primaryBtn} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          {user && user?.kycVerified ? (
            <Text style={[styles.Displayname, { color: theme.text }]}>Verification Complete</Text>
          ) : (
            <Text style={[styles.Displayname, { color: theme.text }]}>Not Verified</Text>
          )}
          {user && user.kycVerified ? (
            <MaterialCommunityIcons name="check-decagram" size={20} color={theme.primaryBtn} />
          ) : (
            <MaterialCommunityIcons name="alert-circle" size={20} color="#ff5c5c" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: theme.text }]}>{user?.NextOfKin || "Don't have"}</Text>
          <Feather name="chevron-right" size={20} color={theme.primaryBtn} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: theme.text }]}>{user?.status || "Null"}</Text>
          <Feather name="chevron-right" size={20} color={theme.primaryBtn} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: "#ff5c5c" }]}>
            Delete Account
          </Text>
          <FontAwesome name="trash-o" size={20} color="#ff5c5c" />
        </TouchableOpacity>

        <TouchableOpacity 
        onPress={logout}
        style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: "#ff5c5c" }]}>
            Log out
          </Text>
          <MaterialIcons name="exit-to-app" size={20} color="#ff5c5c" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: "100%",
    paddingTop: hp(5)
  },
  text: {},
  profile: {
    width: hp(18),
    height: hp(18),
    objectFit: "cover",
    borderRadius: hp(9),
  },
  displayNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
  },
  Displayname: {
    fontFamily: "Roboto-Bold"
  },
  badgeContainer: {
    marginLeft: hp(1), // Space between the display name and the badge
  },
  badge: {
    width: hp(3), // Adjust size as needed
    height: hp(3),
  },
  list: {
    width: "100%",
    paddingHorizontal: hp(2),
    marginTop: hp(4),
    flexDirection: "column",
    alignItems: "flex-start",
    gap: hp(1)
  },
  clickTouch: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: hp(2),
    alignItems: "center",
    justifyContent: "space-between",
    height: hp(7)
  }
});
