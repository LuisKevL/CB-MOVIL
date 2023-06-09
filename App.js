import { StyleSheet, Text, View } from 'react-native';
import Login from './modules/auth/adapters/screens/Login';
import Navigation from './config/navigation/Navigation';
import Cita from './modules/cita/adapters/screens/Cita';
import Profile from './modules/profile/adapters/screens/Profile';
import Productos from './modules/productos/adapters/screens/Productos';
import Registro from './modules/auth/adapters/screens/Registro';
import LoginStack from './config/stack/LoginStack';
import Contraseña from './modules/auth/adapters/screens/Contraseña';
import Token from './modules/auth/adapters/screens/Token';
import { NavigationContainer } from '@react-navigation/native';
export default function App() {
  return (
    <NavigationContainer>
      <LoginStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
