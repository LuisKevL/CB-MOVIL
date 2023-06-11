import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from '../../modules/profile/adapters/screens/Profile'
const Stack = createNativeStackNavigator();
export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        initialRouteName:"profileStack",
        headerMode: 'screen',
        headerTintColor: 'white',
        headerStyle: { backgroundColor: '#ff5a60' },
      }}
    >
       <Stack.Screen
        name='profileStack'
        options={{title: 'Perfil'}}
        component={Profile}
        />
    
        
    </Stack.Navigator>
  );
}