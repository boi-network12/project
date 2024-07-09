import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Tabs, useRouter } from "expo-router"
import TabBars from '../../components/tabBars';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function _layout() {
  const router = useRouter();

  


  return (
    <Tabs tabBar={props => <TabBars {...props}/>}>
      <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <FontAwesome size={20} name="home" />,
          }}
      />
    </Tabs>
  )
};