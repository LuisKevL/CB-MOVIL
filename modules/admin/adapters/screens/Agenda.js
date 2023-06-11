import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions, Modal, TextInput, Button, Alert } from 'react-native';
import Axios from 'axios';
import Iconn from 'react-native-vector-icons/MaterialIcons';
export default function Agenda() {
    const [citaData, setCitaData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get('http://192.168.0.232:8080/api-beautypalace/cita/');
                const { data } = response.data;
                setCitaData(data);
            } catch (error) {
                console.error('Error fetching cita data:', error);
            }
        };

        fetchData();
    }, []);
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
                                <Text style={styles.label}>ID:</Text>
                                <Text>{cita.id}</Text>

                                <View style={styles.rowContainer}>
                                    <View style={styles.columnContainer}>
                                        <Text style={styles.label}>dayAndHour:</Text>
                                        <Text>{cita.dayAndHour}</Text>
                                    </View>

                                    <View style={styles.columnContainer}>
                                        <Text style={styles.label}>typeOfService:</Text>
                                        <Text>{cita.typeOfService}</Text>
                                    </View>
                                </View>

                                <View style={styles.rowContainer}>
                                    <View style={styles.columnContainer}>
                                        <Text style={styles.label}>user_id:</Text>
                                        <Text>{cita.user_id}</Text>
                                    </View>
                                </View>

                                <View style={styles.buttonContainer}>
                                    <Button
                                        buttonStyle={[styles.button, styles.agendarButton]}
                                        title='Agendar Cita'
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

        </ScrollView>
    )
}

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
    columnContainer: {
        flex: 1,
        marginRight: 10,
    },
    buttonContainer: {
        justifyContent: 'space-between',
        marginTop: 20,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})