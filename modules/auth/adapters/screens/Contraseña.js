import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Axios from 'axios';

const PasswordChangeScreen = () => {
    const [email, setEmail] = useState('');
    const [tokenPassword, setTokenPassword] = useState('');
    const [password, setPassword] = useState('');

    const handlePasswordChange = async () => {
        try {
            const requestBody = {
                email,
                tokenPassword,
                password,
            };

            Alert.alert(
                'Confirmación',
                '¿Estás seguro de realizar esta acción?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Aceptar',
                        onPress: async () => {
                            const response = await Axios.put('http://192.168.0.232:8080/api-beautypalace/user/tokenPassword/', requestBody);
                            Alert.alert('Contraseña cambiada exitosamente');
                            console.log('Respuesta:', response.data);

                            // Realiza cualquier acción adicional después de cambiar la contraseña
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            Alert.alert('Error al cambiar contraseña', error.message);
        }
    };


    return (
        <View style={{ marginTop: 30 }}>
            <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={styles.modal}
            />
            <TextInput
                placeholder="Token Recibido"
                value={tokenPassword}
                onChangeText={setTokenPassword}
                style={styles.modal}

            />
            <TextInput
                placeholder="Nueva contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                style={styles.modal}

            />
            <Button title="Cambiar Contraseña" onPress={handlePasswordChange} />
        </View>
    );
};

styles = StyleSheet.create({
    modal: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    }
})
export default PasswordChangeScreen;
