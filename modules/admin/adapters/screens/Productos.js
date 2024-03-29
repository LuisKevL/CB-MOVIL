import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, Alert, FlatList, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebaseConfigg from './firebase'; 
import ProductosClient from '../../../profile/adapters/screens/ProductosClient';
import { number } from 'yup';
const storage = getStorage(firebaseConfigg);

const AgregarProducto = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [nombre, setNombre] = useState('');
  const [nombree, setNombree] = useState('');
  const [precio, setPrecio] = useState('');
  const [precioo, setPrecioo] = useState('');
  const [descripcionn, setDescripcionn] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [actModal, setActModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [nombreProductoEliminar, setNombreProductoEliminar] = useState('');
  const [confirmarEliminacion, setConfirmarEliminacion] = useState('');
  const [cancelModal, setCancelModal] = useState(false);

  const deleteProduct = async () => {
    if (!selectedProduct) {
      Alert.alert('Error', 'Selecciona un producto para eliminar.');
      return;
    }
    if (confirmarEliminacion.trim() !== 'CONFIRMAR') {
      Alert.alert('Error', 'Por favor ingresa "CONFIRMAR" para eliminar el producto.');
      return;
    }

    const productoDelete = productos.find((producto) => producto.nombre === nombreProductoEliminar);

    if (!productoDelete) {
      Alert.alert('Error', 'No se encontró ningun producto con ese nombre.');
      return;
    }

    Alert.alert(
      'Confirmación',
      `¿Estás seguro de eliminar el producto "${selectedProduct.nombre}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              setIsLoading(true);
              await Axios.delete(`http://192.168.0.232:8080/api-beautypalace/product/${selectedProduct.id}`);
              setProductos((prevProductos) =>
                prevProductos.filter((producto) => producto.id !== selectedProduct.id)
              );
              Alert.alert('Éxito', `El producto "${selectedProduct.nombre}" ha sido eliminado.`);
              setCancelModal(false);
              clearFields();
              setIsLoading(false);
              fetchProductos();
            } catch (error) {
              console.error('Error al eliminar el producto:', error);
              Alert.alert('Error', 'No se pudo eliminar el producto. Inténtalo de nuevo más tarde.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const [fieldsOferta, setFieldsOferta] = useState(false);
  const validateOferta = (ofertaNombre, descuento, ofertaDescripcion, fechaInicio) => {
    if (ofertaNombre.trim() === "" || descuento.trim() === "" || ofertaDescripcion.trim() === "" || fechaInicio.trim() === "") {
      return false;
    } else {
      return true;
    }
  }


  const [fieldsCompleted, setFieldsCompleted] = useState(false);

  const validateFields = (nombree, precioo, descripcionn) => {
    if (nombree.trim() === "" || precioo.trim() === "" || descripcionn.trim() === "") {
      return false;
    } else {
      return true;
    }
  };
  const validateFieldss = (nombre, precio, descripcion) => {
    if (nombre.trim() === "" || precio.trim() === "" || descripcion.trim() === "") {
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    fetchImagesFromStorage();
    fetchProductos();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setNombre(selectedProduct.nombre);
      setPrecio(selectedProduct.precio.toString());
      setDescripcion(selectedProduct.descripcion);
    }
  }, [selectedProduct]);

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
      setIsLoading(true);
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
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  };

  const handleUploadImage = async (productId) => {
    if (imageUpload) {
      try {
        setIsLoading(true);
        const imageName = `image_${productId}_${Date.now()}`;
        const imageRef = ref(storage, `productos/${imageName}`);

        const response = await fetch(imageUpload.assets[0].uri);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob, { contentType: 'image/jpeg' });

        const downloadUrl = await getDownloadURL(imageRef);
        setImageUrls((prevUrls) => [...prevUrls, downloadUrl]);
        Alert.alert('Imagen cargada exitosamente');
        console.log('Imagen cargada exitosamente.');
        setIsLoading(false);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    } else {
      alert('Por favor, seleccione una imagen.');
    }
  };

  const actualizar = async () => {
    try {
      Alert.alert(
        'Confirmar Actualización',
        '¿Estás seguro de actualizar los datos?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Actualizar',
            onPress: async () => {
              setIsLoading(true); 
              const response = await Axios.put('http://192.168.0.232:8080/api-beautypalace/product/update/', {
                id: selectedProduct.id, 
                nombre: nombre,
                precio: parseFloat(precio),
                descripcion: descripcion,
              });
         
              setSelectedProduct({
                ...selectedProduct,
                nombre: nombre,
                precio: parseFloat(precio),
                descripcion: descripcion,
              });
              console.log('Producto actualizado con éxito');
              Alert.alert('Producto actualizado con éxito');
              setActModal(false);
              clearFieldss();
              setIsLoading(false); 
              fetchProductos(); 
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      Alert.alert('Error al actualizar el producto');
    }
  };

  const clearFieldss = () => {
    setNombre('');
    setPrecio('');
    setDescripcion('');
    setFieldsCompleted(false);
  };

  const handleGuardar = async () => {
    try {
      const id = generateId();
      setIsLoading(true);
      const response = await Axios.post('http://192.168.0.232:8080/api-beautypalace/product/', {
        id: id,
        nombre: nombree,
        precio: parseFloat(precioo),
        descripcion: descripcionn,
      });

      console.log('Producto registrado con éxito');
      Alert.alert('Producto registrado con éxito');
      setModalVisible(false);
      clearFields();
      fetchProductos(); 
      setIsLoading(false);
      const producto = {
        id: id,
        nombre: nombree,
        precio: parseFloat(precioo),
        descripcion: descripcionn,
      };
      await AsyncStorage.setItem('producto', JSON.stringify(producto));
      console.log('Datos del producto guardados en AsyncStorage');
    } catch (error) {
      console.error('Error al registrar el producto:', error);
      Alert.alert('Error al registrar el producto');
    }
  };

  const generateId = () => {
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
    setOfertaNombre('');
    setOfertaDescripcion('');
    setDescripcion('');
    setFechaInicio('');
    setNombree('');
    setPrecioo('');
    setDescripcionn('');
    setDescuento('');
    setConfirmarEliminacion('');
    setNombreProductoEliminar('');
  };
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    fetchOfertas(); 
  }, []);
  const fetchOfertas = async () => {
    try {
      const response = await Axios.get('http://192.168.0.232:8080/api-beautypalace/oferta/', {
        params: {
          nombre: ofertaNombre,
          descuento: parseInt(descuento),
        }
      });
      const data = response.data;
      console.log(data);
    } catch (error) {
      console.error('Error al obtener las ofertas:', error);
    }
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
      const idd = generateId();

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
      setIsLoading(true);
      const response = await Axios.post('http://192.168.0.232:8080/api-beautypalace/oferta/', ofertaData);

      console.log('Oferta registrada con éxito');
      Alert.alert('Oferta registrada con éxito');
      setModal(false);
      clearFields();
      setIsLoading(false);
    } catch (error) {
      console.error('Error al registrar la oferta:', error);
      Alert.alert('Error al registrar la oferta');
    }
  };
  const [selectedProduct, setSelectedProduct] = useState(null); 

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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#97714D" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        ) : (
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
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.touchable}>
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "bold",
              }}
              onPress={() => {
                setSelectedProduct(item); 
                setActModal(true)
              }}
            >
              ACTUALIZAR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => {
              setSelectedProduct(item);
              setCancelModal(true)
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              ELIMINAR
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            setSelectedProduct(item); 
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
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#97714D" />
                <Text style={styles.loadingText}>Cargando...</Text>
              </View>
            ) : (
              <View style={styles.modalContent}>
                {selectedProduct ? (
                  <>
                    <Text style={styles.modalTitle}>Agregar Oferta para {selectedProduct.nombre}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre de la oferta"
                      value={ofertaNombre}
                      onChangeText={(text) => {
                        setOfertaNombre(text);
                        setFieldsOferta(validateOferta(ofertaNombre, descuento, ofertaDescripcion, fechaInicio));
                      }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Descuento"
                      keyboardType="numeric"
                      value={descuento}
                      onChangeText={(text) => {
                        setDescuento(text);
                        setFieldsOferta(validateOferta(ofertaNombre, descuento, ofertaDescripcion, fechaInicio))
                      }}
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
                      multiline
                      scrollEnabled={true}
                      onChangeText={(text) => {
                        setOfertaDescripcion(text);
                        setFieldsOferta(validateOferta(ofertaNombre, descuento, ofertaDescripcion, fechaInicio))
                      }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Fecha de inicio: 2023-12-31"
                      value={fechaInicio}
                      onChangeText={(text) => {
                        setFechaInicio(text);
                        setFieldsOferta(validateOferta(ofertaNombre, descuento, ofertaDescripcion, fechaInicio))
                      }}
                    />
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 10,
                          backgroundColor: '#8B4513',
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          marginHorizontal: 5,
                          borderWidth: 1,
                          borderColor: '#8B4513',
                        }} onPress={() => {
                          if (fieldsOferta) {
                            handleRegistrarOferta();
                            clearFields();
                          } else {
                            Alert.alert('Por favor, completa todos los campos.');
                          }
                        }} >
                        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>
                          registrar oferta
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 10,
                          backgroundColor: '#8B4513',
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          marginHorizontal: 5,
                          borderWidth: 1,
                          borderColor: '#8B4513',
                        }} onPress={() => { setModal(false); clearFields(); }} >
                        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>
                          Cancelar                      </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <Text style={styles.noProductSelected}>Selecciona un producto para agregar una oferta.</Text>
                )}
              </View>
            )}
          </View>
        </Modal>

        <View>
          <Modal visible={actModal} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#97714D" />
                  <Text style={styles.loadingText}>Cargando...</Text>
                </View>
              ) : (
                <View style={styles.modalContent}>
                  {selectedProduct ? (
                    <>
                      <Text>Actualizar Producto</Text>
                      <TextInput
                        style={styles.input}
                        value={nombre}
                        placeholder={selectedProduct.nombre}
                        onChangeText={(text) => {
                          setNombre(text);
                          setFieldsCompleted(validateFieldss(nombre, precio, descripcion));
                        }}
                      />
                      <TextInput
                        style={styles.input}
                        value={precio}
                        placeholder={selectedProduct.precio.toString()}
                        onChangeText={(text) => {
                          setPrecio(text);
                          setFieldsCompleted(validateFieldss(nombre, precio, descripcion));
                        }} keyboardType="numeric"
                      />
                      <TextInput
                        style={styles.input}
                        value={descripcion}
                        placeholder={selectedProduct.descripcion}
                        onChangeText={(text) => {
                          setDescripcion(text);
                          setFieldsCompleted(validateFieldss(nombre, precio, descripcion));
                        }} />
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            backgroundColor: '#8B4513',
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            marginHorizontal: 5,
                            borderWidth: 1,
                            borderColor: '#8B4513',
                          }}
                          onPress={() => {
                            if (fieldsCompleted) {
                              actualizar();
                              clearFieldss();
                            } else {
                              Alert.alert('Por favor, completa todos los campos.');
                            }
                          }}
                        >
                          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>
                            Actualizar
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            backgroundColor: '#8B4513',
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            marginHorizontal: 5,
                            borderWidth: 1,
                            borderColor: '#8B4513',
                          }} onPress={() => { setActModal(false); clearFields(); }} >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 18,
                              fontWeight: "bold",
                              marginLeft: 8,
                            }}
                          >
                            Cancelar
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <Text style={styles.noProductSelected}>Selecciona un producto para agregar una oferta.</Text>
                  )}
                </View>
              )}

            </View>
          </Modal>
        </View>
        <View style={{
          flex: 1,
          padding: 60,
        }}>
          <Modal visible={cancelModal} animationType="slide" transparent={true}
            onRequestClose={() => setCancelModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {selectedProduct ? (
                  <>
                    <Text style={styles.modalText}>Cancelar Cita</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre del producto a eliminar"
                      value={nombreProductoEliminar}
                      onChangeText={(text) => setNombreProductoEliminar(text)}
                    />
                    <Text>Es importante confirmar la cancelación, introduzca: CONFIRMAR</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="CONFIRMAR"
                      value={confirmarEliminacion}
                      onChangeText={(text) => setConfirmarEliminacion(text)}

                    />
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#97714D" />
                        <Text style={styles.loadingText}>Cargando...</Text>
                      </View>
                    ) : (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            backgroundColor: '#8B4513',
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            marginHorizontal: 5,
                            borderWidth: 1,
                            borderColor: '#8B4513',
                          }}
                          onPress={() => {
                            deleteProduct();

                          }}
                        >
                          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>
                            ELIMINAR PRODUCTO
                          </Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            backgroundColor: '#8B4513',
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            marginHorizontal: 5,
                            borderWidth: 1,
                            borderColor: '#8B4513',
                          }} onPress={() => { setCancelModal(false); clearFields(); }} >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 18,
                              fontWeight: "bold",
                              marginLeft: 8,
                            }}
                          >
                            Cancelar
                          </Text>
                        </TouchableOpacity>

                      </View>
                    )}
                  </>
                ) : (
                  <Text style={styles.noProductSelected}>Selecciona un producto para agregar una oferta.</Text>
                )}
              </View>
            </View>
          </Modal>
        </View>
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
              value={nombree}
              onChangeText={(text) => {
                setNombree(text);
                setFieldsCompleted(validateFields(nombree, precioo, descripcionn));
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio"
              value={precioo}
              onChangeText={(text) => {
                setPrecioo(text);
                setFieldsCompleted(validateFields(nombree, precioo, descripcionn));
              }}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={descripcionn}
              multiline
              scrollEnabled={true}
              onChangeText={(text) => {
                setDescripcionn(text);
                setFieldsCompleted(validateFields(nombree, precioo, descripcionn));
              }}
            />

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#97714D" />
                <Text style={styles.loadingText}>Cargando...</Text>
              </View>
            ) : (
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
                    alignItems: "center", 
                  }}
                  onPress={() => {
                    if (fieldsCompleted) {
                      handleGuardar();
                    } else {
                      Alert.alert('Por favor, completa todos los campos.');
                    }
                  }} >
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
                    alignItems: "center", 
                  }}
                  onPress={() => { setModalVisible(false); clearFields(); }} >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    CANCELAR
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={{
          backgroundColor: "#8B4513",
          borderRadius: 10,
          paddingVertical: 7, 
          paddingHorizontal: 12,
          marginHorizontal: 5,
          alignItems: "center", 
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
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
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

  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#97714D',
    fontWeight: 'bold',
  },
});

export default AgregarProducto;