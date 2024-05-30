import {
    View, Text, StyleSheet, ImageBackground, Image, Dimensions, TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StatusBar,
} from 'react-native'
import React, { useState } from 'react';

const Comment=()  =>{
    return (
        <View style = {styles.container}> 
            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                <Image source={require('../img/userImg.png')} />
                <Text style={{ fontSize: 15 }}>Enami Asa </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image style={styles.starImg} source={require('../img/star.png')} />
                    <Image style={styles.starImg} source={require('../img/star.png')} />
                    <Image style={styles.starImg} source={require('../img/star.png')} />
                    <Image style={styles.starImg} source={require('../img/star.png')} />
                    <Image style={styles.starImg} source={require('../img/nostar.png')} />
                </View>

            </View>
            <Text>I very love it, it is very useful</Text>
            <View style ={{flexDirection: 'row'}}>
                <Image style={styles.starImg} source={require('../img/product_2.png')} />
                <Image style={styles.starImg} source={require('../img/product_2.png')} />
            </View>
        </View>   

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingLeft: 20,
      marginVertical: 10
    
    },
    
  });

export default Comment;
