import { StyleSheet, Text, View,  Image } from "react-native";
import { Button, Dimensions, ImageBackground,  TextInput, TouchableOpacity } from "react-native";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import { collection, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const wS = Dimensions.get('screen').width / 100;
const DressItem = ({ item }) => {
  const navigation = useNavigation();
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
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    getCartItems(); 
  

  };

  return (
    <View
      style={styles.formProduct}>
      
      <View style={[styles.flexBox, styles.infoProduct]}>
        <View style={styles.info}>
          <Text style={styles.nameProduct}>Name: {item.name}</Text>
          <View style={styles.flexBox}>
            <View style={[styles.flexBox, styles.alignItems]}>
              <Image
                source={require('../img/type.png')}
                style={styles.icon}
              />
              <Text style={styles.type}>{item.category}</Text>
            </View>
            <View style={[styles.flexBox, styles.alignItems]}>
              <Image
                source={require('../img/price.png')}
                style={styles.icon}
              />
              <Text style={styles.type}>{item.discountPrice}</Text>
            </View>
          </View>
          <View style={styles.flexBox}>
            <TouchableOpacity onPress={onAddToCart} style={[styles.flexBox, styles.box, styles.changeView, styles.btn]}>
              <Image
                source={require('../img/basket.png')}
                style={styles.icon}
              />
              <Text style={[styles.contentContact, styles.changeText]}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ImageBackground
          style={styles.imgProduct}
          resizeMode="cover"
          borderRadius={15}
          source={{ uri: item.image }}
        >
          <TouchableOpacity onPress={()=>
              navigation.navigate('Product', {item: item})
            }  style={styles.btnMore}>
            
              <Text style={styles.more}>More</Text>
            
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </View>
  );
};

export default DressItem;

const styles = StyleSheet.create({
  formProduct: {
    flex: 1,
    height: wS * 40,
    width: wS * 90,
    paddingHorizontal: wS * 4,
    paddingVertical: wS * 3,
    borderRadius: wS * 3,
    marginBottom: 10,
    shadowColor: '#000000',
    elevation: 2,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E6E1E1',
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  logoBrand: {
    width: wS * 7.5,
    height: wS * 7.5,
    borderRadius: wS * 7.5,
    objectFit: 'cover',
  },
  nameBrand: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: wS * 2.5,
    color: '#000000',
  },
  icon: {
    width: wS * 3,
    height: wS * 3,
  },
  contact: {
    fontSize: 15,
    maxWidth: wS * 40,
    alignContent: 'center',
    borderWidth: 1,
    borderColor: '#E6E1E1',
    borderRadius: wS * 7.5,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wS * 18,
    paddingHorizontal: wS * 2.5,
    height: wS * 7.5,
    borderTopLeftRadius: wS * 7.5,
    borderBottomLeftRadius: wS * 7.5,
  },
  contentContact: {
    fontSize: 13,
    marginLeft: wS * 2.5,
    color: '#000000',
  },
 
  changeView: {
    backgroundColor: '#81d773',
  },
  changeIcon: {
    tintColor: '#ffffff',
  },
  changeText: {
    color: '#ffffff',
  },
  infoProduct: {
    flex: 1,
  },
  info: {
    width: wS * 46,
  },
  nameProduct: {
    fontSize: 15,
    color: "#000000",
    marginVertical: wS * 2,
    fontStyle: 'italic',
  },
  alignItems: {
    alignItems: 'center',
    width: wS * 23,
  },
  type: {
    marginLeft: 10,
    color: "#000000",
  },
  imgProduct: {
    width: wS * 40,
    height: wS * 30,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  btnMore: {
    width: wS * 40,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  more: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  btn: {
    borderWidth: 1,
    borderColor: '#E6E1E1',
    borderRadius: wS * 7.5,
    marginRight: wS * 5,
    marginTop: wS * 5,
  }
});