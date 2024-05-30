import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { addDoc, collection, getDocs, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import ModalSelector from 'react-native-modal-selector';
import { db, storage } from '../firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Add = ({ navigateToItems }) => {
  const [quality, setQuantity] = useState(0);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      const colRef = collection(db, 'category'); 
      const docsSnap = await getDocs(colRef);
      const itemsList = docsSnap.docs.map(doc => ({
        label: doc.data().name, 
        key: doc.id,
      }));
      setCategoryList(itemsList);
    } catch (error) {
      console.error('Error fetching items: ', error);
    }
  };

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const update = async () => {
    try {
    
      const resp = await fetch(imageUrl);
      const blob = await resp.blob();
      const storageRef = ref(storage, 'products/' + Date.now() + ".jpg");

      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const productsRef = collection(db, 'products');
      const docRef = await addDoc(productsRef, {
        name: name,
        price: parseFloat(price),
        discountPrice: parseFloat(discountPrice),
        description: description,
        quality: 1,
        image: downloadURL,
        category: selectedCategory,
      });

      
      await setDoc(docRef, { id: docRef.id }, { merge: true });

      console.log('Thêm sản phẩm thành công');
      navigateToItems();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Add Item</Text>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
        </View>
        <TouchableOpacity style={styles.pickBtn} onPress={openImagePicker}>
          <Text>Pick Image From Gallery</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Enter Item Name"
          style={styles.inputStyle}
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          placeholder="Enter Item Price"
          style={styles.inputStyle}
          value={price}
          onChangeText={text => setPrice(text)}
        />
        <TextInput
          placeholder="Enter Item Discount Price"
          style={styles.inputStyle}
          value={discountPrice}
          onChangeText={text => setDiscountPrice(text)}
        />
        <TextInput
          placeholder="Enter Item Description"
          style={styles.inputStyle}
          value={description}
          onChangeText={text => setDescription(text)}
        />
        <ModalSelector
          data={categoryList}
          initValue="Select a category"
          labelKey="name" 
          onChange={(option) => setSelectedCategory(option.label)}
          style={styles.picker}
        />
        <TouchableOpacity style={styles.uploadBtn} onPress={update}>
          <Text style={{ color: '#fff' }}>Upload Item</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    elevation: 5,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
  },
  inputStyle: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 30,
    alignSelf: 'center',
  },
  pickBtn: {
    width: '90%',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  uploadBtn: {
    backgroundColor: '#F68D9F',
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
    margin: 20,
  },
  picker: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
});
