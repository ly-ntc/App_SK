import { useNavigation } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, View, Text, Alert, Button, ScrollView } from "react-native";
import { db, auth, storage } from "../firebase";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const wS = Dimensions.get('screen').width / 100;

const Change = ({ property }) => {
    return (
        <View style={styles.info}>
            <Text style={styles.old}>{property}: </Text>
            <View style={{ ...styles.flexBox, alignItems: 'center' }}>
                <TextInput
                    style={styles.new}
                    placeholder="Enter new value..."
                    onChangeText={(text) => handleChange(text)}
                />
                <View style={[styles.change, styles.center]}>
                    <Image style={styles.edit} source={require('../img/edit.png')} />
                </View>
            </View>
        </View>
    );
}

const ChangeInfoUser = ({ route }) => {
    const navigation = useNavigation();
    const user = route.params;

    const [id, setId] = useState(`${user.id}`);
    const [uri, setUri] = useState(`${user.uri}`);
    const [name, setName] = useState(`${user.name}`);
    const [gender, setGender] = useState(`${user.gender}`);
    const [dob, setDob] = useState(`${user.dob}`);
    const [nation, setNation] = useState(`${user.nationality}`);
    const [phone, setPhone] = useState(`${user.phone}`);
    const [email, setEmail] = useState(`${user.email}`);

    const openImagePicker = async () => {
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setUri(result.assets[0].uri);
        }
    };

    const handleCameraLaunch = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setUri(result.assets[0].uri);
        }
    };

    const update = async () => {
        if (uri === user.uri) {
            const userRef = doc(db, 'users', id);
            await updateDoc(userRef, {
                name: name,
                gender: gender,
                dob: dob,
                nationality: nation,
                phone: phone,
                email: email
            });
            navigation.navigate("User");
        } else {
            resp = await fetch(uri);
            const blob = await resp.blob();
            const storageRef = ref(storage, 'user/' + Date.now() + "jpg");

            uploadBytes(storageRef, blob).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            }).then((resp) => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    console.log(downloadURL);
                    // setUri(downloadURL);

                    const userRef = doc(db, 'users', id);
                    await updateDoc(userRef, {
                        uri: downloadURL,
                        name: name,
                        gender: gender,
                        dob: dob,
                        nationality: nation,
                        phone: phone,
                        email: email
                    });

                }).then(()=>{
                    navigation.navigate("User");
                })
            });
            // navigation.navigate("User");
        }

    };

    return (
        <KeyboardAwareScrollView>
            <View>
                <View style={[styles.flexBox, styles.back]}>
                    <TouchableOpacity
                        style={[styles.return, styles.center]}
                        onPress={() => navigation.navigate('User')}
                    >
                        <Image
                            source={require("../img/left2.png")}
                            style={styles.callback}
                        />
                    </TouchableOpacity>
                    <Text style={styles.txtCallback}></Text>
                </View>
                <View style={styles.center}>
                    <View style={[styles.flexBox, styles.center]}>

                        <Image
                            style={styles.image}
                            source={{
                                uri: uri
                            }}
                            resizeMode="contain"
                        />

                        <View style={styles.center}>
                            <View>
                                <Button title="Choose from Device" onPress={openImagePicker} />
                                <View style={{ marginVertical: 8 }}></View>
                                <Button title="Open Camera" onPress={handleCameraLaunch} />
                            </View>
                        </View>
                    </View>

                    <ScrollView style={{ width: wS * 100 }}>
                        <View style={styles.info}>
                            <Text style={styles.old}>Name: </Text>
                            <View style={{ ...styles.flexBox, alignItems: 'center' }}>
                                <TextInput
                                    style={styles.new}
                                    placeholder="Enter new value..."
                                    value={name}
                                    onChangeText={(text) => setName(text)}
                                />
                            </View>
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.old}>Gender: </Text>
                            <View style={{ ...styles.flexBox, alignItems: 'center' }}>
                                <TextInput
                                    style={styles.new}
                                    placeholder="Enter new value..."
                                    onChangeText={(text) => setGender(text)}
                                    value={gender}
                                />
                            </View>
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.old}>Date of birth: </Text>
                            <View style={{ ...styles.flexBox, alignItems: 'center' }}>
                                <TextInput
                                    style={styles.new}
                                    placeholder="Enter new value..."
                                    onChangeText={(text) => setDob(text)}
                                    value={dob}
                                />
                            </View>
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.old}>Nationality: </Text>
                            <View style={{ ...styles.flexBox, alignItems: 'center' }}>
                                <TextInput
                                    style={styles.new}
                                    placeholder="Enter new value..."
                                    value={nation}
                                    onChangeText={(text) => setNation(text)}
                                />
                            </View>
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.old}>Phone: </Text>
                            <View style={{ ...styles.flexBox, alignItems: 'center' }}>
                                <TextInput
                                    style={styles.new}
                                    placeholder="Enter new value..."
                                    value={phone}
                                    onChangeText={(text) => setPhone(text)}
                                />
                            </View>
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.old}>Email: </Text>
                            <View style={{ ...styles.flexBox, alignItems: 'center' }}>
                                <TextInput
                                    style={styles.new}
                                    placeholder="Enter new value..."
                                    value={email}
                                    onChangeText={(text) => setEmail(text)}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.update, styles.center]}
                        onPress={update}
                    >
                        <Text style={styles.txt}>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    flexBox: {
        display: 'flex',
        flexDirection: 'row',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    back: {
        marginTop: wS * 2,
        marginLeft: wS * 2,
    },
    callback: {
        width: wS * 5,
        height: wS * 5,
    },
    return: {
        width: wS * 10,
        height: wS * 10,
        borderRadius: wS * 6,
        backgroundColor: '#ccc',
    },
    txtCallback: {
        fontSize: 30,
        marginLeft: wS * 2,
    },
    uri: {
        paddingHorizontal: wS * 10,
        paddingVertical: wS * 3,
        justifyContent: 'space-evenly',
    },
    image: {
        width: wS * 28,
        height: wS * 28,
        objectFit: 'cover',
        borderRadius: wS * 16,
        marginRight: wS * 10,
        borderColor: '#81d773',
        borderWidth: 5,
    },
    newImg: {
        borderWidth: 1,
        borderColor: '#cccccc',
        width: wS * 50,
        height: wS * 8,
        padding: 0,
        paddingLeft: wS * 4,
        color: '#000000',
        borderRadius: wS * 2,
    },
    btn: {
        marginTop: wS,
        backgroundColor: 'aqua',
        width: wS * 20,
        height: wS * 8,
        borderRadius: wS * 2,
    },
    txt: {
        color: '#ffffff',
        fontWeight: '800',
    },
    info: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginHorizontal: wS * 4,
        paddingHorizontal: wS * 4,
        paddingTop: wS * 3,
        paddingBottom: wS * 4,
    },
    old: {
        fontSize: 20,
        marginBottom: wS * 2,
    },
    new: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#6B6E6B',
        height: wS * 8,
        padding: 0,
        paddingLeft: wS * 4,
        borderRadius: wS * 5,
        // borderBottomLeftRadius: wS * 2,
    },
    change: {
        width: wS * 8,
        height: wS * 8,
        backgroundColor: '#6B6E6B',
        borderWidth: 1,
        borderColor: '#6B6E6B',
        borderTopRightRadius: wS * 2,
        borderBottomRightRadius: wS * 2,
    },
    edit: {
        width: wS * 4,
        height: wS * 4,
        objectFit: 'cover',
        tintColor: '#fff',
    },
    update: {
        width: wS * 30,
        height: wS * 10,
        backgroundColor: '#81d773',
        borderRadius: wS * 2,
        marginTop: wS * 2,
    }
})

export default ChangeInfoUser;