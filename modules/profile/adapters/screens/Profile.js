import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle, faKeyboard, faInputText } from '@fortawesome/free-brands-svg-icons';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
function Profile() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }} showsVerticalScrollIndicator={false}>
      <ImageBackground source={require('../../../../assets/fondo.png')}
        style={{ height: Dimensions.get('window').height / 2.5, }}>
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
                <Text style={{ flex: 1 }}>Luis Kevin</Text>
                <Icon name="user" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 10 }}>
              <Text style={{ marginBottom: 5, textShadowColor: "black", textShadowRadius: 2 }}>Apellidos:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ flex: 1 }}>Lóp. Oc.</Text>
                <Icon name="id-card" style={{ color: "black" }} />
              </View>
            </View>

            <View style={{ borderColor: '#4632A1', marginTop: 10 }}>
              <Text style={{ marginBottom: 5, textShadowColor: "black", textShadowRadius: 2 }}>Correo Electrónico:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ flex: 1 }}>20213tn118@utez.edu.mx</Text>
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
              <TouchableOpacity style={{
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
              }} >
                <Text style={{
                  color: 'green',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}>Modificar Datos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{
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
              }} >
                <Text style={{
                  color: 'green',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}>Ver Citas</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
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