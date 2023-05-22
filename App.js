import { StyleSheet, Text, View } from 'react-native';
import Login from './modules/auth/adapters/screens/Login';
import Navigation from './config/navigation/Navigation';
import Cita from './modules/cita/adapters/screens/Cita';
import Profile from './modules/profile/adapters/screens/Profile';
import Productos from './modules/productos/adapters/screens/Productos';
import Registro from './modules/productos/adapters/screens/Registro';
export default function App() {
  return (
    <View style={styles.container}>
      <Login />
    </View>
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
