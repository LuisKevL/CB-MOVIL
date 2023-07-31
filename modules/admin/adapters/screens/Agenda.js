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
  DatePickerIOSBase,
} from "react-native";
import Axios from "axios";
import Iconn from "react-native-vector-icons/MaterialIcons";
import { Picker } from '@react-native-picker/picker'; // Importa el Picker desde el nuevo paquete

export default function Agenda() {
  const [citaData, setCitaData] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [lastNameClient, setLastNameClient] = useState("");
  const [nameClient, setnameClient] = useState("");
  const [typeOfService, setTypeOfService] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [branch, setBranch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [counter, setCounter] = useState(0);

  const opcionesSucursales = ['Sucursal 1', 'Sucursal 2', 'Sucursal 3'];
  const opcionesService = ['Pies', 'Cabello'];
  const horas = [
    "08:00 a. m.", "08:30 a. m.",
    "09:00 a. m.", "09:30 a. m.",
    "10:00 a. m.", "10:30 a. m.",
    "11:00 a. m.", "11:30 a. m.",
    "12:00 p. m.", "12:30 p. m.",
    "13:00 p. m.", "13:30 p. m.",
    "14:00 p. m.", "14:30 p. m.",
    "15:00 p. m.", "15:30 p. m.",
    "16:00 p. m.", "16:30 p. m.",
    "17:00 p. m.", "17:30 p. m.",
    "18:00 p. m.", "18:30 p. m.",
  ];
  const [fieldsCompleted, setFieldsCompleted] = useState(false);
  //validar campos obligatorios
  const validateFields = () => {
    if (
      name.trim() === "" ||
      lastNameClient.trim() === "" ||
      nameClient.trim() === "" ||
      typeOfService.trim() === "" ||
      startTime.trim() === "" ||
      timeEnd.trim() === "" ||
      branch.trim() === ""

    ) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    setId(counter.toString());
  }, [counter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "http://192.168.0.232:8080/api-beautypalace/cita/"
        );
        const { data } = response.data;
        setCitaData(data);
      } catch (error) {
        console.error("Error fetching cita data:", error);
      }
    };

    fetchData();
  }, []);

  const agendarCita = async () => {
    try {
      const response = await Axios.post(
        "http://192.168.0.232:8080/api-beautypalace/agenda/",
        {
          id: id,
          name: name,
          lastNameClient: lastNameClient,
          nameClient: nameClient,
          typeOfService: typeOfService,
          day: day,
          startTime: startTime,
          timeEnd: timeEnd,
          branch: branch
        }
      );
      setCounter((prevCounter) => prevCounter + 1);
      setName(name);
      setLastNameClient(lastNameClient);
      setnameClient(nameClient);
      setTypeOfService(typeOfService);
      setDay(day);
      console.log("Dia: ", day);
      setStartTime(startTime);
      setTimeEnd(timeEnd);
      setBranch(branch);
      Alert.alert("Agendado correctamente")
    } catch (error) {
      console.log("Error al agendar la cita: ", error);
      Alert.alert("Se produjo un error al agendar la cita");
    }
  };
  useEffect(() => {
    console.log('name:', name); // Agregar este console.log para depurar el valor de "name"
  }, [name]);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }}
      showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={require("../../../../assets/fondo.png")}
        style={{ height: Dimensions.get("window").height / 2.5 }}>
        <View style={styles.brandView}>
          <Iconn name="spa" size={24} color="black" style={{ fontSize: 100 }} />
          <Text style={styles.brandViewText}>Ver Citas</Text>
        </View>
      </ImageBackground>
      <View style={styles.bottomView}>
        <View style={{ padding: 40 }}>
          <View style={{ marginTop: 15 }}>
            {/* Renderiza los datos de la cita aquí */}
            {citaData.map((cita) => (
              <View key={cita.id} style={styles.cardContainer}>
                <Text style={styles.label}>ID de la solicitud:</Text>
                <Text>{cita.id}</Text>

                <View style={styles.rowContainer}>
                  <View style={styles.columnContainer}>
                    <Text style={styles.label}>Dia:</Text>
                    <Text>{cita.day}</Text>
                  </View>

                  <View style={styles.columnContainer}>
                    <Text style={styles.label}>Tipo de servicio:</Text>
                    <Text style={styles.datos}>{cita.typeOfService}</Text>
                  </View>
                </View>

                <View style={styles.rowContainer}>
                  <View style={styles.columnContainer}>
                    <Text style={styles.label}>Nombre del usuario:</Text>
                    <Text>{cita.nameUser}</Text>
                  </View>
                  <View style={styles.columnContainer}>
                    <Text style={styles.label}>Sucursal:</Text>
                    <Text>{cita.branch}</Text>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.touchable}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.textButton}>Agendar Cita</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={{
        flex: 1,
        padding: 20,
      }}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={{ flex: 1, width: '100%', borderWidth: 2, borderColor: 'red' }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Agendar cita </Text>

              <TextInput
                style={styles.input}
                placeholder="Ingrese el Nombre de lo que se va a realizar "
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setFieldsCompleted(validateFields())
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Ingrese el Apellido del cliente "
                value={lastNameClient}
                onChangeText={(text) => {
                  setLastNameClient(text);
                  setFieldsCompleted(validateFields())
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Ingrese el Nombre del cliente"
                value={nameClient}
                onChangeText={(text) => {
                  setnameClient(text);
                  setFieldsCompleted(validateFields())
                }}
              />
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
              <View style={{ flexDirection: "row" }}>
                <Picker
                  style={{ ...styles.input, flex: 1 }}
                  selectedValue={startTime}
                  onValueChange={(itemValue, itemIndex) => {
                    setStartTime(itemValue);
                    setFieldsCompleted(validateFields());
                  }}
                >
                  <Picker.Item label="Ingrese la hora de inicio" value="" />
                  {horas.map((startTime, index) => (
                    <Picker.Item key={index} label={startTime} value={startTime} />
                  ))}
                </Picker>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Picker
                  style={{ ...styles.input, flex: 1 }}
                  selectedValue={timeEnd}
                  onValueChange={(itemValue, itemIndex) => {
                    setTimeEnd(itemValue);
                    setFieldsCompleted(validateFields());
                  }}
                >
                  <Picker.Item label="Ingrese la hora fin" value="" />
                  {horas.map((timeEnd, index) => (
                    <Picker.Item key={index} label={timeEnd} value={timeEnd} />
                  ))}
                </Picker>
              </View>
              <View style={{ flexDirection: 'row' }}>
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

              <View style={styles.containerColum}>
                <TouchableOpacity
                  style={[styles.botones, styles.agendarButton]}
                  onPress={() => {
                    if (fieldsCompleted) {
                      agendarCita(); // Aquí llamas a la función cita() que realiza el registro
                    } else {
                      Alert.alert("Por favor, llene todos los campos")
                    }
                  }}
                >
                  <Text style={styles.buttonText}>
                    Agendar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botones, styles.agendarButton]}

                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  columnContainer: {
    flex: 1,
    marginRight: 10,
  },
  buttonContainer: {
    justifyContent: "space-between",
    marginTop: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000000", // Cambiar el valor a #000000 para hacerlo más negro
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#000dcc",
    borderRadius: 10,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  touchable: {
    backgroundColor: "#97714D",
    borderRadius: 10,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  botones: {
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  agendarButton: {
    backgroundColor: '#97714D',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerColum: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  }
});
