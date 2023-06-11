import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Admin from "../../modules/admin/adapters/screens/Admin";
const Stack = createNativeStackNavigator();

export default function AdminStack() {
    return (
        <Stack.Navigator
        >
            <Stack.Screen
                name='adminStack'
                options={{ title: 'Inicio de sesión' }}
                component={Admin}
            />


        </Stack.Navigator>
    )
}