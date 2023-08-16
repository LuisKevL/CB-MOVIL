import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';

const Bienvenido = ({ navigation }) => {
    const navigationRef = useRef(navigation);

    useEffect(() => {
        console.log('Temporizador configurado');
    
        const timer = setTimeout(() => {
            console.log('Navegando a "Client"');
            navigationRef.current.navigate('Client');
        }, 60000);
    
        return () => {
            console.log('Limpiando temporizador');
            clearTimeout(timer);
        };
    }, []);
    

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../../assets/bienvenidos.png')}
                style={styles.gif}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gif: {
        flex: 1,
        width: 400, // Cambia el ancho para que el GIF cubra toda la pantalla
        height: 700, // Cambia la altura para que el GIF cubra toda la pantalla
    },
});

export default Bienvenido;
