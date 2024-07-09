import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import Bank3d from "../assets/images/bank3d.png"
import CUstomerCareImg from "../assets/images/customerCare3d.png"
import Budget3d from "../assets/images/budget3d.png"
import { useRouter } from "expo-router"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"

const imageText = [
  {
    id: 1,
    image: Bank3d,
    text: "Welcome to your Freedom",
  },
  {
    id: 2,
    image: CUstomerCareImg,
    text: "We are fast in reply",
  },
  {
    id: 3,
    image: Budget3d,
    text: "Make your saves at huge range",
  },
]

export default function Welcome() {
  const theme = useContext(ThemeContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const signUp = () => {
    router.push("/signup")
  }

  const login = () => {
    router.push("/login")
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageText.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.imageContainer}>
        <Image source={imageText[currentIndex].image} style={styles.image} />
        <Text style={[styles.text, { color: theme.text }]}>
          {imageText[currentIndex].text}
        </Text>
        <View style={styles.indicatorContainer}>
          {imageText.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                { backgroundColor: index === currentIndex ? theme.primaryBtn : '#ccc' }
              ]}
            />
          ))}
        </View>
      </View>
      <TouchableOpacity onPress={login} style={[styles.btn, styles.shadow, { backgroundColor: theme.primaryBtn }]}>
        <Text style={[styles.btnText, { fontFamily: "Roboto-Regular" }]}>Login</Text>
      </TouchableOpacity>
      <View style={styles.signUpContainer}>
        <Text style={[styles.alrText, { fontFamily: "Roboto-Regular", color: theme.text }]}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={signUp}>
          <Text style={[styles.textA, { fontFamily: "Roboto-Bold" }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(10),
  },
  image: {
    width: wp(70),
    height: wp(70),
    resizeMode: 'contain',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    marginTop: hp(3),
    fontSize: hp(3.5),
    textAlign: 'center',
    fontFamily: "Roboto-Bold",
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: hp(2),
  },
  indicator: {
    width: wp(5),
    height: hp(0.5),
    marginHorizontal: wp(1),
    borderRadius: hp(0.25),
  },
  btn: {
    width: wp(80),
    height: hp(7),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(1),
    marginVertical: hp(2),
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnText: {
    color: "#f2f2f2",
    fontSize: hp(2.5),
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
  },
  alrText: {
    fontSize: hp(2),
  },
  textA: {
    color: "#402E7A",
    fontSize: hp(2.4),
    fontWeight: "600",
    marginLeft: hp(1),
  },
})
