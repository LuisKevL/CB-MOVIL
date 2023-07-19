import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Dimensions,
    Alert,
    ActivityIndicator,
} from "react-native";
import Iconn from "react-native-vector-icons/MaterialIcons";
import Axios from "axios";

export default function Consejos() {
    const [consejos, setConsejos] = useState([]);

    useEffect(() => {
        fetchConsejos();
    }, []);

    const fetchConsejos = async () => {
        try {
            const response = await Axios.get('http://192.168.0.232:8080/api-beautypalace/consejos/');
            const { data } = response.data;
            setConsejos(data);
        } catch (error) {
            console.error('Error al obtener los consejos:', error);
        }
    };


    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }}
            showsVerticalScrollIndicator={false}>
            <ImageBackground
                source={require("../../../../assets/fondo.png")}
                style={{
                    height: Dimensions.get("window").height / 2.5,
                    marginTop: -80,
                }}>
                <View style={styles.brandView}>
                    <Iconn name="spa" size={24} color="black" style={{ fontSize: 100 }} />

                    <Text style={styles.brandViewText}>Consejos</Text>
                </View>
            </ImageBackground>
            <View style={styles.bottomView}>
                <View style={styles.container}>
                    {consejos.map((consejos, index) => (
                        <View key={index} style={styles.cardContainer}>
                            <View style={styles.cardContent}>
                                <Text style={styles.preguntaText}>{consejos.titulo}</Text>
                                <Text style={styles.respuestaText}>{consejos.consejo}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    brandView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    brandViewText: {
        color: "black",
        fontSize: 50,
        fontWeight: "bold",
        textAlign: "center",
    },
    bottomView: {
        flex: 1,
        backgroundColor: "#ffffff",
        bottom: 50,
        borderTopStartRadius: 60,
        borderTopEndRadius: 60,
    },
    button: {
        backgroundColor: "#4632A1",
        borderRadius: Dimensions.get("window").width / 2,
        paddingVertical: 8,
        paddingHorizontal: 8,
        alignItems: "center",
        marginTop: 50,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#00BFFF",
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 5,
    },

    cardContainer: {
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    cardContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        padding: 20,
    },
    preguntaText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    respuestaText: {
        fontSize: 16,
    },
});
