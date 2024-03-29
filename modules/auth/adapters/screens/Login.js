import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator, Dimensions, TextInput, Button, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Axios from 'axios';
import Profile from '../../../profile/adapters/screens/Profile';
import Token from './Token';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = (props) => {
    const horario = " 8 a. m. - 6 p. m.";
    //navigation
    const { navigation } = props;
    //modal y email
    const [modalVisible, setModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ name: '', email: '', lastName: '', id: '' });
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    //FUNCION PARA PODER HACER EL LOGIN
    const handleLogin = async () => {
        try {
            setIsLoading(true);
            const clientsResponse = await Axios.get('http://192.168.0.232:8080/api-beautypalace/user/clients/', {
                params: { email },
            });
            const adminsResponse = await Axios.get('http://192.168.0.232:8080/api-beautypalace/user/admins/', {
                params: { email },
            });
            const clientsData = clientsResponse.data.data;
            const adminsData = adminsResponse.data.data;

            const client = clientsData.find((user) => user.email === email);
            const admin = adminsData.find((user) => user.email === email);

            if (client) {
                if (client.password === password) {
                    await AsyncStorage.setItem('userId', client.id.toString());
                    await AsyncStorage.setItem('userName', client.name);
                    await AsyncStorage.setItem('userLastName', client.lastName);
                    await AsyncStorage.setItem('userEmail', client.email);
                    await AsyncStorage.setItem('userPassword', client.password);
                    await AsyncStorage.setItem('typeOfUser', client.typeOfUser);
                    console.log('Inicio de sesión exitoso');

                    navigation.navigate('Client', {
                        name: client.name,
                        lastName: client.lastName,
                        email: client.email,
                        id: client.id,
                    });

                    setUserData({
                        name: client.name,
                        lastName: client.lastName,
                        email: client.email,
                        id: client.id,
                    });
                } else {
                    Alert.alert("Contraseña y/o correo invalidos")

                }
            } else if (admin) {
                if (admin.password === password) {
                    await AsyncStorage.setItem('userId', admin.id.toString());
                    await AsyncStorage.setItem('userName', admin.name);
                    await AsyncStorage.setItem('userLastName', admin.lastName);
                    await AsyncStorage.setItem('userEmail', admin.email);
                    await AsyncStorage.setItem('userPassword', admin.password);
                    await AsyncStorage.setItem('typeOfUser', admin.typeOfUser);
                    console.log('Inicio de sesión exitoso');

                    navigation.navigate('Admin', {
                        name: admin.name,
                        lastName: admin.lastName,
                        email: admin.email,
                    });
                } else {
                    Alert.alert("Contraseña y/o correo invalidos")
                }
            } else {
                Alert.alert("Cliente no encontrado");
            }
            setIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error('Correo o contraseña no encontrados');
            } else {
                console.error('Error al iniciar sesión:', error.message);
                Alert.alert("Error al iniciar sesión")
            }
        }
    };



    //////////////////////////////////////////////////////////////////////////////////////

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('isLoggedIn');
            await AsyncStorage.removeItem('userData');
            console.log('Cierre de sesión exitoso');
        } catch (error) {
            console.error('Error al cerrar sesión:', error.message);
        }
    };


    return (
        <View style={styles.containerr}>

            <ScrollView style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, backgroundColor: '#ffffff', width: '100%' }}>
                    {isLoggedIn ? (
                        <Profile name={userData.name} lastName={userData.lastName} email={userData.email} password={userData.password} id={userData.id} handleLogout={handleLogout} />
                    ) : (
                        <>
                            <ImageBackground
                                source={require('../../../../assets/login.png')}
                                style={{ height: Dimensions.get('window').height / 2.5 }}>
                                <View style={styles.brandView}>
                                    <Text style={styles.brandViewText}></Text>
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

                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                                            </TouchableOpacity>


                                            <TouchableOpacity style={styles.registreButton} onPress={() => navigation.navigate('Registro')}>
                                                <Text style={styles.loginButtonText}>Registrar Cliente</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* modal -------------------------------------------------------------------------- */}
                                        <View style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            alignSelf: 'center', 
                                            backgroundColor: '#8B4513',
                                            borderRadius: 5,
                                            marginTop: 10,
                                            width: 200,
                                            height: 25,
                                        }}>
                                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                                <Text style={styles.forgotPasswordText}>Recuperar Contraseña</Text>
                                            </TouchableOpacity>

                                            <Token modalVisible={modalVisible} setModalVisible={setModalVisible} />
                                        </View>

                                        <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                marginBottom: 15,
                                            }}>Horario de Trabajo: {horario}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#97714D" />
                        <Text style={styles.loadingText}>Iniciando sesión...</Text>
                    </View>
                </View>
            )}
        </View>
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
        color: '#97714D',
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
        color: '#130F0E',
        fontWeight: 'bold',
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
        backgroundColor: '#8B4513',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    registreButton: {
        backgroundColor: '#8B4513',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
    admin: {
        backgroundColor: 'green',
        padding: 3,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        width: "50%",
        marginTop: 10,
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: "center"
    },
    forgotPasswordText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: "center"
    },
    loginWithTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
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
    modalContainer: {
        flex: 1,
        height: '100%',

        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: 20,
        borderRadius: 10,
        width: '80%',
        height: '100%',

    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    modalCloseText: {
        color: 'blue',
        marginTop: 10,
    },

    loadingText: {
        marginTop: 10,
        color: '#97714D',
        fontWeight: 'bold',
    },
    containerr: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#ffffff', 
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    loadingBox: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
});

export default Login;