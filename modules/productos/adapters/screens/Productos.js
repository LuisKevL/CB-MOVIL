import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Axios from 'axios';

const Productos = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userData, setUserData] = useState(null); 

  const handleLogin = async () => {
    try {
      const response = await Axios.get('http://192.168.0.232:8080/api-beautypalace/user/clients/', { email, password });
      console.log('Inicio de sesión exitoso');

      const { data } = response.data;
      const user = data.find(user => user.email === email);

      if (user) {
        setIsLoggedIn(true);
        setUserData(user);
      } else {
        console.error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
    }
  };

  return (
    <View>
      {!isLoggedIn ? (
        <>
          <Text>Email:</Text>
          <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="Ingrese su correo electrónico"
          />

          <Text>Contraseña:</Text>
          <TextInput
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder="Ingrese su contraseña"
            secureTextEntry
          />

          <TouchableOpacity onPress={handleLogin}>
            <Text>Iniciar sesión</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <Text>Bienvenido</Text>
          {userData && (
            <>
              <Text>Nombre: {userData.name}</Text>
              <Text>Correo: {userData.email}</Text>
              <Text>Apellidos: {userData.lastName}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default Productos;
