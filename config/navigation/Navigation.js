import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/base";

import LoginStack from "../stack/LoginStack";
import Registro from "../../modules/auth/adapters/screens/Registro";
import Login from "../../modules/auth/adapters/screens/Login";
const Tab = createBottomTabNavigator();
export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Login"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => screenOptions(route, color),
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Login"
          options={{ title: 'Login' }}
          component={Login}
        />

        <Tab.Screen
          name="Registro"
          options={{ title: 'Registro' }}
          component={Registro}
        />
        
      </Tab.Navigator>
    </NavigationContainer>
  )
}
const screenOptions = (route, color) => {
  let iconName;
  switch (route.name) {
    case "Login":
      iconName = "account";
      break;
    case "Registro":
      iconName = "information";
      break;
  }
  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
};