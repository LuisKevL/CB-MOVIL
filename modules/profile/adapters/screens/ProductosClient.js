import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Axios from 'axios';
import { getStorage, ref, getDownloadURL, listAll } from 'firebase/storage';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import firebaseConfig from '../../../admin/adapters/screens/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = getStorage(firebaseConfig);

const ProductosClient = () => {
    const [imageUrls, setImageUrls] = useState([]);
    const [productos, setProductos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});

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

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
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
                <TouchableOpacity style={styles.iconContainer} onPress={() => openModal(item)}>
                    <Iconn name="help-outline" size={30} color="black" />
                </TouchableOpacity>
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
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{selectedProduct.descripcion}</Text>
                        <TouchableOpacity style={[styles.botones, styles.agendarButton]}
                            onPress={closeModal}>
                            <Text style={styles.modalButton}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    modalButton: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    productoPrecio: {
        fontSize: 16,
        marginBottom: 4,
    },
    productoDescripcion: {
        fontSize: 14,
        color: '#9D9391',
    },
    image: {
        width: 150,
        height: 150,
        marginVertical: 10,
        alignSelf: 'center',
    },
    iconContainer: {
        alignItems: 'flex-end',
    },
    botones: {
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    agendarButton: {
        backgroundColor: '#97714D',
    },
});

export default ProductosClient;
