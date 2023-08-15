import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../modules/auth/adapters/screens/Login";
import Registro from "../../modules/auth/adapters/screens/Registro";
import NavigationUser from "../navigation/NavigationUser";
import NavigationClient from "../navigation/NavigationClient";
const Stack = createNativeStackNavigator();

export default function LoginStack() {
  return (
    <Stack.Navigator >
      <Stack.Screen
        name='loginStack'
        options={{ title: 'Inicio de sesión' }}
        component={Login}
      />


      <Stack.Screen
        name='Registro'
        options={{ title: 'Registro Stack' }}
        component={Registro}
      />

      <Stack.Screen
        name='Admin'
        component={NavigationUser}
        options={title = { title: 'Admin' }}
      />
      <Stack.Screen
        name='Client'
        component={NavigationClient}
        options={title = { title: 'Client' }}

      />
    </Stack.Navigator>
  )
}

