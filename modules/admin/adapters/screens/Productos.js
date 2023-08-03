import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, Alert, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import Axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebaseConfig from './firebase'; // Archivo de configuración de Firebase
import ProductosClient from '../../../profile/adapters/screens/ProductosClient';
// Inicializar la aplicación de Firebase
const storage = getStorage(firebaseConfig);

const AgregarProducto = () => {
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

  const handleSelectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert('Se requiere permiso para acceder a la galería de imágenes');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      Alert.alert('Pulsa ahora el botón de: Subir Imágen');

      if (!result.canceled) {
        setImageUpload(result);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  };

  const handleUploadImage = async (productId) => {
    if (imageUpload) {
      try {
        const imageName = `image_${productId}_${Date.now()}`;
        const imageRef = ref(storage, `productos/${imageName}`);

        const response = await fetch(imageUpload.assets[0].uri);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob, { contentType: 'image/jpeg' });

        const downloadUrl = await getDownloadURL(imageRef);
        setImageUrls((prevUrls) => [...prevUrls, downloadUrl]);
        Alert.alert('Imagen subida exitosamente');
        console.log('Imagen subida exitosamente.');
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    } else {
      alert('Por favor, seleccione una imagen.');
    }
  };


  const handleGuardar = async () => {
    try {
      const id = generateId(); // Generar el ID automáticamente

      const response = await Axios.post('http://192.168.0.232:8080/api-beautypalace/product/', {
        id: id,
        nombre: nombre,
        precio: parseFloat(precio),
        descripcion: descripcion,
      });

      console.log('Producto registrado con éxito');
      Alert.alert('Producto registrado con éxito');
      setModalVisible(false);
      clearFields();
      fetchProductos(); // Actualizar la lista de productos

      // Guardar los datos del producto en AsyncStorage
      const producto = {
        id: id,
        nombre: nombre,
        precio: parseFloat(precio),
        descripcion: descripcion,
      };
      await AsyncStorage.setItem('producto', JSON.stringify(producto));
      console.log('Datos del producto guardados en AsyncStorage');
    } catch (error) {
      console.error('Error al registrar el producto:', error);
      Alert.alert('Error al registrar el producto');
    }
  };

  const generateId = () => {
    // Generar un ID único utilizando la fecha actual
    return Date.now().toString();
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

  const clearFields = () => {
    setNombre('');
    setPrecio('');
    setDescripcion('');
    setOfertaNombre('');
    setOfertaDescripcion('');
    setDescripcion('');
    setFechaInicio('');

  };

  const [ofertaNombre, setOfertaNombre] = useState('');
  const [descuento, setDescuento] = useState('');
  const [ofertaDescripcion, setOfertaDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');

  const handleRegistrarOferta = async () => {
    try {
      if (!selectedProduct) {
        Alert.alert('Selecciona un producto antes de registrar una oferta');
        return;
      }
      const idd = generateId(); // Generar el ID automáticamente

      // Verificar y asignar los datos del producto
      const productData = {
        id: selectedProduct.id,
        nombre: selectedProduct.nombre,
        precio: parseFloat(selectedProduct.precio),
        descripcion: selectedProduct.descripcion,
      };

      const ofertaData = {
        id: idd,
        nombre: ofertaNombre,
        descuento: parseInt(descuento),
        product: productData,
        descripcion: ofertaDescripcion,
        fechaInicio: fechaInicio,
      };

      const response = await Axios.post('http://192.168.0.232:8080/api-beautypalace/oferta/', ofertaData);

      console.log('Oferta registrada con éxito');
      Alert.alert('Oferta registrada con éxito');
      setModal(false);
      clearFields();
    } catch (error) {
      console.error('Error al registrar la oferta:', error);
      Alert.alert('Error al registrar la oferta');
    }
  };
  const [selectedProduct, setSelectedProduct] = useState(null); // Nuevo estado para el producto seleccionado

  const renderItem = ({ item }) => {
    const productoImageUrls = imageUrls.filter((url) => url.includes(`image_${item.id}`));

    return (
      <View style={styles.productoContainer}>

        <Text style={styles.productoNombre}>{item.nombre}</Text>
        <Text style={styles.productoPrecio}>Precio: ${item.precio}</Text>
        <Text style={styles.productoDescripcion}>{item.descripcion}</Text>

        {item.ofertaNombre && (
        <Text style={styles.ofertaNombre}>Oferta: {item.ofertaNombre}</Text>
      )}


        {productoImageUrls.length > 0 && (
          <Image source={{ uri: productoImageUrls[0] }} style={styles.image} />
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => handleSelectImage(item.id)} >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              SELECCIONAR IMAGEN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => handleUploadImage(item.id)} >
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              SUBIR IMÁGEN
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            setSelectedProduct(item); // Guardar el producto seleccionado en el estado
            setModal(true);
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            AGREGAR OFERTA
          </Text>
        </TouchableOpacity>

        {/* Modal de la oferta */}
        <Modal visible={modal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedProduct ? (
                <>
                  <Text style={styles.modalTitle}>Agregar Oferta para {selectedProduct.nombre}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre de la oferta"
                    value={ofertaNombre}
                    onChangeText={setOfertaNombre}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Descuento"
                    keyboardType="numeric"
                    value={descuento}
                    onChangeText={setDescuento}
                  />
                    <TextInput
                    style={styles.input}
                    value={selectedProduct.id.toString()}
                    editable={false}
                  />
                  <TextInput
                    style={styles.input}
                    value={selectedProduct.nombre}
                    editable={false}
                  />
                  <TextInput
                    style={styles.input}
                    value={selectedProduct.precio.toString()}
                    editable={false}
                  />
                  <TextInput
                    style={styles.input}
                    value={selectedProduct.descripcion}
                    editable={false}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Descripción de Oferta"
                    value={ofertaDescripcion}
                    onChangeText={setOfertaDescripcion}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Fecha de inicio: 2023-12-31"
                    value={fechaInicio}
                    onChangeText={setFechaInicio}
                  />
                  <View style={styles.buttonContainer}>
                    <Button title="Registrar Oferta" onPress={handleRegistrarOferta} />
                    <Button title="Cancelar" onPress={() => { setModal(false); clearFields(); }} />
                  </View>
                </>
              ) : (
                <Text style={styles.noProductSelected}>Selecciona un producto para agregar una oferta.</Text>
              )}
            </View>
          </View>
        </Modal>


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
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio"
              value={precio}
              onChangeText={setPrecio}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
            />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#8B4513",
                  borderRadius: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 16,
                  marginHorizontal: 5,
                  alignItems: "center", // Añade esta propiedad para centrar el contenido horizontalmente
                }}
                onPress={handleGuardar} >
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  REGISTRAR
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#8B4513",
                  borderRadius: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 14,
                  marginHorizontal: 5,
                  alignItems: "center", // Añade esta propiedad para centrar el contenido horizontalmente
                }}
                onPress={() => { setModalVisible(false); clearFields(); }} >
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  CANCELAR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={{
          backgroundColor: "#8B4513",
          borderRadius: 10,
          paddingVertical: 7, // Ajustar este valor para aumentar la altura
          paddingHorizontal: 12,
          marginHorizontal: 5,
          alignItems: "center", // Añade esta propiedad para centrar el contenido horizontalmente
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={{
            color: "white",
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          AGREGAR PRODUCTO
        </Text>
      </TouchableOpacity>


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
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Cambiar la opacidad a un valor más bajo
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
  touchable: {
    flex: 1,
    backgroundColor: "#97714D",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    alignItems: "center",
  },
  textBotones: {

  }
});

export default AgregarProducto;