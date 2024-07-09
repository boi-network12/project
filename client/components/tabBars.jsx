import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from "@expo/vector-icons/Entypo";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const TabBars = ({ state, descriptors, navigation }) => {
  const colorActive = '#673ab7';
  const colorNotActive = '#333';

  const icons = {
    index: (props) => <Feather name="home" size={20} color={colorActive} {...props} />,

    status: (props) => <MaterialCommunityIcons name="camera-timer" size={20} color={colorActive} {...props} />,

    explore: (props) => <AntDesign name="smileo" size={20} color={colorActive} {...props} />,
    
    profile: (props) => <FontAwesome name="user-circle-o" size={20} color={colorActive} {...props} />,
  };

  return (
    <View style={styles.tabBars}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = 
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (['_sitemap', 'not-found'].includes(route.name)) return null;

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

        // Logging route names and checking if the icon exists
        console.log(`Rendering tab for route: ${route.name}`);
        const IconComponent = icons[route.name];
        if (!IconComponent) {
          console.error(`No icon defined for route: ${route.name}`);
          return null;
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
            <Text style={{ 
              color: isFocused ? colorActive : colorNotActive,
              fontSize: 14
            }}>
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
    bottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#fff",
    marginHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 15,
    borderCurve: 'continuous',
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    gap: 4
  }
});

export default TabBars;