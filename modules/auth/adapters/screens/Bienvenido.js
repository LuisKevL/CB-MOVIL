// WelcomeScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Bienvenido = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Client'); // Navegar a la pantalla "Client" después de 3 segundos
        }, 3000); // 3000 milisegundos (3 segundos)

        return () => clearTimeout(timer); // Limpiar el temporizador al desmontar el componente
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>¡Pantalla de Bienvenido!</Text>

            <Text style={styles.text}>¡Bienvenido!</Text>

            <Text style={styles.text}>¡Bienvenido!</Text>
            <Text style={styles.text}>¡Bienvenido!</Text>
            <Text style={styles.text}>¡Bienvenido!</Text>
            <Text style={styles.text}>¡Bienvenido!</Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default Bienvenido;
