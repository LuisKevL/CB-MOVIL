import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, Alert, FlatList, Text, ScrollView, Image } from 'react-native';
import Axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

import firebaseConfig from './firebase'; // Archivo de configuración de Firebase

// Inicializar la aplicación de Firebase
const storage = getStorage(firebaseConfig);
const AgregarProducto = () => {
  //imagnnnn
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    fetchImagesFromStorage();
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

  const handleSelectImage = async (productId) => {
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

      if (!result.cancelled) {
        setImageUpload(result);
        handleUploadImage(productId, result); // Subir la imagen para el producto seleccionado
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  };

  const handleUploadImage = async (productId, image) => {
    if (image) {
      try {
        const imageName = `image_${productId}_${Date.now()}`;
        const imageRef = ref(storage, `productos/${imageName}`);

        const response = await fetch(image.uri);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob, { contentType: 'image/jpeg' });

        const downloadUrl = await getDownloadURL(imageRef);
        setImageUrls((prevUrls) => [...prevUrls, downloadUrl]);

        console.log('Imagen subida exitosamente.');
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    } else {
      alert('Por favor, seleccione una imagen.');
    }
  };
  //imagennnnnn
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

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
  };

  return (
    <View style={styles.container}>

      <ScrollView>
        <Text style={styles.title}>Productos</Text>
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const productoImageUrls = imageUrls.filter((url) => url.includes(`image_${item.id}`));

            return (
              <View style={styles.productoContainer}>
                <Text style={styles.productoNombre}>{item.nombre}</Text>
                <Text style={styles.productoPrecio}>Precio: ${item.precio}</Text>
                <Text style={styles.productoDescripcion}>{item.descripcion}</Text>
                {productoImageUrls.length > 0 && (
                  <Image source={{ uri: productoImageUrls[0] }} style={styles.image} />
                )}
                <View style={styles.buttonContainer}>
                  <Button title=" Subir Imágen " onPress={() => handleSelectImage(item.id)} />
                </View>
              </View>

            );
          }}
        />
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
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
            <Button title="Registrar Producto" onPress={handleGuardar} />
            <Button title="Cancelar" onPress={() => { setModalVisible(false); clearFields(); }} />
          </View>
        </Modal>
        <Button title="Agregar Producto" onPress={() => setModalVisible(true)} />

      </ScrollView>
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
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

});

export default AgregarProducto;
