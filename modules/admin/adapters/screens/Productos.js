import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Axios from 'axios';

const AgregarProducto = () => {
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [imagenProducto, setImagenProducto] = useState(null);
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSeleccionarImagen = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Se requiere permiso para acceder a la galería de imágenes');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagenProducto(result.assets[0].uri);
    }
  };

  const handleGuardar = async () => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('nombre', nombre);
      formData.append('imagen', {
        uri: imagenProducto,
        name: 'imagen',
        type: 'image/jpeg',
      });
      formData.append('precio', precio);
      formData.append('descripcion', descripcion);

      const response = await Axios.post('http://192.168.0.232:8080/api-beautypalace/product/', formData);
      console.log('Producto registrado con éxito');
    } catch (error) {
      console.error('Error al registrar el producto:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imagePickerButton} onPress={handleSeleccionarImagen}>
        <Text style={styles.imagePickerButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {imagenProducto && <Image source={{ uri: imagenProducto }} style={styles.imagePreview} />}

      <TextInput
        style={styles.input}
        placeholder="ID"
        value={id}
        onChangeText={setId}
      />

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
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TouchableOpacity style={styles.guardarButton} onPress={handleGuardar}>
        <Text style={styles.guardarButtonText}>Guardar Producto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  imagePickerButton: {
    backgroundColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  guardarButton: {
    backgroundColor: '#3b5998',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  guardarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AgregarProducto;
