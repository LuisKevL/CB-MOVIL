import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Button,
  Modal,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import Bienvenido from '../../../auth/adapters/screens/Bienvenido';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ name, lastName, email, id, handleLogout }) => {
  const navigation = useNavigation();

  const [isLoading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedLastName, setEditedLastName] = useState(lastName);
  const [editedEmail, setEditedEmail] = useState(email);
  const [password, setPassword] = useState(password);
  const [showWelcome, setShowWelcome] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 10000);
    fetchUserData();
    return () => clearTimeout(timer);
  }, []);


  const handleModifyData = async () => {
    try {
      const userName = await AsyncStorage.getItem('userName');
      const userLastName = await AsyncStorage.getItem('userLastName');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPassword = await AsyncStorage.getItem('userPassword');

      setEditedName(userName);
      setEditedLastName(userLastName);
      setEditedEmail(userEmail);
      setPassword(userPassword);

      setModalVisible(true);
    } catch (error) {
      console.log('Error al obtener los datos de AsyncStorage', error.message);
    }
  };

  const [names, setName] = useState('');
  const [lastNames, setLastName] = useState('');
  const [emails, setEmail] = useState('');
  const [passwords, setPasswords] = useState('');

  const getDataFromStorage = async () => {
    try {
      const keys = [
        'userId',
        'userName',
        'userLastName',
        'userEmail',
        'userPassword',
      ];
      const values = await AsyncStorage.multiGet(keys);
      const data = {};

      values.forEach(([key, value]) => {
        data[key] = value;
      });
      setName(data.userName);
      setLastName(data.userLastName);
      setEmail(data.userEmail);
      setPasswords(data.userPassword);
    } catch (error) {
      console.log('Error al obtener los datos de AsyncStorage:', error);
    }
  };

  useEffect(() => {
    getDataFromStorage();
    fetchUserData();
  }, []);


  const cambiaDatos = async () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de realizar los cambios?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              setLoading(true); 

              const userId = await AsyncStorage.getItem('userId');

              await Axios.put("http://192.168.0.232:8080/api-beautypalace/user/data/", {
                id: userId,
                name: editedName,
                lastName: editedLastName,
                email: editedEmail,
                password: password,
              });

              setEditedName(editedName);
              setEditedLastName(editedLastName);
              setEditedEmail(editedEmail);
              setPassword(password);
              console.log("Cambio de datos exitoso");
              fetchUserData();
              setModalVisible(false); 
              setLoading(false); 
            } catch (error) {
              console.log("Error al cambiar los datos", error.message);
            } finally {
              setLoading(false); 

            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const cerrar = async () => {
    try {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'loginStack' }],
        })
      );
    } catch (error) {
      console.log('Error al cerrar sesión', error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await Axios.get(`http://192.168.0.232:8080/api-beautypalace/user/${userId}`);
      const userData = response.data;

      setEditedName(userData.name);
      setEditedLastName(userData.lastName); 
      setEditedEmail(userData.email); 
      setPassword(userData.password); 
    } catch (error) {
      console.log('Error al obtener los datos del usuario:', error.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }} showsVerticalScrollIndicator={false}>
      {showWelcome ? (
        <Bienvenido navigation={navigation} />
      ) : (
        <View>
          <ImageBackground source={require('../../../../assets/perfil.jpg')} style={{ height: Dimensions.get('window').height / 2.5 }}>
            <View style={styles.brandView}>
              <Text style={styles.brandViewText}></Text>
            </View>
          </ImageBackground>
          <View style={styles.bottomView}>
            <View style={{ padding: 40 }}>
              <View style={{ marginTop: 1 }}>

                <View style={{ borderColor: "#4632A1" }}>
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={require('../../../../assets/iconoPerfil.png')} 
                      style={{ width: 90, height: 90 }}
                    />
                  </View>
                  <Text style={{
                    marginBottom: 5, textShadowColor: "black", textShadowRadius: 2, marginTop: 10, fontWeight: 'bold',
                  }}>Nombre:</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1 }}>{names}</Text>
                    <Icon name="user" style={{ color: "black" }} />
                  </View>
                </View>

                <View style={{ borderColor: '#4632A1', marginTop: 10 }}>
                  <Text style={{
                    marginBottom: 5, textShadowColor: "black", textShadowRadius: 2, fontWeight: 'bold',
                  }}>Apellidos:</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1 }}>{lastNames}</Text>
                    <Icon name="id-card" style={{ color: "black" }} />
                  </View>
                </View>

                <View style={{ borderColor: '#4632A1', marginTop: 10 }}>
                  <Text style={{
                    marginBottom: 5, textShadowColor: "black", textShadowRadius: 2, fontWeight: 'bold',
                  }}>Correo Electrónico:</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1 }}>{emails}</Text>
                    <Icon name="envelope" style={{ color: "black" }} />
                  </View>
                </View>

                <View style={{ marginTop: 15, height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                      backgroundColor: '#8B4513',
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      marginHorizontal: 5,
                      borderWidth: 1,
                      borderColor: '#8B4513',
                    }}
                    onPress={handleModifyData}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}
                    >
                      Modificar Datos
                    </Text>
                  </TouchableOpacity>
                  {/* BOTON CERRAR SESIÓN */}
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#8B4513',
                      borderRadius: 10,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      marginHorizontal: 5,
                      borderWidth: 1,
                      borderColor: '#8B4513',
                    }}
                    onPress={cerrar}
                  >
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Cerrar sesión</Text>
                  </TouchableOpacity>
                  {/* */}

                </View>
              </View>

            </View>

          </View>
        </View>
      )}

      {/* Modal para modificar datos */}
      {isModalVisible && (
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            {isLoading ? (
              <View style={styles.spinnerContainer}>
                <View style={styles.spinnerBox}>
                  <ActivityIndicator size="large" color="blue" />
                  <Text style={styles.spinnerText}>Modificando datos...</Text>
                </View>
              </View>
            ) : (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Modificar Datos</Text>
                <TextInput style={{ display: "none" }}>{id}</TextInput>
                <TextInput
                  placeholder="Ingrese su Nombre"
                  style={styles.modalInput}
                  value={editedName}
                  onChangeText={(text) => setEditedName(text)}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Ingrese sus Apellidos"
                  value={editedLastName}
                  onChangeText={(text) => setEditedLastName(text)}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Ingrese su Correo"
                  value={editedEmail}
                  onChangeText={(text) => setEditedEmail(text)}
                />

                <TextInput
                  style={styles.modalInput}
                  placeholder="Ingrese su nueva contraseña"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />

                <TouchableOpacity
                  style={{
                    borderRadius: 10,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    marginHorizontal: 5,
                    backgroundColor: "#8B4513",
                    marginBottom: 30,
                  }}
                  onPress={cambiaDatos}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 15,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Cambiar Datos
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>

        </Modal>
      )}
    </ScrollView>
  );

};

export default Profile;

const styles = StyleSheet.create({
  brandView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandViewText: {
    color: 'black',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomView: {
    flex: 1,
    backgroundColor: "#ffffff",
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },
  button: {
    backgroundColor: '#4632A1',
    borderRadius: Dimensions.get('window').width / 2,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginTop: 50
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BFFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    color: 'white',
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCloseText: {
    marginTop: 20,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalInput: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  texto: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 2,
  },
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo semi-transparente
  },
  spinnerBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  spinnerText: {
    color: "#000",
  },
});