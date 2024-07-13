import { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import HomeBottomSheet from '../../components/HomeBottomSheet';
import HomeHeader from '../../components/HomeHeader';

export default function Home() {
  const theme = useContext(ThemeContext);
  const { user } = useAuth()


  return (
    <View style={[styles.container]}>
      <HomeHeader user={user}/>
      <HomeBottomSheet
        theme={theme}
        user={user}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {

  }
});
