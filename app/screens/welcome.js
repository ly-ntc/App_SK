import { View, Text,StyleSheet, ImageBackground, Image, Dimensions } from 'react-native'
import React, { useEffect, useState, useRef } from 'react';
const {width, height} = Dimensions.get('screen')
const Welcome = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 3000); 
    
    return () => clearTimeout(timer); 
  }, [navigation]);
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.ImageBackground} source={require('../img/welcome1.png')}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../img/logo1.png')} />
          <Text style={styles.logoText}>Make Beauty</Text>
        </View>
      </ImageBackground>
    </View>
  )
}

export default Welcome

const styles = StyleSheet.create({
 container :{
  flex : 1,
  
 },
 ImageBackground :{
  width: width,
  height : height,
  position: 'absolute',
  
 },
 logoContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
 logo : {
    width : 266,
    height: 146,
 },
 logoText: {
  fontSize: 24,
  color: '#6d806b',

},
});
