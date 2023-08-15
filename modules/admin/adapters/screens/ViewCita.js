import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions, Modal, TextInput, Button, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import Axios from 'axios';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewCita = () => {
    //modal cancelar cita
    const [cancelModal, setCancelModal] = useState(false);
    const [nombreCitaEliminar, setNombreCitaEliminar] = useState('');
    const [confirmarEliminacion, setConfirmarEliminacion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cargar, setCargar] = useState(false);

    const deleteCita = async () => {
        if (!nombreCitaEliminar.trim()) {
            Alert.alert('Error', 'Por favor ingrese el nombre de la cita a cancelar.');
            return;
        }

        if (confirmarEliminacion.trim() !== 'CONFIRMAR') {
            Alert.alert('Error', 'Por favor ingrese "CONFIRMAR" para cancelar la cita.');
            return;
        }

        const citaToDelete = citaData.find((cita) => cita.name === nombreCitaEliminar);

        if (!citaToDelete) {
            Alert.alert('Error', 'No se encontró ninguna cita con ese nombre.');
            return;
        }

        Alert.alert(
            'Confirmación',
            `¿Estás seguro de cancelar la cita "${nombreCitaEliminar}"?`,
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
                            await Axios.delete(`http://192.168.0.232:8080/api-beautypalace/agenda/${citaToDelete.id}`);
                            setCitaData((prevCitaData) => prevCitaData.filter((cita) => cita.id !== citaToDelete.id));
                            Alert.alert('Éxito', `La cita "${nombreCitaEliminar}" ha sido cancelada.`);
                            setNombreCitaEliminar(''); // Limpia el TextInput después de eliminar la cita.
                            setConfirmarEliminacion(''); // Limpia el TextInput después de eliminar la cita.
                            setCancelModal(false);
                            setIsLoading(false);
                        } catch (error) {
                            console.error('Error al eliminar la cita:', error);
                            Alert.alert('Error', 'No se pudo eliminar la cita. Inténtalo de nuevo más tarde.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const resetModal = () => {
        setNombreCitaEliminar('');
        setConfirmarEliminacion('');
    }
    //---------------
    const [citaData, setCitaData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nombreCita, setNombreCita] = useState('');
    const [nombreCliente, setNombreCliente] = useState('');
    const [tipoServicio, setTipoServicio] = useState('');
    const [day, setDay] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [currentCita, setCurrentCita] = useState(null);

    const [branch, setBranch] = useState('');

    const [fieldsCompleted, setFieldsCompleted] = useState(false);
    const validateFields = () => {
        if (
            nombreCita.trim() === "" ||
            nombreCliente.trim() === "" ||
            tipoServicio.trim() === "" ||
            day.trim() === "" ||
            horaInicio.trim() === "" ||
            horaFin.trim() === "" ||
            branch.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get('http://192.168.0.232:8080/api-beautypalace/agenda/');
                const { data } = response.data;
                setCitaData(data);
            } catch (error) {
                console.error('Error fetching cita data:', error);
            }
        };

        fetchData();
    }, []);

    const handleUpdateCita = (cita) => {
        setCurrentCita(cita);
        setNombreCita(cita.name);
        setNombreCliente(cita.nameClient);
        setTipoServicio(cita.typeOfService);
        setDay(cita.day);
        setHoraInicio(cita.startTime);
        setHoraFin(cita.timeEnd);
        setBranch(cita.branch);
        setModalVisible(true);
    };

    const cambiaDatos = async () => {
        Alert.alert(
            'Confirmación',
            '¿Estás seguro de realizar los cambios?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Aceptar',
                    onPress: async () => {
                        try {
                            setCargar(true);
                            await Axios.put(`http://192.168.0.232:8080/api-beautypalace/agenda/update/`, {
                                id: currentCita.id,
                                name: nombreCita,
                                nameClient: nombreCliente,
                                typeOfService: tipoServicio,
                                day: day,
                                startTime: horaInicio,
                                timeEnd: horaFin,
                                branch: branch,
                            });

                            console.log("Cambio de datos exitoso");
                            setModalVisible(false);
                            setCargar(false);
                            const updatedCitaData = citaData.map((c) => {
                                if (c.id === currentCita.id) {
                                    return {
                                        ...c,
                                        name: nombreCita,
                                        nameClient: nombreCliente,
                                        typeOfService: tipoServicio,
                                        day: day,
                                        startTime: horaInicio,
                                        timeEnd: horaFin,
                                        branch: branch,
                                    };
                                } else {
                                    return c;
                                }
                            });
                            setCitaData(updatedCitaData);
                            Alert.alert('Éxito', 'Los datos de la cita han sido actualizados.');
                        } catch (error) {
                            console.log("Error al cambiar los datos", error.message);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#ffffff', width: '100%' }} showsVerticalScrollIndicator={false}>
            <ImageBackground source={require('../../../../assets/agenda.png')} style={{ height: Dimensions.get('window').height / 2.5 }}>
                <View style={styles.brandView}>
                    <Text style={styles.brandViewText}></Text>
                </View>
            </ImageBackground>
            <View style={styles.bottomView}>
                <View style={{ padding: 40 }}>
                    <View style={{ marginTop: 15 }}>
                        {/* Renderiza los datos de la cita aquí */}
                        {citaData.map((cita) => (
                            <View key={cita.id} style={styles.cardContainer}>
                                <Text style={styles.label}>Nombre de la cita:</Text>
                                <Text>{cita.name}</Text>

                                <View style={styles.rowContainer}>
                                    <View style={styles.columnContainer}>
                                        <Text style={styles.label}>Nombre del cliente:</Text>
                                        <Text>{cita.nameClient}</Text>
                                    </View>

                                    <View style={styles.columnContainer}>
                                        <Text style={styles.label}>Tipo de servicio:</Text>
                                        <Text>{cita.typeOfService}</Text>
                                    </View>
                                </View>

                                <View style={styles.rowContainer}>
                                    <View style={styles.columnContainer}>
                                        <Text style={styles.label}>Dia cita:</Text>
                                        <Text>{cita.day}</Text>
                                    </View>

                                    <View style={styles.columnContainer}>
                                        <Text style={styles.label}> Inicio: </Text>
                                        <Text>{cita.startTime}</Text>
                                    </View>

                                    <View style={styles.columnContainer}>
                                        <Text style={styles.label}> Fin:</Text>
                                        <Text>{cita.timeEnd}</Text>
                                    </View>
                                    <View style={styles.columnContainer}>
                                        <Text style={styles.label}>Sucursal</Text>
                                        <Text>{cita.branch}</Text>
                                    </View>
                                    <View style={styles.rowContainer}>


                                    </View>
                                </View>

                                <View style={styles.buttonContainer}>

                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            backgroundColor: "#8B4513",
                                            borderRadius: 10,
                                            paddingVertical: 5,
                                            paddingHorizontal: 16,
                                            marginHorizontal: 5,
                                            alignItems: "center", // Añade esta propiedad para centrar el contenido horizontalmente
                                        }}
                                        onPress={() => setCancelModal(true)}
                                    >
                                        <Text
                                            style={{
                                                color: "white",
                                                fontSize: 15,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            CANCELAR
                                        </Text>
                                    </TouchableOpacity>
                                    <View>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            width: "100%",
                                            flex: 1,
                                            backgroundColor: "#8B4513",
                                            borderRadius: 10,
                                            paddingVertical: 5,
                                            paddingHorizontal: 16,
                                            marginHorizontal: 5,
                                            alignItems: "center", // Añade esta propiedad para centrar el contenido horizontalmente
                                        }}
                                        onPress={() => handleUpdateCita(cita)}
                                    >
                                        <Text
                                            style={{
                                                color: "white",
                                                fontSize: 14,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            ACTUALIZAR
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <View style={{
                flex: 1,
                padding: 60,
            }}>
                <Modal
                    visible={cancelModal} animationType="slide" transparent={true}
                    onRequestClose={() => setCancelModal(false)}
                    style={{ flex: 1, width: '100%', borderWidth: 2, borderColor: 'red' }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Cancelar Cita</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre de la cita a eliminar"
                                value={nombreCitaEliminar}
                                onChangeText={(text) => setNombreCitaEliminar(text)}
                            />
                            <Text>Es importante confirmar la cancelación, introduzca: CONFIRMAR</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="CONFIRMAR"
                                value={confirmarEliminacion}
                                onChangeText={(text) => setConfirmarEliminacion(text)}

                            />
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#97714D" />
                                    <Text style={styles.loadingText}>Cargando...</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 10,
                                            backgroundColor: '#8B4513',
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginHorizontal: 5,
                                            borderWidth: 1,
                                            borderColor: '#8B4513',
                                        }}
                                        onPress={() => {
                                            deleteCita();

                                        }}
                                    >
                                        {/* Envuelve la cadena de texto en un componente Text */}
                                        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>
                                            eliminar
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 10,
                                            backgroundColor: '#8B4513',
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginHorizontal: 5,
                                            borderWidth: 1,
                                            borderColor: '#8B4513',
                                        }}
                                        onPress={() => { resetModal(); setCancelModal(false); }} >
                                        <Text
                                            style={{
                                                color: "white",
                                                fontSize: 18,
                                                fontWeight: "bold",
                                                marginLeft: 8,
                                            }}
                                        >
                                            cancelar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={{
                flex: 1,
                padding: 20,
            }}>
                <Modal
                    visible={modalVisible} animationType="slide" transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                    style={{ flex: 1, width: '100%', borderWidth: 2, borderColor: 'red' }}

                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Actualizar Cita</Text>
                            {/* Campos de datos para modificar */}
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre de la cita"
                                value={nombreCita}
                                onChangeText={(text) => {
                                    setNombreCita(text);
                                    setFieldsCompleted(validateFields());
                                }}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Nombre del cliente"
                                value={nombreCliente}
                                onChangeText={(text) => {
                                    setNombreCliente(text);
                                    setFieldsCompleted(validateFields());
                                }}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Tipo de servicio"
                                value={tipoServicio}
                                onChangeText={(text) => {
                                    setTipoServicio(text);
                                    setFieldsCompleted(validateFields());
                                }}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Día de la cita"
                                value={day}
                                onChangeText={(text) => {
                                    setDay(text);
                                    setFieldsCompleted(validateFields());
                                }}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Hora de inicio"
                                value={horaInicio}
                                onChangeText={(text) => {
                                    setHoraInicio(text)
                                    setFieldsCompleted(validateFields());
                                }}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Hora de fin"
                                value={horaFin}
                                onChangeText={(text) => {
                                    setHoraFin(text)
                                    setFieldsCompleted(validateFields());
                                }}
                            />

                            {/* Botón para guardar los cambios */}
                            {cargar ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#97714D" />
                                    <Text style={styles.loadingText}>Cargando...</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.cancelButton]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.buttonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.saveButton]}
                                        onPress={() => {
                                            if (fieldsCompleted) {
                                                cambiaDatos();
                                            } else {
                                                Alert.alert('Error', 'Por favor llene todos los campos');
                                            }
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Guardar cambios</Text>
                                    </TouchableOpacity>
                                </View>
                            )}


                            {/* Botón para guardar los cambios */}

                        </View>
                    </View>

                </Modal>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    brandView: {
        alignItems: 'center',
        marginTop: 80,
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
    cardContainer: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        marginBottom: 20,
        borderRadius: 10,
        width: "100%", // Aumenta este valor para agregar más altura al contenedor
    },

    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    columnContainer: {
        flex: 1,
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    agendarButton: {
        backgroundColor: '#8B4513',
    },
    actualizarButton: {
        backgroundColor: '#8B4513',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Cambiar la opacidad a un valor más bajo
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
    button: {
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    saveButton: {
        backgroundColor: '#8B4513',
    },
    cancelButton: {
        backgroundColor: '#8B4513',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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

export default ViewCita;
