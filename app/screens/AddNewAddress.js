import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db , auth} from "../firebase";  // Ensure the firebase config is correct
import { useNavigation } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const AddNewAddress = () => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [mobile, setMobile] = useState('');
  const navigation = useNavigation();

  const saveAddress = async () => {
    try {
      const addressId = uuid.v4();
      const userId = auth.currentUser.uid;
      if (!userId) {
        console.log('User ID not found in AsyncStorage');
        return;
      }

      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.log('User document does not exist');
        return;
      }

      const newAddress = { street, city, mobile, addressId };

      await updateDoc(userDocRef, {
        address: arrayUnion(newAddress)
      });

      console.log('Successfully added');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <AntDesign onPress={() => navigation.goBack()} name="left" size={24} color="black" style={styles.left} />
      <TextInput
        style={styles.inputStyle}
        placeholder={'Enter Street'}
        value={street}
        onChangeText={setStreet}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder={'Enter City '}
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder={'Enter Contact '}
        value={mobile}
        maxLength={10}
        keyboardType="number-pad"
        onChangeText={setMobile}
      />
      <TouchableOpacity
        style={styles.addNewBtn}
        onPress={saveAddress}>
        <Text style={styles.btnText}>Save Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddNewAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputStyle: {
    paddingLeft: 20,
    height: 50,
    alignSelf: 'center',
    marginTop: 30,
    borderWidth: 0.5,
    borderRadius: 10,
    width: '90%',
  },
  addNewBtn: {
    width: '90%',
    height: 50,
    backgroundColor: '#81d773',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  btnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
