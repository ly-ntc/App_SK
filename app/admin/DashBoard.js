import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Items from './Items';
import Add from './Add';
import Orders from './Orders';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import Customers from './Customers';

import { useNavigation } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const DashBoard = () => {
  const signOutUser = () => {
    signOut(auth).then(() => {
      navigation.replace("Login");
    }).catch(err => {
      console.log(err);
    })
  }
  const [selectedTab, setSelectedTab] = useState(0);
  const navigation = useNavigation();
  const renderSelectedTab = () => {
    switch (selectedTab) {
      case 0:
        return <Items />;
      case 1:
        return <Orders />;
      case 2:
        return <Add navigateToItems={() => setSelectedTab(0)} />; 
      case 3:
        return <Customers />;
      default:
        return <Items />;
    }
  };
  const logout = () => {
    Alert.alert(
      'Xác nhận thoát',
      'Bạn có muốn đăng xuất không?',
      [
        {
          text: 'Không',
          onPress: () => console.log('Không thoát'),
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: signOutUser
        },
      ],
      { cancelable: false }
    );
  }
  return (
    <View style={styles.container}>
      {renderSelectedTab()}
      <View style={styles.bottomView}>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setSelectedTab(0)}>
          <FontAwesome
            name="dropbox"
            size={20}
            style={[
              styles.bottomTabImg,
              { color: selectedTab == 0 ? '#81D773' : 'black' },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setSelectedTab(1)}>
          <FontAwesome5
            name="truck-moving"
            size={20}
            style={[
              styles.bottomTabImg,
              { color: selectedTab == 1 ? '#81D773' : 'black' },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setSelectedTab(2)}>
          <MaterialIcons
            name="add-a-photo"
            size={30}
            style={[
              styles.bottomTabImg,
              { color: selectedTab == 2 ? '#81D773' : 'black' },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setSelectedTab(3)}>
          <Fontisto
            name="persons"
            size={20}
            style={[
              styles.bottomTabImg,
              { color: selectedTab == 3 ? '#81D773' : 'black'  },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => setSelectedTab(4)}>
          <AntDesign
            name="logout"
            size={20}
            style={[
              styles.bottomTabImg,
              { color: selectedTab == 4 ? '#81D773' : 'black' },
            ]}
            onPress={logout}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomView: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
  },
  bottomTab: {
    height: '100%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabImg: {
    // width: 24,
    // height: 24,
  },
});
