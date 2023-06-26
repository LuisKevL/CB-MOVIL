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

export default function Agenda() {
  const [citaData, setCitaData] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [lastNameClient, setLastNameClient] = useState("");
  const [ nameClient, setnameClient] = useState("");
  const [typeOfService, setTypeOfService] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [counter, setCounter] = useState(0);

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
          nameClient:nameClient,
          typeOfService: typeOfService,
          day: day,
          startTime: startTime,
          timeEnd: timeEnd,
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
      Alert.alert("Agendado correctamente")
    } catch (error) {
      console.log("Error al agendar la cita: ", error);
      Alert.alert("Se produjo un error al agendar la cita");    }
  };
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
                    <Text>{cita.dayAndHour}</Text>
                  </View>

                  <View style={styles.columnContainer}>
                    <Text style={styles.label}>Tipo de servicio:</Text>
                    <Text>{cita.typeOfService}</Text>
                  </View>
                </View>

                <View style={styles.rowContainer}>
                  <View style={styles.columnContainer}>
                    <Text style={styles.label}>Id del usuario:</Text>
                    <Text>{cita.user_id}</Text>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.textButton}>Agendar Cita</Text>
                  </TouchableOpacity>
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
            <Text style={styles.modalText}>Agendar cita </Text>
            <TextInput
              style={{ display: "none" }}
              value={id}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Ingrese el Nombre de lo que se va a realizar "
              value={name}
              onChangeText={(text) => {
                setName(text);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Ingrese el Apellido del cliente "
              value={lastNameClient}
              onChangeText={(text) => {
                setLastNameClient(text);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Ingrese el Nombre del cliente"
              value={nameClient}
              onChangeText={(text) => {
                setnameClient(text);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Ingrese el tipo de servicio"
              value={typeOfService}
              onChangeText={(text) => {
                setTypeOfService(text);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Ingrese la hora de inicio "
              value={startTime}
              onChangeText={(text) => {
                setStartTime(text);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Ingrese la hora de fin "
              value={timeEnd}
              onChangeText={(text) => {
                setTimeEnd(text);
              }}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#000dcc",
                  borderRadius: 10,
                  height: 30,
                  width: 200,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={agendarCita}>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Agendar
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#FC0B0B",
                borderRadius: 10,
                height: 30,
                width: 200,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 15,
              }}
              onPress={() => setModalVisible(false)}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    color: "#AD093D",
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
    margin: 10,
  },
});
