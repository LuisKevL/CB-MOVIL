import React, { useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
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

  const navigation = useNavigation();

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

  const isFormValid = name && lastName && email && password;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }} showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }}>
        <ImageBackground
          source={require('../../../../assets/fondo.jpg')}
          style={{ height: Dimensions.get('window').height / 2.5 }}
        >
          <View style={styles.brandView}>
            <Iconn name="spa" size={24} color="black" style={{ fontSize: 100 }} />
            <Text style={styles.brandViewText}>Registro</Text>
          </View>
        </ImageBackground>

        <View style={styles.bottomView}>
          <View style={{ padding: 40 }}>
            <View style={{ marginTop: 30 }}>
              <View style={{ borderColor: "#4632A1" }}>
                <Text style={{ marginBottom: 5 }}>Nombre</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    value={name}
                    onChangeText={(text) => setName(text)}
                    placeholder="Ingrese su nombre"
                  />
                </View>
              </View>

              <View style={{ borderColor: "#4632A1", marginTop: 10 }}>
                <Text style={{ marginBottom: 5 }}>Apellidos</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    value={lastName}
                    onChangeText={(text) => setLastName(text)}
                    placeholder="Ingrese su apellido"
                  />
                </View>
              </View>

              <View style={{ borderColor: "#4632A1", marginTop: 10 }}>
                <Text style={{ marginBottom: 5 }}>Email</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    value={email}
                    keyboardType="email-address"
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Ingrese su correo electrónico"
                  />
                </View>
              </View>

              <View style={{ borderColor: "#4632A1", marginTop: 10 }}>
                <Text style={{ marginBottom: 5 }}>Contraseña</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholder="Ingrese su contraseña"
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
});
