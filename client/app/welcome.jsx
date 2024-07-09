import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import Bank3d from "../assets/images/bank3d.png"
import CUstomerCareImg from "../assets/images/customerCare3d.png"
import Budget3d from "../assets/images/budget3d.png"
import { useRouter } from "expo-router"
import { heightPercentageToDP as hp , widthPercentageToDP as wp} from "react-native-responsive-screen"


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
    router.push("signup")
  }

  const login = () => {
    router.push("login")
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageText.length);
    }, 10000);

    return () => clearInterval(interval);
  },[]);


  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <View>
        <Image source={imageText[currentIndex].image} style={styles.image} />
        <Text style={[styles.text, {color: theme.text, }]}>
          {imageText[currentIndex].text}
        </Text>
      </View>
      <TouchableOpacity onPress={login}>
        <Text>Login</Text>
      </TouchableOpacity>
      <Text>
        Don't have an account ? 
        <TouchableOpacity onPress={signUp}>
          <Text>SignUp</Text>
        </TouchableOpacity>
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    marginTop: 20,
    fontSize: hp(3.5),
    textAlign: 'center',
  }

})