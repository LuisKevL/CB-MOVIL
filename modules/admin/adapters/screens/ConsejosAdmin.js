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
    const [modalDelete, setModalDelete] = useState(false)
    const [selectedConsejo, setSelectedConsejo] = useState(null); // Agregar esta línea
    const [titulo, setTitulo] = useState("");
    const [consejo, setConsejo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
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

    const [nombreConsejoEliminar, setNombreConsejoEliminar] = useState('');
    const [confirmarEliminacion, setConfirmarEliminacion] = useState('');

    const deleteConsejo = async () => {
        if (!selectedConsejo) {
            Alert.alert('Error', 'Selecciona el consejo a eliminar.');
            return;
        }
        if (confirmarEliminacion.trim() !== 'CONFIRMAR') {
            Alert.alert('Error', 'Por favor ingresa "CONFIRMAR" para eliminar el consejo.');
            return;
        }

        const consejoDelete = consejos.find((consejo) => consejo.titulo === nombreConsejoEliminar);

        if (!consejoDelete) {
            Alert.alert('Error', 'No se encontró ninguna cita con ese nombre.');
            return;
        }

        Alert.alert(
            'Confirmación',
            `¿Estás seguro de eliminar el consejo "${selectedConsejo.titulo}"?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Aceptar',
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            await Axios.delete(`http://192.168.0.232:8080/api-beautypalace/consejos/${selectedConsejo.id}`);

                            setConsejos((prevConsejo) =>
                                prevConsejo.filter((titulo) => titulo.id !== selectedConsejo.id)
                            );

                            Alert.alert('Éxito', `El consejo "${selectedConsejo.titulo}" ha sido eliminado.`);
                            setModalDelete(false); // Cierra el modal
                            fetchConsejos(); // Actualizar la lista de consejos
                            clearFields(); // Limpiar los campos
                            setIsLoading(false);
                        } catch (error) {
                            console.error('Error al eliminar el consejo:', error);
                            Alert.alert('Error', 'No se pudo eliminar el consejo. Inténtalo de nuevo más tarde.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };




    const generateId = () => {
        // Generar un ID único utilizando la fecha actual
        return Date.now().toString();
    };

    const agregarConsejo = async () => {
        try {
            const id = generateId(); // Generar el ID automáticamente
            setIsLoading(true);
            const response = await Axios.post('http://192.168.0.232:8080/api-beautypalace/consejos/', {
                id: id,
                titulo: titulo,
                consejo: consejo,
            });
            setModal(false);
            setIsLoading(false);
            fetchConsejos();
            clearTitulo();
            Alert.alert("Exito", "Consejo agregado exitosamente");
            console.log("Registrado correctamente");
        } catch (error) {
            Alert.alert("Error", "No se pudo agregar el consejo");
            console.error("Error al agregar el consejo:", error);
        }
    }

    const clearFields = () => {
        setSelectedConsejo('');
        setConfirmarEliminacion('');
        setNombreConsejoEliminar('');
        setTitulo('');
        setConsejo('');
    };

    const clearTitulo = () => {
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
            Alert.alert(
                'Confirmar Actualización',
                '¿Estás seguro de actualizar el consejo?',
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
                                    `http://192.168.0.232:8080/api-beautypalace/consejos/update/`,
                                    {
                                        id: selectedConsejo.id,
                                        titulo: titulo,
                                        consejo: consejo,
                                    }
                                );

                                console.log('Consejo actualizado con éxito');
                                Alert.alert('Consejo actualizado con éxito');
                                setModalDatos(false);
                                setIsLoading(true);
                                fetchConsejos();
                                clearAct();
                            } catch (error) {
                                console.error('Error al actualizar consejo:', error);
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error al mostrar la alerta de confirmación:', error);
        }
    };

    const clearAct = () => {
        setTitulo('');
        setConsejo('');
    }
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }}
            showsVerticalScrollIndicator={false}>
            <ImageBackground
                source={require("../../../../assets/consejos.png")}
                style={{
                    height: Dimensions.get("window").height / 2.5,
                }}>
                <View style={styles.brandView}>
                    <Text style={styles.brandViewText}></Text>
                </View>
            </ImageBackground>
            <View style={styles.bottomView}>
                <View style={styles.container}>
                    {consejos.map((consejos, index) => (
                        <View key={index} style={styles.cardContainer}>
                            <View style={styles.cardContent}>
                                <Text style={styles.preguntaText}>{consejos.titulo}</Text>
                                <Text style={styles.respuestaText}>{consejos.consejo}</Text>
                                <View style={styles.buttonContainer}>
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
                                        }}>Actualizar</Text>
                                    </TouchableOpacity>

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
                                            setModalDelete(true);
                                            setSelectedConsejo(consejos);
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
                            <Text style={styles.modalText}>Agregar consejo</Text>
                            <TextInput
                                style={styles.input}
                                value={titulo}
                                placeholder="agrega el titulo"
                                multiline
                                onChangeText={(text) => {
                                    setTitulo(text);
                                    setFieldsCompleted(validateFields());
                                }}
                            />
                            <TextInput
                                style={styles.input}
                                value={consejo}
                                placeholder="Agrega el consejo"
                                scrollEnabled
                                multiline
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
                                            clearTitulo();
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
                                    onPress={() => { setModal(false); clearTitulo(); }}>
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
                            <Text style={styles.modalText}>Modificar Consejo</Text>
                            {selectedConsejo ? (
                                <>
                                    <TextInput
                                        style={styles.input}
                                        value={titulo}
                                        placeholder={selectedConsejo.titulo}
                                        onChangeText={(text) => {
                                            setTitulo(text);
                                        }}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        value={consejo}
                                        placeholder={selectedConsejo.consejo}
                                        onChangeText={(text) => {
                                            setConsejo(text);
                                        }}
                                    />

                                    <View style={styles.containerColum}>
                                        <TouchableOpacity
                                            style={[styles.botones, styles.agregarButton]}
                                            onPress={() => {
                                                actualizarConsejo();
                                                setModalDatos(false);
                                                clearAct();

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
                                                clearAct();

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
                                        clearAct();
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
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#97714D" />
                            <Text style={styles.loadingText}>Cargando...</Text>
                        </View>
                    ) : (
                        <View style={styles.modalContent}>
                            {selectedConsejo ? (
                                <>
                                    <Text style={styles.modalText}>Eliminar Consejo</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nombre de la pregunta a eliminar"
                                        value={nombreConsejoEliminar}
                                        onChangeText={(text) => {
                                            setNombreConsejoEliminar(text);
                                        }}
                                    />
                                    <Text>Es importante confirmar la cancelación, introduzca: CONFIRMAR</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="CONFIRMAR"
                                        value={confirmarEliminacion}
                                        onChangeText={(text) => {
                                            setConfirmarEliminacion(text);
                                        }}
                                    />


                                    <View style={styles.containerColum}>
                                        <TouchableOpacity
                                            style={[styles.botones, styles.agregarButton]}
                                            onPress={() => {
                                                deleteConsejo();
                                                setModalDelete(false);


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

                <TouchableOpacity
                    onPress={() => { setModal(true); }}
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
                    }}>Agregar Consejo</Text>
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
