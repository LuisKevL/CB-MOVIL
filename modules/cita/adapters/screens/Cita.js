import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle, faKeyboard, faInputText } from '@fortawesome/free-brands-svg-icons';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
function Cita() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }} showsVerticalScrollIndicator={false}>
      <ImageBackground source={require('../../../../assets/fondo.png')}
        style={{ height: Dimensions.get('window').height / 2.5, }}>
        <View style={styles.brandView}>
          <Iconn name="spa" size={24} color="black" style={{ fontSize: 100 }} />

          <Text style={styles.brandViewText}>Citas</Text>
        </View>
      </ImageBackground>
      <View style={styles.bottomView}>
        <View style={{ padding: 40 }}>

          <View style={{ marginTop: 15 }}>
            <View style={{ borderColor: "#4632A1" }}>
              <Text style={{ marginBottom: 5 }}>Nombre de la cita</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Ingresa su nombre"
                />
                <Icon name="pencil" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 5 }}>
              <Text style={{ marginBottom: 5 }}>Nombre del cliente</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Nombre del cliente"
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
                />
                <Icon name="keyboard-o" style={{ color: "black" }} />

              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 5 }}>
              <Text style={{ marginBottom: 5 }}>Dia de la cita</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="17/05/2023"
                />

                <Icon name="calendar" style={{ color: "black" }} />

              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 5 }}>
              <Text style={{ marginBottom: 5 }}>Hora Inicio</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="11:11"
                />
                <Icon name="clock-o" style={{ color: "black" }} />

              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 5 }}>
              <Text style={{ marginBottom: 5 }}>Hora fin </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="12:00"
                />
                <Icon name="clock-o" style={{ color: "black" }} />

              </View>
            </View>

            <View style={{ marginTop: 15, height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#3b5998',
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 16,
                marginHorizontal: 5,
                backgroundColor: 'green',
              }} >
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
};

export default Cita;

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
  }, container: {
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
  }
})