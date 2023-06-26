import React, { Component } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Admin from "../../modules/admin/adapters/screens/Admin";
import Cita from "../../modules/cita/adapters/screens/Cita";
import Profile from "../../modules/profile/adapters/screens/Profile";
import { Icon } from "@rneui/base";
import ViewCita from "../../modules/admin/adapters/screens/ViewCita";
import CitasClient from "../../modules/profile/adapters/screens/CitasClient";
const Tab = createBottomTabNavigator();

export default function NavigationUser() {
  return (
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
        name="Profile"
        component={Profile}
      />

      <Tab.Screen
        name="Cita"
        component={Cita}
      />


<Tab.Screen
        name="CitasClient"
        component={CitasClient}
      />

    </Tab.Navigator>
  )
}

const screenOptions = (route, color) => {
  let iconName;
  switch (route.name) {
    case "Profile":
      iconName = "account";
      break;
    case "Cita":
      iconName = "information";
      break;
    case "CitasClient":
      iconName = "information";
      break;
  }
  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
};