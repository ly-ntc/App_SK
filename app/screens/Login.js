import React from 'react';
import {
  StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableOpacity, KeyboardAvoidingView,
  Keyboard,
  Alert,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useState, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native';
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
const { width, height } = Dimensions.get('screen')
const Login = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // useEffect(() => {
  //   setLoading(true);
  //   const unsubscribe = auth.onAuthStateChanged((authUser) => {
  //     if (!authUser) {
  //       setLoading(false);
  //     }
  //     if (authUser) {
  //       // navigation.replace("MyTab");
  //     }
  //   });

  //   return unsubscribe;
  // }, [])
  useEffect(() => {
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (!authUser) {
        setLoading(false);
      } else {
        const userId = auth.currentUser.uid;
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();
        console.log("user position", userData.position)
        
        if (userData.position === '0') {
          navigation.navigate("DashBoard");
        } else if(userData.position === '1') {
          navigation.replace("MyTab");
        }
      }
    });

   
  return unsubscribe;
  }, []); 
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const login = () => {
    if (!validateEmail(email)||email === "" || password === "" || password.length < 6) {
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
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      console.log("user credential", userCredential);
      const user = userCredential.user;
      console.log("user details", user)
    })
  }
  return (
    <SafeAreaView>
      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", alignItems: 'center', flexDirection: "row", flex: 1 }}>
          <Text style={{ marginRight: 10 }}>Loading</Text>
          <ActivityIndicator size="large" color={"red"} />
        </View>
      ) : (
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
                    Log In
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

                        <TextInput
                          value={password}
                          onChangeText={(text) => setPassword(text)}
                          placeholder="Password"
                          placeholderTextColor="black"
                          secureTextEntry={true} style={styles.inputContent} />
                      </View>

                    </View>
                  </View>
                </View>

                <View style={styles.account}>
                  <Text style={{ fontStyle: 'italic', color: '#345' }}>You don’t have an account?  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Signup")} >
                    <Text style={{ color: '#9cdf91', fontStyle: 'italic', textDecorationLine: 'underline', marginLeft: 10 }}>Register</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.submit}>
                  <TouchableOpacity onPress={login} style={styles.submitButton}>
                    <Text style={styles.submitText}>submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.register}>Welcome to SKINBEA</Text>

            </View>
          </View>
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>


  )
}

export default Login
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
    height: 517 / 932 * height,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#f6f4f4',
    borderRadius: 10,
  },
  windowlogin: {
    width: width,
    height: 580 / 932 * height,
    alignItems: 'center',
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
    color: '#000',
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
    color: '#000',
  },
  inputText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#000',
  },
  input: {
    width: 310 / 430 * width,
    height: 50 / 932 * height,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#f6f4f4',
    borderRadius: 10,
    marginLeft: 20,
    alignItems: 'center',
  },
  inputContent: {
    width: 250 / 430 * width,
    height: 50 / 932 * height,

    // backgroundColor : 'red',
    paddingLeft: 8,
    fontSize: 18,
    fontStyle: 'italic',
    paddingVertical: 5,
    color: '#333',

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
    // marginTop: 25 / 932 * height,
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
    alignContent: 'center'
  },
  submitText: {
    color: 'white',
  },

  user: {
    width: 16 / 430 * width,
    height: 18 / 430 * width,
  }
});