import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, doc, updateDoc, getDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useRoute } from '@react-navigation/native';
import ModalSelector from 'react-native-modal-selector';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const EditItem = ({ navigation }) => {
    const route = useRoute();
    const itemId = route.params.id;

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('x');
    const [category, setCategory] = useState('route.params.data.category');
    const [categoryList, setCategoryList] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            const docRef = doc(db, 'products', itemId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.name);
                setPrice(data.price.toString());
                setDiscountPrice(data.discountPrice.toString());
                setDescription(data.description);
                setImageUrl(data.image);
                setCategory(data.category);
            }
             
        };
        
        const fetchCategories = async () => {
            const querySnapshot = await getDocs(collection(db, 'category'));
            const categories = querySnapshot.docs.map(doc => ({
                key: doc.id,
                label: doc.data().name,
            }));
        
            setCategoryList(categories);
        
           
        };
         
        fetchCategories();
        fetchItem();
       
        // console.log("category", category)
    }, [itemId]);
    
    const openImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        }
    };

    // const uploadItem = async () => {
    //     let imageUri = imageUrl;
    //     if (imageUrl !== route.params.data.image) {
    //         const response = await fetch(imageUrl);
    //         const blob = await response.blob();
    //         const storageRef = ref(storage, `products/${Date.now()}.jpg`);
    //         await uploadBytes(storageRef, blob);
    //         imageUri = await getDownloadURL(storageRef);
    //     }

    //     const productsRef = doc(db, 'products', itemId);
    //     await updateDoc(productsRef, {
    //         name,
    //         price: parseFloat(price),
    //         discountPrice: parseFloat(discountPrice),
    //         description,
    //         image: imageUri,
    //         category,
    //     });

    //     navigation.goBack();
    // };

    const uploadItem = async () => {
        if (imageUrl === route.params.data.image) {
            const productsRef = doc(db, 'products', route.params.id);
            await updateDoc(productsRef, {
                name: name,
                price: parseFloat(price),
                discountPrice: parseFloat(discountPrice), // Chuyển đổi giá thành số
                description: description,
                category: category,
            }).then(()=>{
                console.log("Sửa sản phẩm thành công");
                navigation.goBack();
            });
        } else {
            resp = await fetch(imageUrl);
            const blob = await resp.blob();
            const storageRef = ref(storage, 'products/' + Date.now() + "jpg");

            uploadBytes(storageRef, blob).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            }).then((resp) => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    console.log(downloadURL);
                    // setUri(downloadURL);
                    // console.log(name);
                    const productsRef = doc(db, 'products', route.params.id);
                    await updateDoc(productsRef, {
                        name: name,
                        price: parseFloat(price), 
                        description: description,
                        image: downloadURL,
                        category: category,
                        discountPrice: parseFloat(discountPrice), 
                    });

                    // console.log("Sửa sản phẩm thành công");

                }).then(() => {
                    console.log("Sửa sản phẩm thành công");
                    navigation.goBack();
                })
            });
        }
    };

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Edit Item</Text>
                </View>
                <Image source={{ uri: imageUrl }} style={styles.imageStyle} />
                <TextInput
                    placeholder="Enter Item Name"
                    style={styles.inputStyle}
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    placeholder="Enter Item Price"
                    style={styles.inputStyle}
                    value={price}
                    onChangeText={setPrice}
                />
                <TextInput
                    placeholder="Enter Item Discount Price"
                    style={styles.inputStyle}
                    value={discountPrice}
                    onChangeText={setDiscountPrice}
                />
                <TextInput
                    placeholder="Enter Item Description"
                    style={styles.inputStyle}
                    value={description}
                    onChangeText={setDescription}
                />
                <ModalSelector
                    data={categoryList}
                    initValue={category}
                    labelKey="name"  // Sử dụng giá trị category từ state
                    onChange={(option) => setCategory(option.label)}
                    style={styles.dropDown}
                   
                    // selectTextStyle={styles.dropDownText}
                    // initValueTextStyle={styles.dropDownPlaceholder}
                    
                />
                <TouchableOpacity style={styles.pickBtn} onPress={openImagePicker}>
                    <Text>Pick Image From Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadBtn} onPress={uploadItem}>
                    <Text style={styles.uploadBtnText}>Upload Item</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default EditItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 60,
        width: '100%',
        backgroundColor: '#fff',
        elevation: 5,
        paddingLeft: 20,
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '700',
    },
    inputStyle: {
        width: '90%',
        height: 50,
        borderRadius: 10,
        borderWidth: 0.5,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 30,
        alignSelf: 'center',
    },
    pickBtn: {
        width: '90%',
        height: 50,
        borderWidth: 0.5,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    uploadBtn: {
        backgroundColor: '#F68D9F',
        width: '90%',
        height: 50,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 70,
    },
    imageStyle: {
        width: '90%',
        height: 200,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
    },
    dropDown:{
        width: '90%',
        height: 50,
        alignSelf: 'center',
        marginTop: 20,
    }
});