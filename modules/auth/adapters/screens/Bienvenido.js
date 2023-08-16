import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';

const Bienvenido = ({ navigation }) => {
    const navigationRef = useRef(navigation);

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('Navegando a "Client"');
            navigationRef.current.navigate('Client');
        }, 10000);
    
        return () => {
            clearTimeout(timer);
        };
    }, []);
    

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../../assets/bienvenido.gif')}
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
        width: 400,
        height: 700, 
    },
});

export default Bienvenido;
