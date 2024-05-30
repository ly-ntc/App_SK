import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {useIsFocused} from '@react-navigation/native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AntDesign } from '@expo/vector-icons';



  const Cart = ({navigation}) => {
    const userUid = auth.currentUser.uid;
    const isFocused = useIsFocused();
    const [cartList, setCartList] = useState([]);
    useEffect(() => {
        getCartItems();
    }, [isFocused]);
    const getCartItems = async () => {
       
        const userDoc = doc (db, 'users', userUid);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();

        setCartList(userData.cart);
    };

    const addItem = async (item) => {
        const userDoc = doc (db, 'users', userUid);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        let tempDart = [];
        tempDart = userData.cart;
        tempDart.map(itm => {
            if (itm.id == item.id) {
                itm.quality = itm.quality + 1;
            }
        });
        await updateDoc(userDoc, {
            cart: tempDart,
        });
        getCartItems();
    };
    const removeItem = async (item) => {
        const userDoc = doc (db, 'users', userUid);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        let tempDart = [];
        tempDart = userData.cart;
        tempDart.map(itm => {
            if (itm.id == item.id) {
                itm.quality = itm.quality - 1;
            }
        });
        await updateDoc(userDoc, {
            cart: tempDart,
        });
        getCartItems();
    };
    const deleteItem = async (index) => {

        const userDoc = doc (db, 'users', userUid);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        let tempDart = [];
        tempDart = userData.cart;
        tempDart.splice(index, 1);
        
        await updateDoc(userDoc, {
            cart: tempDart,
        });
        getCartItems();
    };
    const getTotal = () => {
        let total = 0;
        cartList.map(item => {
            total = total + item.quality * item.discountPrice;
        });
        return total;
    };
    const getCartQuantity = async () => {
        const userDoc = doc(db, 'users', userUid);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
      
        return userData.cart.length;
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

                <AntDesign onPress={() => navigation.goBack()} name="left" size={24} color="black" />
                {/* <Text>Your Bucket</Text> */}
            </View>
        <FlatList
          data={cartList}
          renderItem={({item, index}) => {
            return (
              <View style={styles.itemView}>
                <Image
                  source={{uri: item.image}}
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
                  <TouchableOpacity
                    style={[
                      styles.addToCartBtn,
                      {
                        width: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 15,
                      },
                    ]}
                    onPress={() => {
                      if (item.quality > 1) {
                        removeItem(item);
                      } else {
                        deleteItem(index);
                      }
                    }}>
                    <Text
                      style={{color: '#fff', fontSize: 20, fontWeight: '700'}}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text style={{fontSize: 16, fontWeight: '600'}}>
                    {item.quality}
                  </Text> 
                  <TouchableOpacity
                    style={[
                      styles.addToCartBtn,
                      {
                        width: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 15,
                      },
                    ]}
                    onPress={() => {
                      addItem(item);
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: '700',
                      }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        {cartList.length > 0 && (
          <View style={styles.checkoutView}>
            <Text style={{color: '#000', fontWeight: '600'}}>
              {'Items(' + cartList.length + ')\nTotal: $' + getTotal()}
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
              onPress={() => {
                navigation.navigate('PickUp');
              }}>
              <Text style={{color: '#fff'}}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  
  export default Cart;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    itemView: {
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
    descText: {
      fontSize: 14,
      fontWeight: '600',
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
    addRemoveView: {
      flexDirection: 'row',
      alignItems: 'center',
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
  });