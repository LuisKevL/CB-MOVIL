import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions, Modal, TextInput, Button, Alert } from 'react-native';
import Axios from 'axios';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewCita = () => {
    const [citaData, setCitaData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nombreCita, setNombreCita] = useState('');
    const [nombreCliente, setNombreCliente] = useState('');
    const [tipoServicio, setTipoServicio] = useState('');
    const [day, setDay] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [currentCita, setCurrentCita] = useState(null);

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
                            await Axios.put(`http://192.168.0.232:8080/api-beautypalace/agenda/update/`, {
                                id: currentCita.id,
                                name: nombreCita,
                                nameClient: nombreCliente,
                                typeOfService: tipoServicio,
                                day: day,
                                startTime: horaInicio,
                                timeEnd: horaFin,
                            });

                            console.log("Cambio de datos exitoso");
                            setModalVisible(false);

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
                                    };
                                } else {
                                    return c;
                                }
                            });
                            setCitaData(updatedCitaData);

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
            <ImageBackground source={require('../../../../assets/fondo.png')} style={{ height: Dimensions.get('window').height / 2.5 }}>
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
                                        <Text style={styles.label}>Dia de la cita:</Text>
                                        <Text>{cita.day}</Text>
                                    </View>

                                    <View style={styles.columnContainer}>
                                        <Text style={styles.label}> Hora Inicio: </Text>
                                        <Text>{cita.startTime}</Text>
                                    </View>

                                    <View style={styles.columnContainer}>
                                        <Text style={styles.label}> Hora fin:</Text>
                                        <Text>{cita.timeEnd}</Text>
                                    </View>
                                </View>

                                <View style={styles.buttonContainer}>

                                    <Button
                                        buttonStyle={[styles.button, styles.actualizarButton]}
                                        title='Eliminar Cita'
                                        onPress={() => handleUpdateCita(cita)}
                                    />
                                    <Button
                                        buttonStyle={[styles.button, styles.actualizarButton]}
                                        title='Actualizar Cita'
                                        onPress={() => handleUpdateCita(cita)}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Actualizar Cita</Text>

                        {/* Campos de datos para modificar */}
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de la cita"
                            value={nombreCita}
                            onChangeText={text => setNombreCita(text)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del cliente"
                            value={nombreCliente}
                            onChangeText={text => setNombreCliente(text)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Tipo de servicio"
                            value={tipoServicio}
                            onChangeText={text => setTipoServicio(text)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Día de la cita"
                            value={day}
                            onChangeText={text => setDay(text)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Hora de inicio"
                            value={horaInicio}
                            onChangeText={text => setHoraInicio(text)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Hora de fin"
                            value={horaFin}
                            onChangeText={text => setHoraFin(text)}
                        />

                        {/* Botón para guardar los cambios */}
                        <Button
                            buttonStyle={[styles.button, styles.saveButton]}
                            title='Guardar Cambios'
                            onPress={cambiaDatos}
                        />

                        <Button
                            buttonStyle={[styles.button, styles.cancelButton]}
                            title='Cancelar'
                            onPress={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
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
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
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
    button: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    agendarButton: {
        backgroundColor: '#1c9c9c',
    },
    actualizarButton: {
        backgroundColor: '#a32f2f',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    saveButton: {
        backgroundColor: '#1c9c9c',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#a32f2f',
        marginTop: 10,
    },
});

export default ViewCita;
