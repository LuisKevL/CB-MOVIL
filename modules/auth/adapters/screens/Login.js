import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground, Dimensions, TextInput } from 'react-native';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import AxiosClient from '../../../../config/utils/AxiosClient';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Axios from 'axios';
import Profile from '../../../profile/adapters/screens/Profile';

const HomeScreen = ({ userData, onLogout }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenid@: {userData.name}</Text>
            <Text style={styles.text}>Apellidos: {userData.lastName}</Text>
            <Text style={styles.text}>Correo electrónico: {userData.email}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ name: '', email: '', lastName: '' });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        try {
            const response = await Axios.get('http://192.168.0.232:8080/api-beautypalace/user/clients/', {
                params: { email, password },
            });
            console.log('Inicio de sesión exitoso');

            const { data } = response.data;
            const user = data.find((user) => user.email === email);

            if (user) {
                setIsLoggedIn(true);
                setUserData({ name: user.name, lastName: user.lastName, email: user.email });
            } else {
                console.error('Usuario no encontrado');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserData({ name: '', email: '' });
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, backgroundColor: '#ffffff', width: '100%' }}>
                {isLoggedIn ? (
                    <HomeScreen userData={userData} onLogout={handleLogout} />
                ) : (
                    <>
                        <ImageBackground
                            source={require('../../../../assets/fondo.jpg')}
                            style={{ height: Dimensions.get('window').height / 2.5 }}>
                            <View style={styles.brandView}>
                                <Iconn name="spa" size={24} color="black" style={{ fontSize: 100 }} />
                                <Text style={styles.brandViewText}>Beauty Palace</Text>
                            </View>
                        </ImageBackground>
                        <View style={styles.bottomView}>
                            <View style={{ padding: 40 }}>
                                <Text style={styles.title}>Bienvenido...</Text>
                                <View style={styles.formContainer}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Email</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={styles.input}
                                                value={email}
                                                onChangeText={setEmail}
                                                placeholder="Ingrese su correo electrónico"
                                            />
                                            <Icon name="envelope" style={styles.inputIcon} />
                                        </View>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Contraseña</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={styles.input}
                                                value={password}
                                                onChangeText={setPassword}
                                                placeholder="********"
                                                secureTextEntry={!showPassword}
                                            />
                                            <TouchableOpacity onPress={togglePasswordVisibility}>
                                                <FontAwesomeIcon
                                                    icon={showPassword ? faEye : faEyeSlash}
                                                    size={20}
                                                    style={styles.inputIcon}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Text style={styles.forgotPasswordText}>Recuperar Contraseña</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.loginWithTextContainer}>
                                    <Text style={styles.loginWithText}>Loguear Con:</Text>
                                    <View style={styles.socialButtonsContainer}>
                                        <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Botón de Facebook presionado')}>
                                            <FontAwesomeIcon icon={faFacebookF} style={styles.socialIcon} />
                                            <Text style={styles.socialButtonText}>Facebook</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Botón de Google presionado')}>
                                            <FontAwesomeIcon icon={faGoogle} style={styles.socialIcon} />
                                            <Text style={styles.socialButtonText}>Google</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    logoutButton: {
        backgroundColor: '#4632A1',
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    title: {
        color: '#4632A1',
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    formContainer: {
        marginTop: 30,
    },
    inputContainer: {
        borderColor: '#4632A1',
        marginBottom: 20,
    },
    inputLabel: {
        marginBottom: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
    },
    inputIcon: {
        color: 'black',
    },
    loginButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        borderRadius: 10,
        paddingHorizontal: 16,
        backgroundColor: 'green',
        minHeight: 40,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    forgotPasswordText: {
        color: 'black',
        fontWeight: 'bold',
        marginTop: 10,
    },
    loginWithTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    loginWithText: {
        textAlign: 'center',
        color: '#4632A1',
        fontSize: 19,
        fontWeight: 'bold',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00BFFF',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 5,
    },
    socialButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    socialIcon: {
        color: 'white',
        fontSize: 20,
    },
    brandView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    brandViewText: {
        color: 'black',
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bottomView: {
        flex: 1,
        backgroundColor: '#ffffff',
        bottom: 50,
        borderTopStartRadius: 60,
        borderTopEndRadius: 60,
    },
});

export default Login;