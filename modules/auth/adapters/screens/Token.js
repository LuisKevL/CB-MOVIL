import React, { useState } from 'react';
import { View, TextInput, Button, Modal, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import Axios from 'axios';
import Contraseña from './Contraseña';

const Token = ({ modalVisible, setModalVisible }) => {
  const [email, setEmail] = useState('');

  const handlePasswordRecovery = async () => {
    try {
      // Realizar una consulta para verificar si el correo existe en la base de datos
      const checkEmailResponse = await Axios.get('http://192.168.0.232:8080/api-beautypalace/user/checkEmail', {
        params: { email }
      });
  
      if (checkEmailResponse.data.exists) {
        // El correo existe en la base de datos, enviar el token
        await Axios.put('http://192.168.0.232:8080/api-beautypalace/user/token/', { email });
        Alert.alert('Token enviado exitosamente');
  
        // Realiza cualquier acción adicional después de enviar el token
      } else {
        Alert.alert('El correo electrónico no existe en la base de datos');
      }
    } catch (error) {
      console.error('Error al enviar el Token:', error.message);
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Recuperar Contraseña</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={text => setEmail(text)}
            editable={true} // Asegúrate de que el TextInput sea editable
          />

          <Button title="Enviar Token" onPress={handlePasswordRecovery} />

          <Contraseña />
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCloseText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
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
});

export default Token;
