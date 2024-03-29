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
    Modal,
    Button
} from "react-native";
import Iconn from "react-native-vector-icons/MaterialIcons";
import Axios from "axios";

export default function PreguntasAdmin({ navigation }) {
    const [preguntas, setPreguntas] = useState([]);
    const [modal, setModal] = useState(false);
    const [id, setId] = useState('');
    const [idd, setIdD] = useState('');
    const [pregunta, setPregunta] = useState('');
    const [respuesta, setRespuesta] = useState('');
    const [editedPregunta, setEditedPregunta] = useState(pregunta); 
    const [editedRespuesta, setEditedRespuesta] = useState(respuesta); 
    const [modalDatos, setModalDatos] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fieldsCompletedEl, setFieldsCompletedEl] = useState(false);
    const validateEliminate = () => {
        if (
            (selectedPregunta && (nombrePreguntaEliminar.trim() === ""))

        ) {
            return false;
        } else {
            return true;
        }
    }
    const [fieldsCompleted, setFieldsCompleted] = useState(false);
    const validateFields = () => {
        if (
            pregunta.trim() === "" ||
            respuesta.trim() === "" ||
            (selectedPregunta && (pregunta.trim() === "" || respuesta.trim() === ""))

        ) {
            return false;
        } else {
            return true;
        }
    }
    //CANCELAR CITA
    const [nombrePreguntaEliminar, setNombrePreguntaEliminar] = useState('');
    const [confirmarEliminacion, setConfirmarEliminacion] = useState('');

    const deletePregunta = async () => {
        if (!selectedPregunta) {
            Alert.alert('Error', 'Selecciona la pregunta para eliminar.');
            return;
        }
        if (confirmarEliminacion.trim() !== 'CONFIRMAR') {
            Alert.alert('Error', 'Por favor ingresa "CONFIRMAR" para eliminar la pregunta.');
            return;
        }
        const preguntaDelete = preguntas.find((pregunta) => pregunta.pregunta === nombrePreguntaEliminar);

        if (!preguntaDelete) {
            Alert.alert('Error', 'No se encontró ninguna cita con ese nombre.');
            return;
        }
        Alert.alert(
            'Confirmación',
            `¿Estás seguro de eliminar la pregunta "${selectedPregunta.pregunta}"?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Aceptar',
                    onPress: async () => {
                        try {
                            await Axios.delete(`http://192.168.0.232:8080/api-beautypalace/preguntas/${selectedPregunta.id}`);

                            setPreguntas((prevPregunta) =>
                                prevPregunta.filter((pregunta) => pregunta.id !== selectedPregunta.id)
                            );

                            Alert.alert('Éxito', `La pregunta "${selectedPregunta.pregunta}" ha sido eliminado.`);
                            setModalDelete(false);
                            clearFields();
                            fetchPreguntas();
                        } catch (error) {
                            console.error('Error al eliminar la pregunta:', error);
                            Alert.alert('Error', 'No se pudo eliminar la pregunta. Inténtalo de nuevo más tarde.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };


    useEffect(() => {
        fetchPreguntas();
    }, []);

    const fetchPreguntas = async () => {
        try {
            const response = await Axios.get('http://192.168.0.232:8080/api-beautypalace/preguntas/');
            const { data } = response.data;
            setPreguntas(data);
        } catch (error) {
            console.error('Error al obtener las preguntas:', error);
        }
    };
    const generateId = () => {
        return Date.now().toString();
    };


    const agregarPregunta = async () => {
        try {
            const id = generateId(); 
            setIsLoading(true);
            const response = await Axios.post('http://192.168.0.232:8080/api-beautypalace/preguntas/', {
                id: id,
                pregunta: pregunta,
                respuesta: respuesta,
            });
            setModal(false);
            setIsLoading(false);
            fetchPreguntas();
            Alert.alert('Éxito', 'Pregunta agregada exitosamente');
            console.log("Registrada correctamente");
        } catch (error) {
            console.error('Error al agregar la pregunta:', error);
            Alert.alert('Error', 'No se pudo agregar la pregunta');
        }
    };

    const clearFields = () => {
        setPregunta('');
        setRespuesta('');
        setEditedPregunta('');
        setEditedRespuesta('');
        setNombrePreguntaEliminar('');
        setConfirmarEliminacion('');
    }


    const [selectedPregunta, setSelectedPregunta] = useState(null); 

    const actualizarPregunta = async () => {
        try {
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
                                setIsLoading(true);
                                const response = await Axios.put(
                                    `http://192.168.0.232:8080/api-beautypalace/preguntas/update/`,
                                    {
                                        id: selectedPregunta.id,
                                        pregunta: pregunta, 
                                        respuesta: respuesta, 
                                    }
                                );
                                console.log('Pregunta actualizada con éxito');
                                Alert.alert('Pregunta actualizada con éxito');
                                setModalDatos(false);
                                setIsLoading(false);
                                clearFields();
                                fetchPreguntas();
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
                source={require("../../../../assets/preguntas.png")}
                style={{
                    height: Dimensions.get("window").height / 2.5,
                }}>
                <View style={styles.brandView}>
                    <Text style={styles.brandViewText}></Text>
                </View>
            </ImageBackground>
            <View style={styles.bottomView}>
                <View style={styles.container}>
                    {preguntas.map((pregunta, index) => (
                        <View key={index} style={styles.cardContainer}>
                            <View style={styles.cardContent}>
                                <Text style={styles.preguntaText}>Pregunta: {pregunta.pregunta}</Text>
                                <Text style={styles.respuestaText}>Respuesta: {pregunta.respuesta}</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: "#8B4513",
                                            borderRadius: 10,
                                            paddingVertical: 7, 
                                            paddingHorizontal: 12,
                                            marginHorizontal: 5,
                                            alignItems: "center", 
                                        }}
                                        onPress={() => {
                                            setModalDatos(true);
                                            setSelectedPregunta(pregunta);
                                        }}>
                                        <Text style={{
                                            color: "white",
                                            fontSize: 15,
                                            fontWeight: "bold",
                                        }}>Modificar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: "#8B4513",
                                            borderRadius: 10,
                                            paddingVertical: 7, 
                                            paddingHorizontal: 12,
                                            marginHorizontal: 5,
                                            alignItems: "center", 
                                        }}
                                        onPress={() => {
                                            setModalDelete(true);
                                            setSelectedPregunta(pregunta);
                                        }}>
                                        <Text style={{
                                            color: "white",
                                            fontSize: 15,
                                            fontWeight: "bold",
                                        }}>ELIMINAR</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    ))}
                </View>
            </View>
            <Modal visible={modal} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#97714D" />
                            <Text style={styles.loadingText}>Cargando...</Text>
                        </View>
                    ) : (
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Agregar Pregunta</Text>

                            <TextInput
                                placeholder="Pregunta"
                                style={styles.input}
                                value={pregunta}
                                onChangeText={(text) => {
                                    setPregunta(text); setFieldsCompleted(validateFields());
                                }}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Respuesta"
                                multiline
                                scrollEnabled
                                value={respuesta}
                                onChangeText={(text) => {
                                    setRespuesta(text); setFieldsCompleted(validateFields());
                                }}
                            />
                            <View style={styles.containerColum}>
                                <TouchableOpacity style={[styles.botones, styles.agregarButton]}
                                    onPress={() => {
                                        if (fieldsCompleted) {
                                            agregarPregunta();
                                            clearFields();
                                        } else {
                                            Alert.alert('Error', 'Todos los campos son obligatorios');
                                        }
                                    }}>
                                    <Text style={{
                                        color: "white",
                                        fontSize: 15,
                                        fontWeight: "bold",
                                    }}>Agregar Pregunta</Text>
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
                    )}
                </View>
            </Modal>
            <Modal visible={modalDatos} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#97714D" />
                            <Text style={styles.loadingText}>Cargando...</Text>
                        </View>
                    ) : (
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Modificar Pregunta</Text>
                            {selectedPregunta ? (
                                <>
                                    <TextInput
                                        style={styles.input}
                                        value={pregunta} 
                                        placeholder={selectedPregunta.pregunta}
                                        multiline
                                        scrollEnabled
                                        onChangeText={(text) => {
                                            setPregunta(text);
                                            setFieldsCompleted(validateFields());
                                        }}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        value={respuesta}  
                                        placeholder={selectedPregunta.respuesta}
                                        multiline
                                        scrollEnabled
                                        onChangeText={(text) => {
                                            setRespuesta(text);
                                            setFieldsCompleted(validateFields());
                                        }}
                                    />
                                    <View style={styles.containerColum}>

                                        <TouchableOpacity
                                            style={[styles.botones, styles.agregarButton]}
                                            onPress={() => {
                                                if (fieldsCompleted) {
                                                    actualizarPregunta();
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
                    )}
                </View>

            </Modal>

            <Modal visible={modalDelete} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedPregunta ? (
                            <>
                                <Text style={styles.modalText}>Eliminar Pregunta</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre de la pregunta a eliminar"
                                    value={nombrePreguntaEliminar}
                                    onChangeText={(text) => {
                                        setNombrePreguntaEliminar(text);
                                        setFieldsCompletedEl(validateEliminate());
                                    }}
                                />
                                <Text>Es importante confirmar la cancelación, introduzca: CONFIRMAR</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="CONFIRMAR"
                                    value={confirmarEliminacion}
                                    onChangeText={(text) => {
                                        setConfirmarEliminacion(text)
                                        setFieldsCompletedEl(validateEliminate())
                                    }}

                                />

                                <View style={styles.containerColum}>
                                    <TouchableOpacity
                                        style={[styles.botones, styles.agregarButton]}
                                        onPress={() => {
                                            if (fieldsCompletedEl) {
                                                deletePregunta();
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
                                        }}>Eliminar Pregunta</Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        style={[styles.botones, styles.agregarButton]}
                                        onPress={() => {
                                            setModalDelete(false);
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

            <TouchableOpacity
                onPress={() => { setModal(true) }}
                style={{
                    backgroundColor: "#8B4513",
                    borderRadius: 10,
                    paddingVertical: 7, 
                    paddingHorizontal: 12,
                    marginHorizontal: 5,
                    alignItems: "center", 
                }}
            >
                <Text style={{
                    color: "white",
                    fontSize: 15,
                    fontWeight: "bold",
                }}>Agregar Pregunta</Text>
            </TouchableOpacity>

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
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    respuestaText: {
        fontSize: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    loadingContainer: {
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#97714D',
        fontWeight: 'bold',
    },
});
