import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Axios from 'axios';

const Productos = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleRegister = async () => {
    try {
      const response = await Axios.post('http://192.168.0.232:8080/api-beautypalace/user/', {
        name,
        lastName,
        email,
        password,
      });
      console.log('Registro exitoso');

      const { data } = response.data;
      setIsLoggedIn(true);
      setUserData(data);
    } catch (error) {
      console.error('Error al registrar:', error.message);
    }
  };

  return (
    <View>
      {!isLoggedIn ? (
        <>
          <Text>Nombre:</Text>
          <TextInput
            value={name}
            onChangeText={text => setName(text)}
            placeholder="Ingrese su nombre"
          />

          <Text>Apellido:</Text>
          <TextInput
            value={lastName}
            onChangeText={text => setLastName(text)}
            placeholder="Ingrese su apellido"
          />

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

          <TouchableOpacity onPress={handleRegister}>
            <Text>Registrarse</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <Text>Bienvenido</Text>
          {userData && (
            <>
              <Text>Nombre: {userData.name}</Text>
              <Text>Correo: {userData.email}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default Productos;
