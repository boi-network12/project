import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const TabBars = ({ state, descriptors, navigation }) => {
  const theme = useContext(ThemeContext);
  const colorActive = theme.primaryBtn;
  const colorNotActive = theme.text;

  const icons = {
    home: (props) => <Feather name="home" size={20} color={colorActive} {...props} />,
    card: (props) => <FontAwesome6 name="credit-card" size={20} color={colorActive} {...props} />,
    history: (props) => <MaterialIcons name="history" size={20} color={colorActive} {...props} />,
    bills: (props) => <MaterialIcons name="receipt-long" size={20} color={colorActive} {...props} />,
    profile: (props) => <FontAwesome name="user-circle-o" size={20} color={colorActive} {...props} />,
  };

  // Determine if the current screen has an icon
  const hasIcon = (route) => {
    return icons[route.name];
  };

  // Get the current route
  const currentRoute = state.routes[state.index];

  return (
    <View style={[styles.tabBars, { backgroundColor: theme.btnTab }]}>
      {/* Render tabs only if the current screen has an icon */}
      {hasIcon(currentRoute) && state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const IconComponent = icons[route.name];
        if (!IconComponent) {
          return null;  // Skip rendering this tab item
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabBarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <IconComponent color={isFocused ? colorActive : colorNotActive} />
            <Text style={{ color: isFocused ? colorActive : colorNotActive, fontSize: 14 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBars: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderCurve: 'continuous',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 20,
    zIndex: 999
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    gap: 4
  }
});

export default TabBars;
