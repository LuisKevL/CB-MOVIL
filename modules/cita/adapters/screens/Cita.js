import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import Iconn from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import DatePicker from "react-native-modern-datepicker";
import Axios from "axios";

export default function Cita({ navigation }) {
  const [id, setId] = useState("");
  const [userId, setUserId] = useState("");
  const [editedNameValue, setEditedNameValue] = useState("");
  const [editedLastNameValue, setEditedLastNameValue] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [branch, setBranch] = useState("");
  const [typeOfService, setTypeOfService] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setId(counter.toString());
  }, [counter]);

  const getDataFromStorage = async () => {
    try {
      const keys = [
        "userId",
        "userName",
        "userLastName",
        "userEmail",
        "userPassword",
      ];
      const values = await AsyncStorage.multiGet(keys);
      const data = {};

      values.forEach(([key, value]) => {
        data[key] = value;
      });
      setUserId(data.userId);
      setEditedNameValue(data.userName);
      setEditedLastNameValue(data.userLastName);
    } catch (error) {
      console.log("Error al obtener los datos de AsyncStorage:", error);
    }
  };

  useEffect(() => {
    getDataFromStorage();
  }, []);

  const cita = async () => {
    Alert.alert(
      "Confirmación",
      "Esta es la fecha seleccionada, seguro que quiere continuar",

      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aceptar",
          onPress: async () => {
            try {
              setLoading(true);

              const response = await Axios.post(
                "http://192.168.0.232:8080/api-beautypalace/cita/",
                {
                  id: id,
                  user_id: userId,
                  day: day,
                  hour: hour,
                  nameUser: editedNameValue,
                  branch: branch,
                  typeOfService: typeOfService,
                }
              );
              console.log("respuesta de la peticion --> ", response.data);
              console.log("id de la peticion --> ", id);
              setCounter((prevCounter) => prevCounter + 1);
              setUserId(userId);
              setDay(day);
              setHour(hour);
              setNameUser(nameUser);
              setBranch(branch);
              setTypeOfService(typeOfService);
            } catch (error) {
              console.log("Error al guardar la cita", error.message);
            } finally {
              setLoading(false); // Ocultar el spinner de carga
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }}
      showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={require("../../../../assets/fondo.png")}
        style={{
          height: Dimensions.get("window").height / 2.5,
          marginTop: -80,
        }}>
        <View style={styles.brandView}>
          <Iconn name="spa" size={24} color="black" style={{ fontSize: 100 }} />

          <Text style={styles.brandViewText}>Citas</Text>
        </View>
      </ImageBackground>
      <View style={styles.bottomView}>
        <View style={{ padding: 40 }}>
          {isLoading ? (
            <View style={styles.spinnerContainer}>
              <View style={styles.spinnerBox}>
                <ActivityIndicator size="large" color="blue" />
                <Text style={styles.spinnerText}>Un momento porfavor...</Text>
              </View>
            </View>
          ) : (
            <View style={{ marginTop: 15 }}>
              <View style={{ borderColor: "#4632A1", marginTop: 5 }}>
                {/* Estos no se muestran el ID Y el USERID */}
                <TextInput
                  style={{ display: "none" }}
                  value={id}
                  editable={false}
                />

                <TextInput style={{ display: "none" }}>{userId}</TextInput>

                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Nombre del cliente</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={{
                      marginBottom: 10,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: "#000",
                      borderRadius: 5,
                      width: 300,
                      color: "red"
                    }}
                    placeholder="Nombre del cliente"
                    editable={false}>
                    {editedNameValue} {editedLastNameValue}
                  </TextInput>
                  <Icon name="keyboard-o" style={{ color: "black" }} />
                </View>
              </View>

              <View style={{ borderColor: "#4632A1", marginTop: 5 }}>
                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Tipo de servicio</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre del servicio"
                    value={typeOfService}
                    onChangeText={(text) => setTypeOfService(text)}
                  />
                  <Icon name="keyboard-o" style={{ color: "black" }} />
                </View>
              </View>

              <View style={{ borderColor: "#4632A1", marginTop: 5 }}>
                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Dia de la cita</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <DatePicker
                  style={styles.DatePicker}
                    options={{
                      backgroundColor: "#fff",
                      textHeaderColor: "#8B4513",
                      textDefaultColor: "#000",
                      selectedTextColor: "#000",
                      mainColor: "#F5B8E2",
                      textSecondaryColor: "#000",
                      borderColor: "rgba(122, 146, 165, 0.1)",
                    }}
                    mode="calendar"
                    minuteInterval={30}
                    onSelectedChange={(date) => setDay(date)}
                    value={day}
                    
                  />
                </View>
              </View>

              <View style={{ borderColor: "#4632A1", marginTop: 5 }}>
                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Ingresa la hora</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingresa la hora"
                    value={hour}
                    onChangeText={(text) => setHour(text)}
                  />
                  <Icon name="keyboard-o" style={{ color: "black" }} />
                </View>
              </View>

              <View style={{ borderColor: "#4632A1", marginTop: 5 }}>
                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Apellido del cliente</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Apellido Cliente"
                    value={editedNameValue}
                    onChangeText={(text) => setEditedNameValue(text)}
                  />
                  <Icon name="keyboard-o" style={{ color: "black" }} />
                </View>
              </View>


              <View style={{ borderColor: "#4632A1", marginTop: 5 }}>
                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Tipo de rama</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre del la rama"
                    value={branch}
                    onChangeText={(text) => setBranch(text)}
                  />
                  <Icon name="keyboard-o" style={{ color: "black" }} />
                </View>
              </View>

              <View
                style={{
                  marginTop: 15,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#8B4513",
                    borderRadius: 10,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    marginHorizontal: 5,
                  }}
                  onPress={cita}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginLeft: 8,
                    }}>
                    Registrar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  DatePicker: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  brandView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  button: {
    backgroundColor: "#4632A1",
    borderRadius: Dimensions.get("window").width / 2,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    marginTop: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00BFFF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  icon: {
    color: "white",
    fontSize: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    width: 300,
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
  spinnerText: {
    color: "#000",
  },
});
