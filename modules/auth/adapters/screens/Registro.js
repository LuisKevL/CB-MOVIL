import React, { useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';
import Iconn from "react-native-vector-icons/MaterialIcons";

const Productos = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const [confirmPassword, setConfirmPassword] = useState('');


  const handleRegister = async () => {
    if (!name || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas deben coincidir.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Error',
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.'
      );
      return;
    }

    Alert.alert(
      'Confirmación de Registro',
      '¿Estás seguro de que deseas registrarte?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Registrarme',
          onPress: async () => {
            try {
              setIsLoading(true);

              const response = await Axios.post('http://192.168.0.232:8080/api-beautypalace/user/', {
                name,
                lastName,
                email,
                password,
              });

              console.log('Registro exitoso', response.data);
              const { data } = response.data;
              setIsLoggedIn(true);
              setUserData(data);
              navigation.navigate('loginStack');

              setIsLoading(false);
              Alert.alert('Registro exitoso', '¡Te has registrado correctamente!');
            } catch (error) {
              setIsLoading(false);
              console.error('Error al registrar:', error.message);
              Alert.alert('Error', 'Hubo un error al registrar el cliente.');
            }
          },
        },
      ]
    );
  };


  const isFormValid = name && lastName && email && password;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }} showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }}>
        <ImageBackground
          source={require('../../../../assets/registro.png')}
          style={{ height: Dimensions.get('window').height / 2.5 }}
        >
          <View style={styles.brandView}>
            <Text style={styles.brandViewText}></Text>
          </View>
        </ImageBackground>

        <View style={styles.bottomView}>
          {isLoading ? (
            <View style={styles.spinnerContainer}>
              <View style={styles.spinnerBox}>
                <ActivityIndicator size="large" color="blue" />
                <Text style={styles.spinnerText}>Registrando cliente...</Text>
              </View>
            </View>
          ) : (
            <View style={{ padding: 40 }}>
              <View style={{ marginTop: 5 }}>
                <View style={{ borderColor: "#4632A1" }}>
                  <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Nombre</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={(text) => setName(text)}
                      placeholder="Ingrese su nombre"
                    />
                  </View>
                </View>

                <View style={{ borderColor: "#4632A1", marginTop: 10 }}>
                  <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Apellidos</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={styles.input}
                      value={lastName}
                      onChangeText={(text) => setLastName(text)}
                      placeholder="Ingrese su apellido"
                    />
                  </View>
                </View>

                <View style={{ borderColor: "#4632A1", marginTop: 10 }}>
                  <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Correo Electrónico</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={styles.input}
                      value={email}
                      keyboardType="email-address"
                      onChangeText={(text) => setEmail(text)}
                      placeholder="Ingrese su correo electrónico"
                    />
                  </View>
                </View>

                <View style={{ borderColor: "#4632A1", marginTop: 10 }}>
                  <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Contraseña</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                      placeholder="Ingrese su contraseña"
                      secureTextEntry
                    />
                  </View>
                </View>

                <View style={{ borderColor: "#4632A1", marginTop: 10 }}>
                  <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Confirmar Contraseña</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={(text) => setConfirmPassword(text)}
                      placeholder="Confirme su contraseña"
                      secureTextEntry
                    />
                  </View>
                </View>


                <View
                  style={{
                    marginTop: 15,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: isFormValid ? "#2638EE" : "#999999" },
                    ]}
                    onPress={handleRegister}
                    disabled={!isFormValid}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        { color: isFormValid ? "white" : "#888888" },
                      ]}
                    >
                      Registrar Cliente
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        <View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Productos;


const styles = StyleSheet.create({
  brandView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandViewText: {
    color: "black",
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomView: {
    flex: 1,
    backgroundColor: "#ffffff",
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },
  button: {
    backgroundColor: "#4632A1",
    borderRadius: Dimensions.get("window").width / 2,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    marginTop: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00BFFF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  icon: {
    color: "white",
    fontSize: 20,
  },
  input: {
    padding: 6,
    borderWidth: 2,
    borderColor: "#8B4513",
    borderRadius: 5,
    width: 320,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerBox: {
    width: 200,
    height: 200,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0,
    shadowColor: "transparent",
  },
  spinnerText: {
    color: "#000",
  },
});
