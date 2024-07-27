import React, { useContext } from 'react';
import Lottie from 'lottie-react-native';
import { View, StyleSheet, Text } from 'react-native';
import animationData from '../assets/animation/tick.json'; 
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { ThemeContext } from '../context/ThemeContext';

const LottieAnimation = () => {
  const theme = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Lottie
        source={animationData}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={[styles.text, {color: theme.text}]} >Transaction confirm</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%"
  },
  lottie: {
    width: hp(15),
    height: hp(15),
  },
  text: {
    fontSize: hp(2),
    fontFamily: "Roboto-Bold",
    textTransform: "capitalize",
    
  }
});

export default LottieAnimation;
