import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import Axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const PasswordChangeScreen = () => {
    const [email, setEmail] = useState('');
    const [tokenPassword, setTokenPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false); 
    const [fieldsCompleted, setFieldsCompleted] = useState(false);
    //validar campos obligatorios
    const validateFields = () => {
        if (
            email.trim() === "" ||
            tokenPassword.trim() === "" ||
            password.trim() === ""

        ) {
            return false;
        }
        return true;
    }

    const handlePasswordChange = async () => {
        try {
            if (password !== confirmPassword) {
                Alert.alert('Error', 'Las contraseñas deben coincidir.');
                return;
            }
            // Validar contraseña
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(password)) {
                Alert.alert(
                    'Error',
                    'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.'
                );
                return;
            }
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
                            setIsLoading(true); 
                            try {
                                const response = await Axios.put('http://192.168.0.232:8080/api-beautypalace/user/tokenPassword/', requestBody);
                                Alert.alert('Contraseña cambiada exitosamente');
                                console.log('Respuesta:', response.data);
                                console.log('Fields Completed:', fieldsCompleted);
                                clearFields();
                                navigation.navigate('loginStack');
                            } catch (error) {
                                Alert.alert('Error al cambiar contraseña', error.message);
                            }
                            setIsLoading(false);
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            Alert.alert('Error al cambiar contraseña', error.message);
        }
    };


    const clearFields = () => {
        setEmail('');
        setTokenPassword('');
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <View style={{ marginTop: 30 }}>
            <View style={styles.modalContainer}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <View style={styles.loadingBox}>
                            <ActivityIndicator size="large" color="#97714D" />
                            <Text style={styles.loadingText}>Cambiando contraseña...</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.modalContent}>

                        <TextInput
                            placeholder="Correo electrónico"
                            value={email}
                            onChangeText={(text) => { setEmail(text); setFieldsCompleted(validateFields()) }}
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
                            onChangeText={(text) => { setPassword(text); setFieldsCompleted(validateFields()) }}
                            secureTextEntry={true}
                            style={styles.modal}

                        />

                        <TextInput
                            placeholder="Repetir contraseña"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={true}
                            style={styles.modal}

                        />
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 15,
                        }}>
                            <TouchableOpacity style={styles.Contra} onPress={() => {
                                if (fieldsCompleted) {
                                    handlePasswordChange(); 
                                } else {
                                    Alert.alert("Por favor, llene todos los campos")
                                }
                            }}>
                                <Text style={styles.contraText}>Cambiar contraseña</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
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
    },
    Contra: {
        backgroundColor: '#8B4513',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    contraText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: "center"
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo semi-transparente
    },
    loadingBox: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },

})
export default PasswordChangeScreen;
