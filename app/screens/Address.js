import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDoc, getDocs, doc } from 'firebase/firestore';
import { auth, db } from "../firebase";
import { useNavigation } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
const Address = () => {
    const [addressList, setAddressList] = useState([]);
    const isFocused = useIsFocused();
    const [selectedAddress, setSelectedAddress] = useState('');
    useEffect(() => {
        getAddressList();
    }, [isFocused]);
    const navigation = useNavigation();
    const getAddressList = async () => {
        const userId = auth.currentUser.uid;
        const addressId = await AsyncStorage.getItem('ADDRESS');
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        let tempDart = [];
        tempDart = userDoc.data().address;
        tempDart.map(item => {
            if (item.addressId == addressId) {
                item.selected = true;
            } else {
                item.selected = false;
            }
        });
        setAddressList(tempDart);
    };
    const saveDeafultAddress = async item => {
        await AsyncStorage.setItem('ADDRESS', item.addressId);
        let tempDart = [];
        tempDart = addressList;
        tempDart.map(itm => {
            if (itm.addressId == item.addressId) {
                itm.selected = true;
            } else {
                itm.selected = false;
            }
        });

        let temp = [];

        tempDart.map(item => {
            temp.push(item);
        });
        setAddressList(temp);
    };
    return (
        <View style={styles.container}>
            <AntDesign onPress={() => navigation.goBack()} name="left" size={24} color="black" style={styles.left} />
            <FlatList
                data={addressList}
                renderItem={({ item, index }) => {
                    return (
                        <View
                            style={[
                                styles.addressItem,
                                { marginBottom: index == addressList.length - 1 ? 100 : 10 },
                            ]}>
                            <View>
                                <Text>{'Street: ' + item.street}</Text>
                                <Text>{'City: ' + item.city}</Text>
                                <Text>{'Mobile: ' + item.mobile}</Text>
                            </View>
                            {item.selected == true ? (
                                <Text>default</Text>
                            ) : (
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => {
                                        saveDeafultAddress(item);
                                    }}>
                                    <Text style={{ color: '#fff' }}>Set Default</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                }}
            />
            <TouchableOpacity
                style={styles.addNewBtn}
                onPress={() => {
                    navigation.navigate('AddNewAddress');
                }}>
                <Text style={styles.btnText}>Add New Address</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Address

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
      addressItem: {
        width: '90%',
    
        backgroundColor: '#fff',
        elevation: 4,
        alignSelf: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        alignItems:'center'
      },
      btn: {
        backgroundColor: '#81d773',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
      },
})