import React, { useState } from 'react';
import { View, TextInput, Button, Modal, StyleSheet, TouchableOpacity, ActivityIndicator, Text, Alert } from 'react-native';
import Axios from 'axios';
import Contraseña from './Contraseña';

const Token = ({ modalVisible, setModalVisible }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldsCompleted, setFieldsCompleted] = useState(false);
  //validar campos obligatorios
  const validateFields = () => {
    if (
      email.trim() === ""

    ) {
      return false;
    }
    return true;
  }
  const handlePasswordRecovery = async () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de realizar esta acción?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await Axios.put('http://192.168.0.232:8080/api-beautypalace/user/token/', { email });
              Alert.alert('Token enviado exitosamente');
              clearFields();
            } catch (error) {
              console.error('Error al enviar el Token:', error.message);
            }
            setIsLoading(false);
          },
        },
      ],
      { cancelable: false }
    );
  };


  const clearFields = () => {
    setEmail('');
  }
  return (

    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#97714D" />
              <Text style={styles.loadingText}>Enviando Token...</Text>
            </View>
          </View>
        ) : (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recuperar Contraseña</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={(text) => { setEmail(text); setFieldsCompleted(validateFields()) }}
              editable={true}
            />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
              <TouchableOpacity style={styles.Token} onPress={() => {
                if (fieldsCompleted) {
                  handlePasswordRecovery();
                } else {
                  Alert.alert("Por favor, llene todos los campos")
                }
              }}>
                <Text style={styles.loginButtonText}>Enviar Token</Text>
              </TouchableOpacity>
            </View>

            <Contraseña />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  modalCloseText: {
    color: 'blue',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  Token: {
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: "center"
  },
  containerr: {
    flex: 1,
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
    backgroundColor: '#ffffff', // Define el color de fondo que desees
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo semi-transparente
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default Token;
