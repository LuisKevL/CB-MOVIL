import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../modules/auth/adapters/screens/Login";
import Registro from "../../modules/auth/adapters/screens/Registro";
const Stack = createNativeStackNavigator();

export default function LoginStack() {
  return (
    <Stack.Navigator
  >
      <Stack.Screen
      name='loginStack'
      options={{title: 'Inicio de sesión'}}
      component={Login}
      />

<Stack.Screen
      name='registroStack'
      options={{title: 'Inicio de sesión'}}
      component={Registro}
      />

      
  </Stack.Navigator>
  )
}