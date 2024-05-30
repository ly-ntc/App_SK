import { StyleSheet, Text, View, SafeAreaView, Alert, Pressable, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from "expo-location"
// import Carousel from '../components/Carousel';
import Services from '../components/Services';
import DressItem from '../components/DressItem';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { collection, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";


const HomeScreen = () => {
  
    const userUid = auth.currentUser.uid;
    const [uriImg, setUriImg] = useState("https://inkythuatso.com/uploads/thumbnails/800/2023/03/8-anh-dai-dien-trang-inkythuatso-03-15-26-54.jpg");
    const [searchQuery, setSearchQuery] = useState("");
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const userDocRef = doc(db, 'users', userUid);

        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.data();
                setUriImg(userData.uri);
                console.log(uriImg);
            } else {
                console.log('No such document!');
            }
        });

        return () => unsubscribe();
    }, []);

    
    useEffect(() => {
        const getCartFromFirebase = async () => {
            try {
                const docRef = doc(db, 'users', userUid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setCart(userData.cart);
                }
                console.log("getting cart success")
            } catch (error) {
                console.error('Error getting cart from Firebase:', error);
            }
        };

        getCartFromFirebase();
    }, [isFocused]);


    const [displayCurrentAddress, setdisplayCurrentAddress] = useState("we are loading your location");
    const [locationServicesEnabled, setlocationServicesEnabled] = useState(false);

    useEffect(() => {
        checkIfLocationEnabled();
        getCurrentLocation();
    }, []);

    const checkIfLocationEnabled = async () => {
        let enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            Alert.alert(
                "Location services not enabled",
                "Please enable the location services",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") },
                ],
                { cancelable: false }
            );
        } else {
            setlocationServicesEnabled(enabled);
        }
    };

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission denied",
                "allow the app to use the location services",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") },
                ],
                { cancelable: false }
            );
        }

        const { coords } = await Location.getCurrentPositionAsync();
        if (coords) {
            const { latitude, longitude } = coords;

            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            for (let item of response) {
                let address = `${item.name} ${item.city}`;
                setdisplayCurrentAddress(address);
            }
        }
    };

    // const product = useSelector((state) => state.product.product);
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     if (product.length > 0) return;

    //     const fetchProducts = async () => {
    //         const colRef = collection(db, "products");
    //         const docsSnap = await getDocs(colRef);
    //         docsSnap.forEach((doc) => {
    //             items.push(doc.data());
    //         });
    //         items?.map((service) => dispatch(getProducts(service)));
    //     };
    //     fetchProducts();
    // }, []);

    const [product, setProduct] = useState([]);
    useEffect(() => {
        getItems();
    }, [isFocused]);
    const getItems = async () => {
        try {
            const colRef = collection(db, "products");
            const docsSnap = await getDocs(colRef);
            const itemsList = [];
            docsSnap.forEach((doc) => {
                const data = doc.data();
                itemsList.push({ ...data, id: doc.id });
            });
            setProduct(itemsList);
            console.log(product); 
        } catch (error) {
            console.error("Error fetching items: ", error);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            navigation.navigate('SearchResults', { query: searchQuery });
        }
    };

    const services = [
        {
            id: "0",
            image: "https://cdn-icons-png.flaticon.com/128/4643/4643574.png",
            name: "shirt",
            quantity: 0,
            price: 10,
        },
        {
            id: "11",
            image: "https://cdn-icons-png.flaticon.com/128/892/892458.png",
            name: "T-shirt",
            quantity: 0,
            price: 10,
        },
        {
            id: "12",
            image: "https://cdn-icons-png.flaticon.com/128/9609/9609161.png",
            name: "dresses",
            quantity: 0,
            price: 10,
        },
        {
            id: "13",
            image: "https://cdn-icons-png.flaticon.com/128/599/599388.png",
            name: "jeans",
            quantity: 0,
            price: 10,
        },
        {
            id: "14",
            image: "https://cdn-icons-png.flaticon.com/128/9431/9431166.png",
            name: "Sweater",
            quantity: 0,
            price: 10,
        },
        {
            id: "15",
            image: "https://cdn-icons-png.flaticon.com/128/3345/3345397.png",
            name: "shorts",
            quantity: 0,
            price: 10,
        },
        {
            id: "16",
            image: "https://cdn-icons-png.flaticon.com/128/293/293241.png",
            name: "Sleeveless",
            quantity: 0,
            price: 10,
        },
    ];

    return (
        <>
            <ScrollView style={{
                backgroundColor: "#F0F0F0",
                flex: 1,

            }}>
                <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                    <FontAwesome6 name="location-dot" size={30} color="#81d773" />
                    <View >
                        <Text style={{ fontSize: 18, fontWeight: "600" }}>HomeScreen</Text>
                        <Text>{displayCurrentAddress}</Text>
                    </View>

                    <Pressable onPress={() => navigation.navigate("User")} style={{ marginLeft: "auto", marginRight: 7 }}>
                        <Image
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                            source={{ uri: uriImg }} />
                    </Pressable>
                </View>
                {/* Search bar */}
                <View
                    style={{
                        padding: 10, margin: 10, flexDirection: "row",
                        alignContent: "center", justifyContent: "space-between",
                        borderWidth: 0.8,
                        borderColor: "#81d773",
                        borderRadius: 7
                    }}>
                    <TextInput
                        placeholder='Search...'
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                    <TouchableOpacity onPress={handleSearch}>
                        <FontAwesome name="search" size={24} color="#f68d9f" />
                    </TouchableOpacity>
                </View>
                {/* Services */}
                <Services />
                {/* Products */}
                <View style={{ alignItems: 'center' }}>
                    {product.map((item, index) => (
                        <DressItem item={item} key={index} />
                    ))}
                </View>
            </ScrollView>
        </>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})
