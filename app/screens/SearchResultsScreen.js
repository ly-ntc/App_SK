import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons'; // Import Ionicons từ thư viện Expo
import DressItem from '../components/DressItem';
import { auth, db } from '../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const SearchResultsScreen = () => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const { query } = route.params;
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigation = useNavigation();
    const [product, setProduct] = useState([]);
    useEffect(() => {
        getItems();
        getCartItems();
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
    const [cartCount, setCartCount] = useState(0);
    
    const getCartItems = async () => {
        const userId = auth.currentUser.uid;
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        setCartCount(userData.cart.length);
    };
    useEffect(() => {
        const results = product.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category?.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(results);
    }, [query, product]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <AntDesign onPress={() => navigation.goBack()} name="left" size={24} color="black" style={styles.left} />
                <Text style={styles.title}>Search Results for "{query}"</Text>

                <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.basket}>
                    <Ionicons name="cart" size={30} />

                    <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#f68d9f', borderRadius: 10, paddingHorizontal: 5 }}>
                        <Text style={{ color: 'white', fontSize: 12 }}>{cartCount}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => (
                    <DressItem item={item} key={index} />
                ))
            ) : (
                <Text style={styles.noResults}>No results found</Text>
            )}
        </ScrollView>
    );
};

export default SearchResultsScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F0F0F0",
        flex: 1,
    },
    contentContainer: {
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Đảm bảo giỏ hàng ở phía bên phải
        padding: 10,
        width: '100%',
    },
    left: {
        position: 'absolute',
        left: 10,
        zIndex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
    },
    noResults: {
        padding: 10,
        textAlign: 'center',
    },
    basket: {
        marginRight: 10,
    },
});
