import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle, faKeyboard, faInputText } from '@fortawesome/free-brands-svg-icons';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Axios from 'axios';

function Cita() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [lastNameClient, setLastNameClient] = useState('');
  const [nameClient, setNameClient] = useState('');
  const [typeOfService, setTypeOfService] = useState('');
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [timeEnd, setTimeEnd] = useState('');

  const handleRegister = async () => {
    try {
      const response = await Axios.post('http://192.168.0.232:8080/api-beautypalace/agenda/', {
        id,
        name,
        lastNameClient,
        nameClient,
        typeOfService,
        day,
        startTime,
        timeEnd,
      });

      console.log('Cita creada exitosamente');

      // Aquí puedes realizar cualquier acción adicional que necesites después de crear la cita

    } catch (error) {
      console.error('Error al crear la cita:', error.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }} showsVerticalScrollIndicator={false}>
      <ImageBackground source={require('../../../../assets/fondo.png')} style={{ height: Dimensions.get('window').height / 2.5 }}>
        <View style={styles.brandView}>
          <Iconn name="spa" size={24} color="black" style={{ fontSize: 100 }} />
          <Text style={styles.brandViewText}>Citas</Text>
        </View>
      </ImageBackground>
      <View style={styles.bottomView}>
        <View style={{ padding: 40 }}>

          <View style={{ marginTop: 15 }}>
            <View style={{ borderColor: "#4632A1" }}>
              <Text style={{ marginBottom: 5 }}>ID de la cita</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Ingresa el ID"
                  value={id}
                  onChangeText={setId}
                />
                <Icon name="pencil" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: "#4632A1", marginTop: 5 }}>
              <Text style={{ marginBottom: 5 }}>Nombre de la cita</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Ingresa su nombre"
                  value={name}
                  onChangeText={setName}
                />
                <Icon name="pencil" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 5 }}>
              <Text style={{ marginBottom: 5 }}>Apellido del cliente</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Apellido del cliente"
                  value={lastNameClient}
                  onChangeText={setLastNameClient}
                />
                <Icon name="keyboard-o" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 5 }}>
              <Text style={{ marginBottom: 5 }}>Nombre del cliente</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Nombre del cliente"
                  value={nameClient}
                  onChangeText={setNameClient}
                />
                <Icon name="keyboard-o" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 5 }}>
              <Text style={{ marginBottom: 5 }}>Tipo de servicio</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Nombre del servicio"
                  value={typeOfService}
                  onChangeText={setTypeOfService}
                />
                <Icon name="keyboard-o" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 5 }}>
              <Text style={{ marginBottom: 5 }}>Día de la cita</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="17/05/2023"
                  value={day}
                  onChangeText={setDay}
                />
                <Icon name="calendar" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 5 }}>
              <Text style={{ marginBottom: 5 }}>Hora de inicio</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="11:11"
                  value={startTime}
                  onChangeText={setStartTime}
                />
                <Icon name="clock-o" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 5 }}>
              <Text style={{ marginBottom: 5 }}>Hora de fin</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="12:00"
                  value={timeEnd}
                  onChangeText={setTimeEnd}
                />
                <Icon name="clock-o" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ marginTop: 15, height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#3b5998',
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  marginHorizontal: 5,
                  backgroundColor: 'green',
                }}
                onPress={handleRegister}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginLeft: 8,
                }}>Registrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default Cita;

const styles = StyleSheet.create({
  brandView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandViewText: {
    color: 'black',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomView: {
    flex: 1,
    backgroundColor: '#ffffff',
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },
});
