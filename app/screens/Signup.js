import React from 'react';
import {
  StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableOpacity, KeyboardAvoidingView,
  Keyboard,
  Alert
} from 'react-native';

import { useState, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";


const { width, height } = Dimensions.get('screen')
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRe, setPasswordRe] = useState("");
  
  const navigation = useNavigation();
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const register = () => {
    if (!validateEmail(email)||email === "" || password === ""|| passwordRe === ""|| password !== passwordRe || password.length < 6) {
      Alert.alert(
        "Invalid Details",
        "Please fill all the details",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
    }
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      console.log("user credential", userCredential);
      const user = userCredential._tokenResponse.email;
      const myUserUid = auth.currentUser.uid;

      setDoc(doc(db, "users", `${myUserUid}`), {
        uri: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/8-anh-dai-dien-trang-inkythuatso-03-15-26-54.jpg",
        name: user,
        gender: "no",
        position: "1",
        dob: "1/1/2003",
        nationality: "VietNam",
        phone: "123456",
        cart : [],
        email: user,
        userId: myUserUid, 
      })
    })
  }
  return (
    <KeyboardAwareScrollView>


      <View style={styles.container}>
        <View style={styles.header}>
        </View>
        <View style={styles.logo}>
          <Image style={styles.logoimg} source={require('../img/logo1.png')} />
        </View>
        <View style={styles.windowlogin}>
          <View style={styles.login}>

            <View style={styles.windowregister}>
              <Text style={styles.register}>
                Register
              </Text>
            </View>

            <View>
              <View style={styles.inputContainer}>
                <Text style={styles.text}>Username:</Text>
                <View style={styles.input}>
                  <View style={styles.inputText}>
                    <View style={{ height: 38, width: 38, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                      <Image style={styles.user} source={require('../img/user.png')} />
                    </View>
                    <View style={{ height: 38, width: 2, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{
                        width: 2,
                        height: 30,
                        backgroundColor: 'black',
                      }}>
                      </View>
                    </View>

                    <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholderTextColor="black"
                    style={styles.inputContent} />
                  </View>

                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.text}>Password:</Text>
                <View style={styles.input}>
                  <View style={styles.inputText}>
                    <View style={{ height: 38, width: 38, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                      <Image style={styles.user} source={require('../img/Vector.png')} />
                    </View>
                    <View style={{ height: 38, width: 2, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{
                        width: 2,
                        height: 30,
                        backgroundColor: 'black',
                      }}>
                      </View>
                    </View>

                    <TextInput placeholder="**********"
                     onChangeText={(text) => setPassword(text)}
                     secureTextEntry={true}
                     placeholderTextColor="black"
                      style={styles.inputContent} />
                  </View>

                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.text}>Accuracy:</Text>
                <View style={styles.input}>
                  <View style={styles.inputText}>
                    <View style={{ height: 38, width: 38, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                      <Image style={styles.user} source={require('../img/Vector.png')} />
                    </View>
                    <View style={{ height: 38, width: 2, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{
                        width: 2,
                        height: 30,
                        backgroundColor: 'black',
                      }}>
                      </View>
                    </View>

                    <TextInput placeholder="***********" 
                    onChangeText={(text) => setPasswordRe(text)}
                    secureTextEntry={true}
                    placeholderTextColor="black" style={styles.inputContent} />
                  </View>

                </View>
              </View>
            </View>

            <View style={styles.account}>
              <Text style={{ fontStyle: 'italic' }}>You have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={{ color: '#9cdf91', fontStyle: 'italic', textDecorationLine: 'underline', marginLeft: 10 }}>Log In</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.submit}>
              <TouchableOpacity  onPress={register}>
                <View style={styles.submitButton}>
                  <Text style={styles.submitText}>submit</Text>
                </View>
              </TouchableOpacity>
            </View>


          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.register}>Welcome to SKINBEA</Text>

        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default Signup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },
  header: {
    backgroundColor: '#81d773',
    width: width,
    height: (60 / 932) * height,
    borderBottomRightRadius: 20 / 932 * height,
    borderBottomLeftRadius: 20 / 932 * height,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: width,
    height: 171 / 932 * height,
    // backgroundColor : 'red'
  },
  logoimg: {
    width: 230 / 430 * width,
    height: 101 / 932 * height,
    paddingTop: 35 / 932 * height,
    paddingBottom: 35 / 932 * height,

  },
  login: {
    width: 370 / 430 * width,
    height: 580 / 932 * height,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#f6f4f4',
    borderRadius: 10,
  },
  windowlogin: {
    width: width,
    height: 580 / 932 * height,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  windowregister: {
    width: 370 / 430 * width,
    height: 70 / 932 * height,
    alignItems: 'center',
    alignContent: 'center',
    // backgroundColor : 'red'
  },
  register: {
    // fontFamily : 'Inria Serif',
    fontSize: 25,
    paddingTop: 20,
  },
  windowError: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  error: {
    width: 13 / 430 * width,
    height: 13 / 430 * width,
    // backgroundColor : 'black',
    marginRight: 10,
    marginLeft: 30,
  },
  text: {
    // fontFamily : 'Inria Serif',
    fontSize: 20,
    marginLeft: 20,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  inputText: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  input: {
    width: 310 / 430 * width,
    height: 50 / 932 * height,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#f6f4f4',
    borderRadius: 10,
    marginLeft: 20
  },
  inputContent: {
    width: 250 / 430 * width,
    height: 50 / 932 * height,

    // backgroundColor : 'red'
    paddingLeft: 8,
    fontSize: 18,
    fontStyle: 'italic',
    paddingVertical: 5

  },
  inputContainer: {
    marginBottom: 20,
  },

  account: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  footer: {
    backgroundColor: '#81d773',
    width: width,
    height: 96 / 932 * height,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: 25 / 932 * height,
    alignItems: 'center',
    alignContent: 'center'
  },

  submit: {
    width: 370 / 430 * width,
    height: 150 / 932 * height,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    width: 150 / 430 * width,
    height: 50 / 932 * height,
    backgroundColor: '#83f3ec',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 12,
  },
  submitText: {
    color: 'white',
  },

  user: {
    width: 16 / 430 * width,
    height: 18 / 430 * width,
  }
});