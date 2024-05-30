import { Button, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { auth, db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { cloneElement, useEffect, useState } from "react";
// import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";

const wS = Dimensions.get('screen').width / 100;

const Info = ({ name, info, user }) => {

    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={[styles.btn, styles.flexBox]}
            onPress={() => navigation.navigate("ChangeInfoUser", user)}
        >
            <Text style={[styles.attribute, styles.textBtn]}>{name}</Text>
            <View style={[styles.flexBox, styles.right]}>
                <Text style={[styles.info, styles.textBtn]}>{info}</Text>
                <Image
                    style={styles.icon}
                    source={require('../img/select.png')}
                />
            </View>
        </TouchableOpacity>
    );
}

const User = () => {

    const navigation = useNavigation();

    const [user, setUser] = useState({});

    useEffect(() => {
        const userId = auth.currentUser.uid; // Lấy user ID từ auth
        const userDocRef = doc(db, 'users', userId);

        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.data();
                const userEmail = auth.currentUser.email; // Lấy email từ auth.currentUser

                setUser({
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
    console.log("user", user);
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={[styles.center, styles.avt]}>
                <Image
                    style={styles.imgAvatar}
                    source={{ uri: user.uri }}
                />
                <TouchableOpacity
                    style={[styles.center, styles.change]}
                    onPress={() => navigation.navigate("ChangeInfoUser", user)}
                >
                    <Text style={styles.textChange}>Touch to change</Text>
                </TouchableOpacity>
            </View>
            <Info
                name='Name'
                info={user.name}
                user={user}
            />
            <Info
                name='Gender'
                info={user.gender}
                user={user}
            />
            <Info
                name='Date of birth'
                info={user.dob}
                user={user}
            />
            <Info
                name='Nationality'
                info={user.nationality}
                user={user}
            />
            <Info
                name='Phone'
                info={user.phone}
                user={user}
            />
            <Info
                name='Email'
                info={user.email}
                user={user}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    avt: {
        width: wS * 100,
        height: wS * 60,
        backgroundColor: '#CDE3C9'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgAvatar: {
        width: wS * 20,
        height: wS * 20,
        objectFit: 'cover',
        borderRadius: wS * 10,
    },
    change: {
        width: wS * 100,
        height: wS * 8,
        backgroundColor: '#6B6E6B',
        position: 'absolute',
        bottom: 0,
    },
    textChange: {
        color: '#ffffff',
    },
    btn: {
        width: wS * 100,
        height: wS * 15,
        paddingHorizontal: wS * 5,
        alignItems: 'center',
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 1,
    },
    flexBox: {
        display: 'flex',
        flexDirection: 'row',
    },
    attribute: {
        flex: 1,
    },
    right: {
        alignItems: 'center',
    },
    icon: {
        width: wS * 5,
        height: wS * 5,
        objectFit: 'cover',
        transform: [{ rotate: '-90deg' }],
        marginLeft: wS * 3,
    },
    textBtn: {
        fontSize: 16,
        color: '#000000',
    }
})

export default User;