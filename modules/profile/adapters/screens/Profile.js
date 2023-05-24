import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Dimensions, Button, Modal, Alert, ActivityIndicator } from 'react-native';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Axios from 'axios';
const Profile = ({ name, lastName, email, id, handleLogout }) => {
  const [isLoading, setLoading] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedLastName, setEditedLastName] = useState(lastName);
  const [editedEmail, setEditedEmail] = useState(email);

  const handleModifyData = () => {
    setModalVisible(true);
  };




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
              setLoading(true); // Mostrar el spinner de carga

              await Axios.put("http://192.168.0.232:8080/api-beautypalace/user/data/", {
                id,
                name: editedName,
                lastName: editedLastName,
                email: editedEmail,
              });

              // Actualizar los estados name, lastName y email si es necesario
              setEditedName(editedName);
              setEditedLastName(editedLastName);
              setEditedEmail(editedEmail);
              console.log("Cambio de datos exitoso");
              setModalVisible(false); // Cerrar el modal

            } catch (error) {
              console.log("Error al cambiar los datos", error.message);
            } finally {
              setLoading(false); // Ocultar el spinner de carga
            }
          },
        },
      ],
      { cancelable: false }
    );
  };



  useEffect(() => {
    setEditedName(name);
    setEditedLastName(lastName);
    setEditedEmail(email);
  }, [name, lastName, email]);


  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }} showsVerticalScrollIndicator={false}>
      <ImageBackground source={require('../../../../assets/fondo.png')} style={{ height: Dimensions.get('window').height / 2.5 }}>
        <View style={styles.brandView}>
          <Iconn name="spa" size={24} color="black" style={{ fontSize: 100 }} />
          <Text style={styles.brandViewText}>Perfil</Text>
        </View>
      </ImageBackground>
      <View style={styles.bottomView}>
        <View style={{ padding: 40 }}>
          <View style={{ marginTop: 15 }}>
            <View style={{ borderColor: "#4632A1" }}>
              <View style={{ alignItems: 'center' }}>
                <Icon name="user" size={70} color="black" />
              </View>
              <Text style={{ marginBottom: 5, textShadowColor: "black", textShadowRadius: 2, marginTop: 10 }}>Nombre:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{name}</Text>
                <Icon name="user" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 10 }}>
              <Text style={{ marginBottom: 5, textShadowColor: "black", textShadowRadius: 2 }}>Apellidos:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ flex: 1 }}>{lastName}</Text>

                <Icon name="id-card" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 10 }}>
              <Text style={{ marginBottom: 5, textShadowColor: "black", textShadowRadius: 2 }}>Correo Electrónico:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ flex: 1 }}>{email}</Text>
                <Icon name="envelope" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 5 }}>
              <Text style={{ marginBottom: 5, textShadowColor: "black", textShadowRadius: 2 }}>Contraseña:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ flex: 1 }}>********</Text>
                <Icon name="eye" style={{ color: "black" }} />
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
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  marginHorizontal: 5,
                  borderWidth: 1,
                  borderColor: 'green',
                }}
                onPress={handleModifyData}
              >
                <Text
                  style={{
                    color: 'green',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                >
                  Modificar Datos
                </Text>
              </TouchableOpacity>
              {/*BOTON CERRAR SESIÓN */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  marginHorizontal: 5,
                  borderWidth: 1,
                  borderColor: 'green',
                }}
                onPress={handleLogout}
              >
                <Text style={{ color: 'green', fontSize: 15, fontWeight: 'bold' }}>Cerrar sesión</Text>
              </TouchableOpacity>
              {/* */}

            </View>
          </View>
        </View>
      </View>

      {/* Modal para modificar datos */}
      {isModalVisible && (
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            {isLoading ? (
              <View style={styles.spinnerContainer}>
                <View style={styles.spinnerBox}>
                  <ActivityIndicator size="large" color="blue" />
                  <Text style={styles.spinnerText}>Espere un momento...</Text>
                </View>
              </View>
            ) : (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Modificar Datos</Text>
                <Text>Su ID: {id}</Text>
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
                <TouchableOpacity
                  style={{
                    borderRadius: 10,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    marginHorizontal: 5,
                    backgroundColor: "#0E85E8",
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
    color: 'red',
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
});