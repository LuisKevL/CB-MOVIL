import React, { useState, useEffect } from "react";
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
    Modal
} from "react-native";
import Iconn from "react-native-vector-icons/MaterialIcons";
import Axios from "axios";

export default function ConsejosAdmin() {
    const [consejos, setConsejos] = useState([]);
    const [modal, setModal] = useState(false);
    const [modalDatos, setModalDatos] = useState(false);
    const [selectedConsejo, setSelectedConsejo] = useState(null); // Agregar esta línea
    const [titulo, setTitulo] = useState("");
    const [consejo, setConsejo] = useState("");
    const [fieldsCompleted, setFieldsCompleted] = useState(false);
    const validateFields = () => {
        if (
            titulo.trim() === "" ||
            consejo.trim() === ""
        ) {
            return false;
        } else {
            return true;
        }
    }

    const generateId = () => {
        // Generar un ID único utilizando la fecha actual
        return Date.now().toString();
    };

    const agregarConsejo = async () => {
        try {
            const id = generateId(); // Generar el ID automáticamente

            const response = await Axios.post('http://192.168.0.232:8080/api-beautypalace/consejos/', {
                id: id,
                titulo: titulo,
                consejo: consejo,
            });
            setModal(false);
            fetchConsejos();
            Alert.alert("Exito", "Consejo agregado exitosamente");
            console.log("Registrado correctamente");
        } catch (error) {
            Alert.alert("Error", "No se pudo agregar el consejo");
            console.error("Error al agregar el consejo:", error);
        }
    }

    const clearFields = () => {
        setTitulo('');
        setConsejo('');
    }

    useEffect(() => {
        fetchConsejos();
    }, []);

    const fetchConsejos = async () => {
        try {
            const response = await Axios.get('http://192.168.0.232:8080/api-beautypalace/consejos/');
            const { data } = response.data;
            setConsejos(data);
        } catch (error) {
            console.error('Error al obtener los consejos:', error);
        }
    };

    const actualizarConsejo = async () => {
        try {
            // Mostrar una alerta de confirmación
            Alert.alert(
                'Confirmar Actualización',
                '¿Estás seguro de actualizar la pregunta?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Actualizar',
                        onPress: async () => {
                            try {
                                const response = await Axios.put(
                                    `http://192.168.0.232:8080/api-beautypalace/consejos/update/`,
                                    {
                                        id: selectedConsejo.id,
                                        titulo: titulo, // Usamos el estado pregunta
                                        consejo: consejo, // Usamos el estado respuesta
                                    }
                                );

                                console.log('Pregunta actualizada con éxito');
                                Alert.alert('Pregunta actualizada con éxito');
                                setModalDatos(false);
                                clearFields();
                                fetchConsejos();
                            } catch (error) {
                                console.error('Error al actualizar la pregunta:', error);
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error al mostrar la alerta de confirmación:', error);
        }
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

                    <Text style={styles.brandViewText}>Consejos</Text>
                </View>
            </ImageBackground>
            <View style={styles.bottomView}>
                <View style={styles.container}>
                    {consejos.map((consejos, index) => (
                        <View key={index} style={styles.cardContainer}>
                            <View style={styles.cardContent}>
                                <Text style={styles.preguntaText}>{consejos.titulo}</Text>
                                <Text style={styles.respuestaText}>{consejos.consejo}</Text>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#8B4513",
                                        borderRadius: 10,
                                        paddingVertical: 7, // Ajustar este valor para aumentar la altura
                                        paddingHorizontal: 12,
                                        marginHorizontal: 5,
                                        alignItems: "center", // Añade esta propiedad para centrar el contenido horizontalmente
                                    }}
                                    onPress={() => {
                                        setModalDatos(true);
                                        setSelectedConsejo(consejos);
                                    }}>
                                    <Text style={{
                                        color: "white",
                                        fontSize: 15,
                                        fontWeight: "bold",
                                    }}>Modificar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
            <Modal visible={modal} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Agregar consejo</Text>
                        <TextInput
                            style={styles.input}
                            value={titulo}
                            placeholder="agrega el titulo"
                            onChangeText={(text) => {
                                setTitulo(text); setFieldsCompleted(validateFields());
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            value={consejo}
                            placeholder="Agrega el consejo"
                            multiline={true}
                            onChangeText={(text) => {
                                setConsejo(text);
                                setFieldsCompleted(validateFields());
                            }}
                        />

                        <View style={styles.containerColum}>
                            <TouchableOpacity style={[styles.botones, styles.agregarButton]}
                                onPress={() => {
                                    if (fieldsCompleted) {
                                        agregarConsejo();
                                        clearFields();
                                    } else {
                                        Alert.alert('Error', 'Todos los campos son obligatorios');
                                    }
                                }}>
                                <Text style={{
                                    color: "white",
                                    fontSize: 15,
                                    fontWeight: "bold",
                                }}>Agregar Consejo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.botones, styles.agregarButton]}
                                onPress={() => { setModal(false); clearFields() }}>
                                <Text style={{
                                    color: "white",
                                    fontSize: 15,
                                    fontWeight: "bold",
                                }}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal visible={modalDatos} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Modificar Consejo</Text>
                        {selectedConsejo ? (
                            <>
                                <TextInput
                                    style={styles.input}
                                    value={titulo}  // Mostrar el valor actual de la pregunta seleccionada
                                    placeholder={selectedConsejo.titulo}
                                    onChangeText={(text) => {
                                        setTitulo(text);
                                        setFieldsCompleted(validateFields());
                                    }}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={consejo}  // Mostrar el valor actual de la respuesta seleccionada
                                    placeholder={selectedConsejo.consejo}
                                    onChangeText={(text) => {
                                        setConsejo(text);
                                        setFieldsCompleted(validateFields());
                                    }}
                                />
                                <View style={styles.containerColum}>

                                    <TouchableOpacity
                                        style={[styles.botones, styles.agregarButton]}
                                        onPress={() => {
                                            if (fieldsCompleted) {
                                                actualizarConsejo();
                                                setModalDatos(false);
                                                clearFields();
                                            } else {
                                                Alert.alert('Error', 'Todos los campos son obligatorios');
                                            }
                                        }}>
                                        <Text style={{
                                            color: "white",
                                            fontSize: 15,
                                            fontWeight: "bold",
                                        }}>Modificar Pregunta</Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        style={[styles.botones, styles.agregarButton]}
                                        onPress={() => {
                                            setModalDatos(false);
                                            clearFields();
                                        }}>
                                        <Text style={{
                                            color: "white",
                                            fontSize: 15,
                                            fontWeight: "bold",
                                        }}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={[styles.botones, styles.agregarButton]}
                                onPress={() => {
                                    setModalDatos(false);
                                    clearFields();
                                }}>
                                <Text style={{
                                    color: "white",
                                    fontSize: 15,
                                    fontWeight: "bold",
                                }}>Cancelar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
            <View>
                <TouchableOpacity
                    onPress={() => { setModal(true); fetchConsejos(); }}
                    style={{
                        backgroundColor: "#8B4513",
                        borderRadius: 10,
                        paddingVertical: 7, // Ajustar este valor para aumentar la altura
                        paddingHorizontal: 12,
                        marginHorizontal: 5,
                        alignItems: "center", // Añade esta propiedad para centrar el contenido horizontalmente
                    }}
                >
                    <Text style={{
                        color: "white",
                        fontSize: 15,
                        fontWeight: "bold",
                    }}>Agregar Pregunta</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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

    cardContainer: {
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    cardContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        padding: 20,
    },
    preguntaText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    respuestaText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Cambiar la opacidad a un valor más bajo
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    containerColum: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    botones: {
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    agregarButton: {
        backgroundColor: '#97714D',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 10,
        paddingHorizontal: 10,
    }
});
