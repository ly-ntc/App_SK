import React, { useEffect, useState, useRef } from 'react';
import {
    ScrollView,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase'
import { collection, getDoc, getDocs , doc,onSnapshot} from 'firebase/firestore';
import { signOut } from 'firebase/auth';


// import Payment from './Payment';
// import Goods from './Goods';

const Setting = () => {
    const navigation = useNavigation();
    const [use, setUse] = useState({});

    const user = auth.currentUser;
    
    const signOutUser = () => {
        signOut(auth).then(() => {
            navigation.replace("Login");
        }).catch(err => {
            console.log(err);
        })
    }
   
    useEffect(() => {
        const userId = auth.currentUser.uid; 
        console.log(userId);
        const userDocRef = doc(db, 'users', userId);

        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.data();
                const userEmail = auth.currentUser.email; 

                setUse({
                    uri: userData.uri,
                    name: userData.name,
                    gender: userData.gender,
                    dob: userData.dob,
                    nationality: userData.nationality,
                    phone: userData.phone,
                    email: userEmail,
                    id: userId,
                });
            } else {
                console.log('No such document!');
            }
        });

        return () => unsubscribe(); 
    }, []); 
   
    const handleExit = () => {
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
    };

    
    return (
        <SafeAreaView
            style={{
                flex: 100
            }}
        >
            <View
                style={{
                    flex: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: 18,
                    alignItems: 'center',
                    marginVertical: 10,
                }}
            >
                <Text style={{
                    fontSize: 30,
                    color: '#000',
                    fontWeight: '700',
                }}>Setting</Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#ccc',
                        padding: 5,
                        borderRadius: 50,
                    }}
                    onPress={() => {

                    }}
                >
                    <Image
                        style={{
                            width: 30,
                            height: 30,
                        }}
                        source={require("../img/setting.png")} />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flex: 20,
                    // flexDirection: 'row',
                    marginHorizontal: 15,
                    borderColor: '#ccc',
                    borderWidth: 1,
                    borderRadius: 5,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 20,
                        marginTop: 30,
                        alignItems: 'center',
                        borderBottomWidth: 2,
                        borderColor: '#ccc',
                        paddingBottom: 20,
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 50,
                            }}
                            source={{uri: use.uri}} />
                        <Text
                            style={{
                                marginStart: 20,
                                fontSize: 30,
                                color: '#000',
                            }}
                        >{use.name}</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#ccc',
                            padding: 2,
                            borderRadius: 50,
                        }}
                        onPress={() => {

                        }}
                    >
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                            }}
                            source={require("../img/select.png")} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 20,
                        alignItems: 'center',
                        flex: 1,
                    }}
                    onPress={() => {
                        navigation.navigate("Signup");
                    }}
                >
                    <Image
                        style={{
                            width: 20,
                            height: 20,
                            marginRight: 5,
                            // padding: 50,
                        }}
                        source={require("../img/add.png")} />
                    <Text
                        style={{
                            fontSize: 16,
                            fontStyle: 'italic',
                        }}
                    >Create a new account</Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flex: 30,
                    marginTop: 15,
                    // backgroundColor: 'red',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 15,
                    }}
                >
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Cart')
                            // {alert("hele");}
                        }
                        style={{
                            flex: 1,
                            // backgroundColor: 'red',
                            borderColor: '#ccc',
                            borderWidth: 1,
                            borderRadius: 4,
                            paddingVertical: 15,
                            paddingLeft: 9,
                        }}
                    >
                        <Image
                            style={{
                                width: 20,
                                height: 20,

                            }}
                            source={require("../img/basket.png")} />
                        <Text style={{ color: '#000', }}>Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            // backgroundColor: 'red',
                            borderColor: '#ccc',
                            borderWidth: 1,
                            borderRadius: 4,
                            paddingVertical: 15,
                            paddingLeft: 9,
                            marginStart: 5,
                        }}
                        onPress={() => navigation.navigate("Orders")}
                    >
                        <Image
                            style={{
                                width: 20,
                                height: 20,

                            }}
                            source={require("../img/cart.png")} />
                        <Text style={{ color: '#000', }}>My Orders</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 15,
                        marginTop: 5,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            borderColor: '#ccc',
                            borderWidth: 1,
                            borderRadius: 4,
                            paddingVertical: 15,
                            paddingLeft: 9,
                        }}
                        onPress={() => navigation.navigate("BeingTransported")}
                    >
                        <Image
                            style={{
                                width: 20,
                                height: 20,

                            }}
                            source={require("../img/transport.png")} />
                        <Text style={{ color: '#000', }}>Being transported</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            // backgroundColor: 'red',
                            borderColor: '#ccc',
                            borderWidth: 1,
                            borderRadius: 4,
                            paddingVertical: 15,
                            paddingLeft: 9,
                            marginStart: 5,
                        }}
                        onPress={() => navigation.navigate("Finish")}
                    >
                        <Image
                            style={{
                                width: 20,
                                height: 20,

                            }}
                            source={require("../img/damua.png")} />
                        <Text style={{ color: '#000', }}>Finish</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{
                        marginTop: 10,
                        backgroundColor: '#ccc',
                        height: 30,
                        alignItems: 'center',
                        marginHorizontal: 15,
                        justifyContent: 'center',
                        borderRadius: 3,
                    }}
                    onPress={() => {

                    }}>
                    <Text style={{ color: '#000', }}>More</Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flex: 40,
                }}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        borderColor: '#ccc',
                        borderTopWidth: 1,
                        paddingTop: 10,
                        marginTop: 10,
                    }}
                    onPress={() => {

                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#ccc',
                            borderRadius: 50,
                            padding: 3,
                            marginStart: 15,
                            marginEnd: 5,
                        }}
                    >
                        <Image
                            style={{
                                width: 18,
                                height: 18,
                            }}
                            source={require("../img/setting.png")} />
                    </View>
                    <Text style={{ color: '#000', fontSize: 18, }}>Setting & Access</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        borderColor: '#ccc',
                        borderTopWidth: 1,
                        paddingTop: 10,
                        marginTop: 10,

                    }}
                    onPress={() => {

                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#ccc',
                            borderRadius: 50,
                            padding: 3,
                            marginStart: 15,
                            marginEnd: 5,
                        }}
                    >
                        <Image
                            style={{
                                width: 18,
                                height: 18,
                            }}
                            source={require("../img/help.png")} />
                    </View>
                    <Text style={{ color: '#000', fontSize: 18, }}>Support & Help</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        borderColor: '#ccc',
                        borderTopWidth: 1,
                        paddingTop: 10,
                        marginTop: 10,
                    }}
                    onPress={() => {

                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#ccc',
                            borderRadius: 50,
                            padding: 3,
                            marginStart: 15,
                            marginEnd: 5,
                        }}
                    >
                        <Image
                            style={{
                                width: 18,
                                height: 18,
                            }}
                            source={require("../img/comment.png")} />
                    </View>
                    <Text style={{ color: '#000', fontSize: 18, }}>Comments</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#ccc',
                        marginHorizontal: 15,
                        marginVertical: 30,
                        padding: 8,
                        alignItems: 'center',
                        borderRadius: 4,
                    }}
                    onPress={handleExit}>
                    <Text style={{ color: '#000' }}>Sign out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Setting;