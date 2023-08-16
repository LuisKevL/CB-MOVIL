

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
  TouchableOpacity,
} from "react-native";
import Axios from "axios";
import Iconn from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Picker } from "@react-native-picker/picker";
export default function ViewCitaClient() {
  const [citaData, setCitaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [calificacion, setCalificacion] = useState(0);
  const [calificacionesCitas, setCalificacionesCitas] = useState({});
  const [citasPuntuadas, setCitasPuntuadas] = useState([]);

  const enviarCalificacion = async (citaId, nombreCita) => {
    try {
      const id = generateId();
      const response = await Axios.post(
        "http://192.168.0.232:8080/api-beautypalace/servicio/",
        {
          id: id,
          estrellas: calificacionesCitas[citaId], // Utiliza la calificación específica de esta cita
          id_cita: citaId,
          name_cita: nombreCita,
        }
      );
      const updatedCitasPuntuadas = [...citasPuntuadas, citaId]; // Agrega el ID de la cita puntuada
      setCitasPuntuadas(updatedCitasPuntuadas);
      Alert.alert("Calificación enviada exitosamente");
    } catch (error) {
      console.log("Error al enviar la calificación: ", error);
      Alert.alert("Error al enviar la calificación");
    }
  };

  
  
  const generateId = () => {
    return Date.now().toString();
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

  const fetchCalificaciones = async () => {
    try {
      const response = await Axios.get(
        "http://192.168.0.232:8080/api-beautypalace/servicio/"
      );
      const { data } = response.data;
      const calificaciones = {};
      const citasPuntuadas = [];
      data.forEach((calificacion) => {
        calificaciones[calificacion.id_cita] = calificacion.estrellas;
        if (calificacion.estrellas > 0) {
          citasPuntuadas.push(calificacion.id_cita);
        }
      });
      setCalificacionesCitas(calificaciones);
      setCitasPuntuadas(citasPuntuadas);
    } catch (error) {
      console.log("Error al obtener las calificaciones: ", error);
    }
  };


  useEffect(() => {
    fetchData();
    fetchCalificaciones();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }}
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        </View>
      ) : (
        <>
          <ImageBackground
            source={require("../../../../assets/agenda.png")}
            style={{
              height: Dimensions.get("window").height / 2.5
            }}
          >
            <View style={styles.brandView}>
              <Text style={styles.brandViewText}></Text>
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
                    {/* ... */}
                    <View style={styles.buttonContainer}>
                      {citasPuntuadas.includes(cita[0]) ? (
                        <Text>Ya has puntuado el servicio</Text>
                      ) : (
                        <>
                          <Picker
                            selectedValue={calificacionesCitas[cita[0]]}
                            style={{ width: 150 }}
                            onValueChange={(itemValue) =>
                              setCalificacionesCitas((prevCalificaciones) => ({
                                ...prevCalificaciones,
                                [cita[0]]: itemValue,
                              }))
                            }
                          >
                            <Picker.Item label="Calificar" value={0} />
                            <Picker.Item label="⭐" value={1} />
                            <Picker.Item label="⭐⭐" value={2} />
                            <Picker.Item label="⭐⭐⭐" value={3} />
                            <Picker.Item label="⭐⭐⭐⭐" value={4} />
                            <Picker.Item label="⭐⭐⭐⭐⭐" value={5} />
                          </Picker>

                          <TouchableOpacity
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#8B4513",
                              borderRadius: 10,
                              paddingVertical: 8,
                              paddingHorizontal: 16,
                              marginHorizontal: 5,
                            }}
                            onPress={() => {
                              if (!citasPuntuadas.includes(cita[0])) {
                                enviarCalificacion(cita[0], cita[3]);
                              }
                            }}
                          >
                            <Text style={{ color: "white", fontSize: 10 }}>Puntuar Servicio</Text>
                          </TouchableOpacity>

                        </>
                      )}
                    </View>
                    {/* ... */}


                    <TextInput
                      style={styles.starInput}
                      value={"⭐".repeat(calificacionesCitas[cita[0]])}
                      editable={false}
                    />
                    <Text>{cita[0]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
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
  starInput: {
    fontSize: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 10,
    textAlign: "center",
  },
});
