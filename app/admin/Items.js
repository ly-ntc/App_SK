import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { db } from '../firebase';

import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
const Items = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
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
      setItems(itemsList);
      console.log(itemsList); 
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };

  const deleteItem = async (docId) => {
    try {
      await deleteDoc(doc(db, "products", docId));
      getItems(); // Lấy lại danh sách sau khi xóa
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };
  return (
    <View style={styles.container}>
       <View style={styles.header}>
          <Text style={styles.headerText}>Items</Text>
        </View>
      <FlatList 
        data={items}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.itemView}>
              <Image
                source={{ uri: item.image }}
                
                style={styles.itemImage}
              />
              <View style={styles.nameView}>
                <Text style={styles.nameText}>{item.name}</Text>
                {/* <Text style={styles.descText}>{item.description}</Text> */}
                <View style={styles.priceView}>
                  <Text style={styles.priceText}>
                  {'$' + item.discountPrice}
                   
                  </Text>
                  <Text style={styles.discountText}>   
                  {'$' + item.price}
                  </Text> 
                </View>
              </View>
              <View style={{ margin: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('EditItem', {
                      data: item,
                      id: item.id,
                    });
                  }}>
                  <Image
                    source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWGUswOhxpi10NrBfxPvbnNuFlQkkY-0TaNFXtNVyvzA&s" }}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    deleteItem(item.id);
                  }}>
                  <Image
                    source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkEqb7yH6GMN43ZOyS5_LiZvWutK3h5ihP1Q93v7T6qA&s" }}
                    style={[styles.icon, { marginTop: 20 }]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Items;
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
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 10,
    borderRadius: 10,
    height: 100,
    marginBottom: 10,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
  },
  nameView: {
    width: '53%',
    margin: 10,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
  },
  descText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 18,
    color: '#81D773',
    fontWeight: '700',
  },
  discountText: {
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
