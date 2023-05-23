import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import Axios from 'axios';

const Token = () => {
    const [email, setEmail] = useState('');

    const handlePasswordRecovery = async () => {
        try {
            await Axios.put(`http://192.168.0.232:8080/api-beautypalace/user/token/`, { email });
            console.log('Token enviado exitosamente');
        } catch (error) {
            console.error('Error al enviar el Token:', error.message);
        }
    };

    return (
        <View style={{ marginTop: 30 }}>
            <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
            />
            <Button title="Recuperar Contraseña" onPress={handlePasswordRecovery} />
        </View>
    );
};

export default Token;
