import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, Alert, FlatList, Text, Image } from 'react-native';
import Axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebaseConfig from '../../../admin/adapters/screens/firebase'; // Archivo de configuración de Firebase
// Inicializar la aplicación de Firebase
const storage = getStorage(firebaseConfig);

const ProductosClient = () => {
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modal, setModal] = useState(false);
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetchImagesFromStorage();
        fetchProductos();
    }, []);

    const fetchImagesFromStorage = async () => {
        try {
            const imagesListRef = ref(storage, 'productos/');
            const response = await listAll(imagesListRef);

            const urls = await Promise.all(
                response.items.map(async (item) => {
                    const downloadUrl = await getDownloadURL(item);
                    return downloadUrl;
                })
            );

            setImageUrls(urls);
        } catch (error) {
            console.error('Error al obtener las imágenes:', error);
        }
    };

    const fetchProductos = async () => {
        try {
            const response = await Axios.get('http://192.168.0.232:8080/api-beautypalace/product/');
            const { data } = response.data;
            setProductos(data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };


    const renderItem = ({ item }) => {
        const productoImageUrls = imageUrls.filter((url) => url.includes(`image_${item.id}`));

        return (
            <View style={styles.productoContainer}>

                <Text style={styles.productoNombre}>{item.nombre}</Text>
                <Text style={styles.productoPrecio}>Precio: ${item.precio}</Text>
                <Text style={styles.productoDescripcion}>{item.descripcion}</Text>
                {productoImageUrls.length > 0 && (
                    <Image source={{ uri: productoImageUrls[0] }} style={styles.image} />
                )}
            </View>
        );

    };

    return (
        <View style={styles.container}>
            <FlatList
                data={productos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Cambiar la opacidad a un valor más bajo
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    productoContainer: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    productoNombre: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    productoPrecio: {
        fontSize: 16,
        marginBottom: 4,
    },
    productoDescripcion: {
        fontSize: 14,
        color: '#888',
    },
    imagen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        marginVertical: 10,
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});

export default ProductosClient;
