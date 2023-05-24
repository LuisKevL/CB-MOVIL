import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Dimensions, Button, Modal, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle, faKeyboard, faInputText } from '@fortawesome/free-brands-svg-icons';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

const Profile = ({ name, lastName, email, handleLogout }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modifiedName, setModifiedName] = useState(name);
  const [modifiedLastName, setModifiedLastName] = useState(lastName);
  const [modifiedEmail, setModifiedEmail] = useState(email);
  const [modifiedPassword, setModifiedPassword] = useState('');

  const handleModifyData = () => {
    setModifiedName(name);
    setModifiedLastName(lastName);
    setModifiedEmail(email);
    setModifiedPassword('');
    setModalVisible(true);
  };


  const handleSaveChanges = async () => {
    try {
      // Realizar la solicitud PUT para actualizar los datos
      const response = await Axios.put('http://192.168.0.232:8080/api-beautypalace/user/clients/', {
        name: modifiedName,
        lastName: modifiedLastName,
        email: modifiedEmail
      });

      // Verificar la respuesta del servidor
      if (response.status === 200) {
        // Datos actualizados exitosamente
        Alert.alert('Éxito', 'Los datos se han actualizado correctamente.');
        setModalVisible(false);
      } else {
        // Error al actualizar los datos
        Alert.alert('Error', 'No se pudieron actualizar los datos. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      // Error de conexión o solicitud
      Alert.alert('Error', 'Ocurrió un error al enviar la solicitud. Por favor, verifica tu conexión.');
    }
  };



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

              <Button title="Cerrar sesión" onPress={handleLogout} />
            </View>
          </View>
        </View>
      </View>

      {/* Modal para modificar datos */}
      {isModalVisible && (
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Modificar Datos</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Nombre"
                editable={true}
                value={modifiedName}
                onChangeText={setModifiedName}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Apellido"
                editable={true}
                value={modifiedLastName}
                onChangeText={setModifiedLastName}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Correo electrónico"
                editable={true}
                value={modifiedEmail}
                onChangeText={setModifiedEmail}
              />
              <Text style={styles.texto}>Para cambiar la contraseña tendrá que volver al login</Text>
              <Button title="Guardar cambios" onPress={handleSaveChanges} />

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
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
  }
});
