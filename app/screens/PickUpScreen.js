import { Image, Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PickUpScreen = () => {
    const [selectedOption, setSelectedOption] = useState("");
    // console.log(selectedOption);
    const isFocused = useIsFocused();
    const [selectedAddress, setSelectedAddress] = useState('No Selected Address');
    useEffect(() => {
        getAddressList();
    }, [isFocused]);

    const getAddressList = async () => {
        const userId = auth.currentUser.uid;
        const addressId = await AsyncStorage.getItem('ADDRESS');
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        let tempDart = [];
        tempDart = userDoc.data().address;
        tempDart.map(item => {
            if (item.addressId == addressId) {
                setSelectedAddress(
                    item.street +
                    ',' +
                    item.city +
                    ',' +
                    item.mobile,
                );
            }
        });
    };

    const [cart, setCart] = useState([]);
    useEffect(() => {
        const getCartFromFirebase = async () => {
            try {
                const docRef = doc(db, 'users', userUid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setCart(userData.cart);
                }
                console.log("getting cart success")
            } catch (error) {
                console.error('Error getting cart from Firebase:', error);
            }
        };

        getCartFromFirebase();
    }, [isFocused]);

    const navigation = useNavigation();
    const userUid = auth.currentUser.uid;
    const getTotal = () => {
        let total = 0;
        cart.map(item => {
            total = total + item.quality * item.discountPrice;
        });
        return total;
    };

    const placeOrder = async () => {
        try {
            const userId = auth.currentUser.uid;
            const email = auth.currentUser.email;
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            const currentCart = cart;
            const phone = userDoc.data().phone;
            if (!userDoc.exists()) {
                console.log('User document does not exist');
                return;
            }

            const newOrder = {
                items: currentCart,
                address: selectedAddress,
                orderBy: email,
                userMobile: phone,
                userId: userId,
                orderTotal: getTotal(),
                confirm: "no",
                finish: "no",
                paymentMethod: selectedOption,
                createdAt: new Date().toISOString()
            };

       
            await setDoc(userDocRef, {
                ...userDoc.data(),
                cart: [],
                orders: arrayUnion(newOrder),
            }, { merge: true });

 
            await setDoc(doc(db, 'orders', newOrder.createdAt), newOrder);
            console.log('Order placed successfully');
            navigation.navigate("Payment_Success");
            setCart([]);
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };


    const pay = () => {

    }
    return (
        <>
            <ScrollView style={{}}>


                <View
                    style={{
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >

                    <AntDesign onPress={() => navigation.goBack()} name="left" size={24} color="black" />
                    {/* <Text>Your Bucket</Text> */}
                </View>


                {cart.map((item, index) => (
                    <View key={index} style={styles.itemView}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.itemImage}
                        />
                        <View style={styles.nameView}>
                            <Text style={styles.nameText}>{item.name}</Text>
                            {/* <Text style={styles.descText}>{item.description}</Text> */}
                            <View style={styles.priceView}>
                                <Text style={styles.priceText}>
                                    {'$' + item.discountPrice}
                                </Text>
                                <Text style={styles.discountText}>
                                    {'$' + item.price}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.addRemoveView}>

                            <Text style={{ fontSize: 16, fontWeight: '600' }}>
                                {"Quantity: " + item.quality}
                            </Text>

                        </View>
                    </View>
                ))}


                <SafeAreaView>
                    <View style={styles.totalView}>
                        <Text style={styles.nameText}>Selected Address</Text>
                        <Text
                            style={styles.editAddress}
                            onPress={() => {
                                navigation.navigate('Address');
                            }}>
                            Change Address
                        </Text>
                    </View>

                    <Text
                        style={{
                            margin: 15,
                            width: '100%',
                            fontSize: 16,
                            color: '#000',
                            fontWeight: '600',
                        }}>
                        {selectedAddress}
                    </Text>
                    <View style={{ marginHorizontal: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            Select your payment Method
                        </Text>

                        <View
                            style={{
                                backgroundColor: "white",
                                padding: 8,
                                borderColor: "#D0D0D0",
                                borderWidth: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 7,
                                marginTop: 12,
                            }}
                        >
                            {selectedOption === "cash" ? (
                                <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                            ) : (
                                <Entypo
                                    onPress={() => setSelectedOption("cash")}
                                    name="circle"
                                    size={20}
                                    color="gray"
                                />
                            )}

                            <Text>Cash on Delivery</Text>
                        </View>

                        <View
                            style={{
                                backgroundColor: "white",
                                padding: 8,
                                borderColor: "#D0D0D0",
                                borderWidth: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 7,
                                marginTop: 12,
                            }}
                        >
                            {selectedOption === "card" ? (
                                <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                            ) : (
                                <Entypo
                                    onPress={() => {
                                        setSelectedOption("card");
                                        Alert.alert("UPI/Debit card", "Pay Online", [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel is pressed"),
                                            },
                                            {
                                                text: "OK",
                                                onPress: () => pay(),
                                            },
                                        ]);
                                    }}
                                    name="circle"
                                    size={20}
                                    color="gray"
                                />
                            )}

                            <Text>UPI / Credit or debit card</Text>
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 30 }}>
                            Billing Details
                        </Text>
                        <View
                            style={{
                                backgroundColor: "white",
                                borderRadius: 7,
                                padding: 10,
                                marginTop: 15,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text
                                    style={{ fontSize: 18, fontWeight: "400", color: "gray" }}
                                >
                                    Item Total
                                </Text>
                                <Text style={{ fontSize: 18, fontWeight: "400" }}>
                                    {getTotal()}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginVertical: 8,
                                }}
                            >
                                <Text
                                    style={{ fontSize: 18, fontWeight: "400", color: "gray" }}
                                >
                                    Delivery Fee | Ha Noi, Ho Chi Minh
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "400",
                                        color: "#81d773",
                                    }}
                                >
                                    FREE
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text
                                    style={{ fontSize: 18, fontWeight: "500", color: "gray" }}
                                >
                                    Free Delivery on Your order
                                </Text>
                            </View>

                            <View
                                style={{
                                    borderColor: "gray",
                                    height: 1,
                                    borderWidth: 0.5,
                                    marginTop: 10,
                                }}
                            />

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginVertical: 10,
                                }}
                            >
                                <Text
                                    style={{ fontSize: 18, fontWeight: "500", color: "gray" }}
                                >
                                    selected Payment
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "400",
                                        color: "#81d773",
                                    }}
                                >
                                    {selectedOption}
                                </Text>
                            </View>


                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginVertical: 8,
                                }}
                            >
                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                                    To Pay
                                </Text>
                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                                    {getTotal()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>


            </ScrollView>

            <View style={styles.checkoutView}>
                <Text style={{ color: '#000', fontWeight: '600' }}>
                    {'Items(' + cart.length + ')\nTotal: $' + getTotal()}
                </Text>
                <TouchableOpacity
                    style={[
                        styles.addToCartBtn,
                        {
                            width: 100,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ]}
                    onPress={placeOrder}>
                    <Text style={{ color: '#fff' }}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

export default PickUpScreen

const styles = StyleSheet.create({
    totalView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingLeft: 20,
        height: 50,
        borderTopWidth: 0.3,
        paddingRight: 20,
        alignItems: 'center',
        borderTopColor: '#8e8e8e',
    },
    editAddress: {
        color: '#2F62D1',
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    }, itemView: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        elevation: 4,
        marginTop: 10,
        borderRadius: 10,
        height: 100,
        marginBottom: 10,
        alignItems: 'center',
    },
    itemImage: {
        width: 90,
        height: 90,
        borderRadius: 10,
        margin: 5,
    },
    nameView: {
        width: '35%',
        margin: 10,
    },
    priceView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText: {
        fontSize: 15,
        fontWeight: '700',
    },

    priceText: {
        fontSize: 18,
        color: '#81D773',
        fontWeight: '700',
    },
    discountText: {
        fontSize: 17,
        fontWeight: '600',
        textDecorationLine: 'line-through',
        marginLeft: 5,
    },
    addToCartBtn: {
        backgroundColor: '#81D773',
        padding: 10,
        borderRadius: 10,
    },
    checkoutView: {
        width: '100%',
        height: 60,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
})