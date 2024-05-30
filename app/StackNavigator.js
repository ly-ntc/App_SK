import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer, useIsFocused } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PickUpScreen from './screens/PickUpScreen';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "react-native-gesture-handler";
import Login from './screens/Login';
import Signup from './screens/Signup';
import User from './screens/User';
import Payment_Success from './screens/Payment_Success';
import Cart from './screens/Cart';
import Setting from './screens/Setting';
import { Ionicons } from '@expo/vector-icons';
// import { useSelector } from 'react-redux';
import Welcome from './screens/welcome';
import Address from './screens/Address';
import AddNewAddress from './screens/AddNewAddress';
import changeInfoUser from './screens/changeInfoUser';
import ChangeInfoUser from './screens/changeInfoUser';
// import AdminLogin from './admin/AdminLogin';
// import SelectLogin from './SelectLogin';
import DashBoard from './admin/DashBoard';
import EditItem from './admin/EditItem';
import Add from './admin/Add';
import Items from './admin/Items';
import Orders from './screens/Orders';
import BeingTransported from './screens/BeingTransported';
import Finish from './screens/Finish';
import Product from './screens/product';
import SearchResultsScreen from './screens/SearchResultsScreen';
import { auth, db } from './firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';


const Tab = createBottomTabNavigator();

const MyTab = () => {

  const isFocused = useIsFocused();
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
      const unsubscribe = subscribeToCartCount();
      return () => unsubscribe();
  }, [isFocused]);
  
  const subscribeToCartCount = () => {
      const userId = auth.currentUser.uid;
      const userDoc = doc(db, 'users', userId);
      
      return onSnapshot(userDoc, (userSnapshot) => {
          const userData = userSnapshot.data();
          setCartCount(userData.cart.length);
      });
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingTop: 10,
        },

        tabBarIcon: ({ focused }) => {
          let iconName;
          let iconColor;

          if (route.name === "HomeScreen") {
            iconName = 'home';
          } else if (route.name === "Cart") {
            iconName = 'cart';
          } else if (route.name === "User") {
            iconName = 'person';
          } else if (route.name === "Setting") {
            iconName = 'settings';
          } 

          iconColor = focused ? '#81d773' : 'black';

          if (route.name === "Cart") {
            return (
              <View>
                <Ionicons name={iconName} size={30} color={iconColor} />
                  <View style={{position: 'absolute', top: -5, right: -5, backgroundColor: '#f68d9f', borderRadius: 10, paddingHorizontal: 5}}>
                    <Text style={{color: 'white', fontSize: 12}}>{cartCount}</Text>
                  </View>
              </View>
            );
          }

          return <Ionicons name={iconName} size={30} color={iconColor} />;
        },
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="User" component={User} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
  return (
    
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Signup" component={Signup} options={{headerShown:false}}/>
        <Stack.Screen name="MyTab" component={MyTab} options={{headerShown:false}}/>
        <Stack.Screen name="PickUp" component={PickUpScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Payment_Success' component={Payment_Success} options={{headerShown: false}}/>
        <Stack.Screen name='Address' component={Address} options={{headerShown: false}}/>
        <Stack.Screen name='AddNewAddress' component={AddNewAddress} options={{headerShown: false}}/>
        <Stack.Screen name='ChangeInfoUser' component={ChangeInfoUser} options={{headerShown: false}}/>
        <Stack.Screen name='DashBoard' component={DashBoard} options={{headerShown: false}}/>
        <Stack.Screen name='EditItem' component={EditItem} options={{headerShown: false}}/>
        <Stack.Screen name='Add' component={Add} options={{headerShown: false}}/>
        <Stack.Screen name='Items' component={Items} options={{headerShown: false}}/>
        <Stack.Screen name='Cart' component={Cart} options={{headerShown: false}}/>
        <Stack.Screen name='Orders' component={Orders} options={{headerShown: false}}/>
        <Stack.Screen name='BeingTransported' component={BeingTransported} options={{headerShown: false}}/>
        <Stack.Screen name='Finish' component={Finish} options={{headerShown: false}}/>
        <Stack.Screen name='Product' component={Product} options={{headerShown: false}}/>
        <Stack.Screen name='SearchResults' component={SearchResultsScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    
  )
}

export default StackNavigator

const styles = StyleSheet.create({})