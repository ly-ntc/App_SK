import {
    View, Text, StyleSheet, ImageBackground, Image, Dimensions, TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StatusBar,
} from 'react-native'
import React, { useEffect, useState } from 'react';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
const { width, height } = Dimensions.get('screen')
const Product = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const item = route.params.item;
    const isFocused = useIsFocused();
    const [cartCount, setCartCount] = useState(0);
    useEffect(() => {
        getCartItems();
    }, [isFocused]);
    const getCartItems = async () => {
        const userId = auth.currentUser.uid;
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        setCartCount(userData.cart.length);
    };

    const onAddToCart = async () => {
        const userId = auth.currentUser.uid;
        console.log(userId);
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();
        console.log(userData.cart);
        let tempCart = [];
        tempCart = userData.cart;
        if (tempCart.length > 0) {
            let existing = false;
            tempCart.map(itm => {
                if (itm.id == item.id) {
                    existing = true;
                    itm.quality = itm.quality + 1;
                }
            });
            if (existing == false) {
                tempCart.push(item);
            }
            await updateDoc(userRef, {
                cart: tempCart
            });
        } else {
            tempCart.push(item);
        }

        await updateDoc(userRef, {
            cart: tempCart
        });
        console.log("Đã thêm sản phẩm vào giỏ hàng.");
        getCartItems();

    };

    
    

    return (


        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign onPress={() => navigation.goBack()} name="left" size={24} color="black" style={styles.left} />
                <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.basket}>
                    <Ionicons name="cart" size={30} />

                    <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#f68d9f', borderRadius: 10, paddingHorizontal: 5 }}>
                        <Text style={{ color: 'white', fontSize: 12 }}>{cartCount}</Text>
                    </View>
                </TouchableOpacity>

            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.product}>
                    <Image style={styles.productImg} source={{ uri: item.image }} />
                    <View style={styles.productName}>
                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                            <Text style={{ color: 'red', fontSize: 25, }}>{item.discountPrice}</Text>
                            <Text style={{ color: '#d1d0d0', fontSize: 20, textDecorationLine: 'line-through', marginTop: 5, marginLeft: 10 }}>{item.price}$</Text>
                            <View style={{ backgroundColor: '#ffff00', width: 38, height: 20, justifyContent: 'center', alignItems: 'center', marginTop: 8, marginLeft: 10 }}>
                                <Text style={{ color: 'red', fontSize: 13 }}>{Math.round(100 - item.discountPrice / item.price * 100)}%</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 20, margin: 10 }}>
                            {item.name}
                        </Text>

                    </View>


                </View>

                <View style={styles.payments}>

                    <View style={styles.descriptionProduct}>
                        <Text style={styles.heading}>Description</Text>
                        <Text style={styles.description}>
                            {item.description}
                        </Text>
                    </View>
                </View>

            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity onPress={onAddToCart} >
                    <Ionicons name="cart" size={30} />
                    <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#f68d9f', borderRadius: 10, paddingHorizontal: 5 }}>
                        <Text style={{ color: 'white', fontSize: 12 }}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </SafeAreaView>

    )
}

export default Product

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height
        // paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
        backgroundColor: '#f4f8f4',
    },
    header: {
        backgroundColor: '#81d773',
        width: width,
        height: (50 / 932) * height,
        borderBottomRightRadius: 20 / 932 * height,
        borderBottomLeftRadius: 20 / 932 * height,
        zIndex: 1,
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 5,
        paddingTop: 8,
    },
    left: {
        height: 30,
        width: 30,
    },
    basket: {
        flexDirection: 'row',
    },
    basketImg: {
        width: 39,
        height: 36,
        position: 'absolute',
    },
    number: {
        width: 24,
        height: 24,
        backgroundColor: 'red',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    productImg: {
        width: width,
        height: 350,
    },
    productName: {
        backgroundColor: '#fbf4f3',
        width: width,
        height: 100,
    },
    ContentCenter: {
        width: width,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },

    give: {
        width: 54,
        height: 29,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff5151',
        borderRadius: 10,
        marginRight: 10

    },
    horizontalLine: {
        width: '90%', // Chiều rộng của đường thẳng
        height: 1,     // Chiều cao của đường thẳng
        backgroundColor: '#eff0ed', // Màu sắc của đường thẳng
    },


    heading: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10,
        marginTop: 10,
    },
    description: {
        marginLeft: 10,
        marginTop: 10,
    },

    footer: {
        // position: 'absolute',
        bottom: 0,
        width: width,
        height: (55 / 932) * height,
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
