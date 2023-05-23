import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
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

            const response = await Axios.put('http://192.168.0.232:8080/api-beautypalace/user/tokenPassword/', requestBody);
            console.log('Contraseña cambiada exitosamente');
            console.log('Respuesta:', response.data);

            // Realiza cualquier acción adicional después de cambiar la contraseña
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error.message);
        }
    };

    return (
        <View style={{ marginTop: 30 }}>
            <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Token"
                value={tokenPassword}
                onChangeText={setTokenPassword}
            />
            <TextInput
                placeholder="Nueva contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <Button title="Cambiar Contraseña" onPress={handlePasswordChange} />
        </View>
    );
};

export default PasswordChangeScreen;
