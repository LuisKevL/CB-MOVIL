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
import { Picker } from '@react-native-picker/picker'; // Asegúrate de que estás importando desde @react-native-picker/picker
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
  {/* Picker */ }
  const formatDate = (dateString) => {
    // Convierte "2023/08/14" a "2023-08-14"
    const formattedDate = dateString.replace(/\//g, '-');
    return formattedDate;
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    setDay(formattedDate);
  };

  const opcionesSucursales = ["Sucursal 1", "Sucursal 2", "Sucursal 3"];
  const opcionesService = ["Pies", "Cabello"];
  const horas = [
    "08:00", "08:30",
    "09:00", "09:30",
    "10:00", "10:30",
    "11:00", "11:30",
    "12:00", "12:30",
    "13:00", "13:30",
    "14:00", "14:30",
    "15:00", "15:30",
    "16:00", "16:30",
    "17:00", "17:30",
    "18:00", "18:30",
  ];
  const [fieldsCompleted, setFieldsCompleted] = useState(false);
  const validateFields = () => {
    if (
      typeOfService.trim() === "" ||
      day.trim() === "" ||
      hour.trim() === "" ||
      branch.trim() === "" ||
      editedNameValue.trim() === ""
    ) {
      return false;
    }
    return true;
  }

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
              clearFields();
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

    const clearFields=()=> {
      setDay("");
      setHour("");
      setNameUser("");
      setBranch("");
      setTypeOfService("");
    }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }}
      showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={require("../../../../assets/cita.png")}
        style={{
          height: Dimensions.get("window").height / 2.5        }}>
        <View style={styles.brandView}>
          <Text style={styles.brandViewText}></Text>
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
                <Text style={{ display: "none" }}>{id}</Text>
                <Text style={{ display: "none" }}>{userId}</Text>

                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Nombre del cliente</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      marginBottom: 10,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: "#000",
                      borderRadius: 5,
                      width: 300,
                      color: "red"
                    }}
                  >
                    {editedNameValue} {editedLastNameValue}
                  </Text>
                  <Icon name="keyboard-o" style={{ color: "black" }} />
                </View>
              </View>


              <View style={{ borderColor: "#4632A1", marginTop: 5 }}>
                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Tipo de servicio</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    style={{ ...styles.input, flex: 1 }}
                    selectedValue={typeOfService}
                    onValueChange={(itemValue, itemIndex) => {
                      setTypeOfService(itemValue);
                      setFieldsCompleted(validateFields());
                    }}
                  >
                    <Picker.Item label="Seleccione un servicio" value="" />
                    {opcionesService.map((service, index) => (
                      <Picker.Item key={index} label={service} value={service} />
                    ))}
                  </Picker>

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
                    onSelectedChange={handleDateChange}
                    value={day}

                  />
                </View>
              </View>

              <View style={{ borderColor: "#4632A1", marginTop: 5 }}>
                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Ingresa la hora</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    style={{ ...styles.input, flex: 1 }}
                    selectedValue={hour}
                    onValueChange={(itemValue, itemIndex) => {
                      setHour(itemValue);
                      setFieldsCompleted(validateFields());
                    }}
                  >
                    <Picker.Item label="Seleccione la hora" value="" />
                    {horas.map((hour, index) => (
                      <Picker.Item key={index} label={hour} value={hour} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={{ borderColor: "#4632A1", marginTop: 5 }}>
                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Apellido del cliente</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Apellido Cliente"
                    value={editedNameValue}
                    onChangeText={(text) => {
                      setEditedNameValue(text);
                      setFieldsCompleted(validateFields());
                    }}
                  />
                  <Icon name="keyboard-o" style={{ color: "black" }} />
                </View>
              </View>


              <View style={{ borderColor: "#4632A1", marginTop: 5 }}>
                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Sucursal</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    style={{ ...styles.input, flex: 1 }}
                    selectedValue={branch}
                    onValueChange={(itemValue, itemIndex) => {
                      setBranch(itemValue);
                      setFieldsCompleted(validateFields());
                    }}
                  >
                    <Picker.Item label="Seleccione una sucursal" value="" />
                    {opcionesSucursales.map((sucursal, index) => (
                      <Picker.Item key={index} label={sucursal} value={sucursal} />
                    ))}
                  </Picker>
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
                  onPress={() => {
                    if (fieldsCompleted) {
                      cita(); // Aquí llamas a la función cita() que realiza el registro
                      clearFields();
                    } else {
                      Alert.alert("Error", "Todos los campos son obligatorios.");
                    }
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginLeft: 8,
                    }}
                  >
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
