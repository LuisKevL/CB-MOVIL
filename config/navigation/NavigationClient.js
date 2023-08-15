import React, { Component } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Admin from "../../modules/admin/adapters/screens/Admin";
import Cita from "../../modules/cita/adapters/screens/Cita";
import Profile from "../../modules/profile/adapters/screens/Profile";
import { Icon } from "@rneui/base";
import ViewCita from "../../modules/admin/adapters/screens/ViewCita";
import CitasClient from "../../modules/profile/adapters/screens/CitasClient";
import ProductosClient from "../../modules/profile/adapters/screens/ProductosClient"
import PreguntasFrec from "../../modules/profile/adapters/screens/PreguntasFrec";
import Consejos from "../../modules/profile/adapters/screens/Consejos";
const Tab = createBottomTabNavigator();

export default function NavigationClient() {
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
        name="Agenda"
        component={CitasClient}
      />

      <Tab.Screen
        name="Productos"
        component={ProductosClient}
      />

      <Tab.Screen
        name="Preguntas"
        component={PreguntasFrec}
      />

      <Tab.Screen
        name="Consejos"
        component={Consejos}
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
      iconName = "calendar-clock";
      break;
    case "Agenda":
      iconName = "calendar";
      break;
    case "Productos":
      iconName = "package";
      break;
    case "Preguntas":
      iconName = "comment-question";
      break;
    case "Consejos":
      iconName = "lightbulb-on";
      break;
  }
  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
};