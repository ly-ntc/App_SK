import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const BeingTransported = () => {
    const userId = auth.currentUser.uid;
    const [orderList, setOrderList] = useState([]);
    const navigation = useNavigation();
    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();
        const orderData = userData.orders;

        const itemsList = orderData.filter(order => order.confirm === "yes" && order.finish === "no").map((doc, index) => ({
            ...doc,
            key: index.toString(),
        }));

        setOrderList(itemsList);
    };

    const finsihOrder = async (orderKey) => {
        console.log(orderKey);
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();

        const updatedOrders = userData.orders.map(order =>
            order.createdAt === orderKey ? { ...order, finish: 'yes' } : order
        );
        await updateDoc(userRef, {
            orders: updatedOrders
        });
        console.log("Finished order from user's list");
        
        const orderRef = doc(db, 'orders', orderKey);
        await updateDoc(orderRef, {
            finish: 'yes'
        });
        console.log("Finished order from orders collection");
        getOrders();
    };
    return (
        <View style={styles.container}>
            <View
                style={{
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >

                <AntDesign onPress={() => navigation.navigate("Setting")} name="left" size={24} color="black" />
            </View>
            <FlatList
                data={orderList}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.orderItem}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    style={styles.transportButton}
                                >
                                    <Text style={styles.deleteButtonText}>BeingTransported</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => finsihOrder(item.createdAt)}
                                >
                                    <Text style={styles.deleteButtonText}>Finish</Text>
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={item.items}
                                keyExtractor={(subItem, subIndex) => `${item.key}-${subIndex}`}
                                renderItem={({ item: subItem }) => {
                                    return (
                                        <View style={styles.itemView}>
                                            <Image
                                                source={{ uri: subItem.image }}
                                                style={styles.itemImage}
                                            />
                                            <View>
                                                <Text style={styles.nameText}>{subItem.name}</Text>
                                                <Text style={styles.nameText}>
                                                    {'Price: ' +
                                                        subItem.discountPrice +
                                                        ', Qty: ' +
                                                        subItem.quality}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                }}
                            />
                        </View>
                    );
                }}
            />
        </View>
    )
}

export default BeingTransported

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    orderItem: {
        width: '90%',
        borderRadius: 10,
        elevation: 5,
        alignSelf: 'center',
        backgroundColor: '#fff',
        marginTop: 20,
        marginBottom: 10,
        padding: 10,
    },
    deleteButton: {
        backgroundColor: '#f68d9f',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    transportButton: {
        backgroundColor: '#81d773',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    itemView: {
        margin: 10,
        width: '100%',
        flexDirection: 'row',
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginLeft: 20,
        marginTop: 5,
    },
});