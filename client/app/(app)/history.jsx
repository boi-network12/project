import { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

export default function History() {
  const theme = useContext(ThemeContext);


  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Text style={[styles.text, {color: theme.text}]}>History</Text>
    </View>
  )
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
