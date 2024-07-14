import { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import ProfileList from '../../components/ProfileList';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from "expo-router"

export default function Profile() {
  const theme = useContext(ThemeContext);
  const { user } = useAuth();
  const router = useRouter();


  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <ProfileList
        theme={theme}
        user={user}
        router={router}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: "100%"
  },
});
