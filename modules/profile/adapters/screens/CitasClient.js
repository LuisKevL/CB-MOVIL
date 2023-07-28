import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import Axios from "axios";
import Iconn from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export default function ViewCitaClient() {
  const [citaData, setCitaData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreCita, setNombreCita] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [tipoServicio, setTipoServicio] = useState("");
  const [diaCita, setDiaCita] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  const handleScheduleNotification = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Permisos de notificación requeridos",
        "Debes permitir las notificaciones para utilizar esta función."
      );
      return;
    }

    Alert.alert(
      "Programar notificación",
      "¿Quieres programar un recordatorio cada 24 horas?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Programar",
          onPress: () => {
            Notifications.scheduleNotificationAsync({
              content: {
                title: "Recordatorio de Cita",
                body: `tiene una cita el ${citaData[0][1]}`,
                sound: true,
              },
              trigger: { seconds: 3000 },
            });
          },
        },
      ]
    );
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const id = await AsyncStorage.getItem('userId')
      const response = await Axios.get(
        `http://192.168.0.232:8080/api-beautypalace/agenda/user/${id}/`
      );
      const { data } = response.data;
      setCitaData(data);
      setIsLoading(false);
    } catch (error) {
      console.log("Error al recuperar la cita: ", error);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }}
      showsVerticalScrollIndicator={false}>
      {isLoading ? (
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        </View>
      ) : (
        <>
          <ImageBackground
            source={require("../../../../assets/fondo.png")}
            style={{ height: Dimensions.get("window").height / 2.5 }}>
            <View style={styles.brandView}>
              <Iconn
                name="spa"
                size={24}
                color="black"
                style={{ fontSize: 100 }}
              />
              <Text style={styles.brandViewText}>Ver Citas</Text>
            </View>
          </ImageBackground>
          <View style={styles.bottomView}>
            <View style={{ padding: 40 }}>
              <View style={{ marginTop: 15 }}>
                {citaData.map((cita, index) => (
                  <View key={`${cita.nombreCita}-${index}`} style={styles.cardContainer}>
                    <View style={styles.rowContainer}>
                      <View style={styles.columnContainer}>
                        <Text style={styles.label}>Nombre de la cita:</Text>
                        <Text>{cita[3]}</Text>

                      </View>
                      <View style={styles.columnContainer}>
                        <Text style={styles.label}>Tipo de servicio:</Text>
                        <Text>{cita[7]}</Text>
                      </View>
                    </View>


                    <View style={styles.rowContainer}>
                      <View style={styles.columnContainer}>
                        <Text style={styles.label}>Nombre del cliente:</Text>
                        <Text>
                          {cita[4]} {cita[2]}
                        </Text>
                      </View>

                    </View>

                    <View style={styles.rowContainer}>
                      <View style={styles.columnContainer}>
                        <Text style={styles.label}>Dia de la cita:</Text>
                        <Text>{cita[1]}</Text>
                      </View>

                      <View style={styles.columnContainer}>
                        <Text style={styles.label}>Hora Inicio: </Text>
                        <Text>{cita[5]}</Text>
                      </View>

                      <View style={styles.columnContainer}>
                        <Text style={styles.label}>Hora fin:</Text>
                        <Text>{cita[6]}</Text>
                      </View>

                      <View style={styles.columnContainer}>
                        <Text style={styles.label}>Sucursal:</Text>
                        <Text>{cita[8]}</Text>
                      </View>
                    </View>
                    <View style={styles.buttonContainer}>
                      {/*  <Button
                        title="Programar notificación"
                        onPress={handleScheduleNotification}
                      />*/}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Actualizar Cita</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Nombre de la cita"
                  value={nombreCita}
                  onChangeText={(text) => setNombreCita(text)}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Nombre del cliente"
                  value={nombreCliente}
                  onChangeText={(text) => setNombreCliente(text)}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Tipo de servicio"
                  value={tipoServicio}
                  onChangeText={(text) => setTipoServicio(text)}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Día de la cita"
                  value={diaCita}
                  onChangeText={(text) => setDiaCita(text)}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Hora de inicio"
                  value={horaInicio}
                  onChangeText={(text) => setHoraInicio(text)}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Hora de fin"
                  value={horaFin}
                  onChangeText={(text) => setHoraFin(text)}
                />
              </View>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 250
  },
  loadingContainer: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 10,
  },
  brandView: {
    alignItems: "center",
    marginTop: 80,
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
  cardContainer: {
    backgroundColor: "#f1f1f1",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  columnContainer: {
    flex: 1,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  agendarButton: {
    backgroundColor: "#1c9c9c",
  },
  actualizarButton: {
    backgroundColor: "#a32f2f",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "#1c9c9c",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#a32f2f",
    marginTop: 10,
  },
});
