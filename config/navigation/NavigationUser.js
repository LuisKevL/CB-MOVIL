import React, { Component } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Admin from "../../modules/admin/adapters/screens/Admin";
import Agenda from "../../modules/admin/adapters/screens/Agenda";
import Profile from "../../modules/profile/adapters/screens/Profile";
import { Icon } from "@rneui/base";
import ViewCita from "../../modules/admin/adapters/screens/ViewCita";
import Productos from "../../modules/admin/adapters/screens/Productos";
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
        name="Citas"
        component={Agenda}
      />

      <Tab.Screen
        name="ViewCita"
        component={ViewCita}
      />

      <Tab.Screen 
        name= "Productos"
        component={Productos}
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
    case "Citas":
      iconName = "information";
      break;
    case "ViewCita":
      iconName = "information";
      break;
  }
  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
};