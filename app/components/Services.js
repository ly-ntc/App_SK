import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { db } from '../firebase';

const Services = () => {
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    getItems();
  }, [useIsFocused]);
  const getItems = async () => {
    try {
      const colRef = collection(db, "category");
      const docsSnap = await getDocs(colRef);
      const itemsList = [];
      docsSnap.forEach((doc) => {
        const data = doc.data();
        itemsList.push({ ...data, id: doc.id });
      });
      setCategoryList(itemsList);
      
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };
  return (
    <View style={{ padding: 10 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categoryList.map((categoryList, index) => (
          <Pressable style={{ margin: 10, backgroundColor: "white", padding: 20, borderRadius: 7 }} key={index}>
            <Image source={{ uri: categoryList.image }} style={{ width: 70, height: 70 }} />

            <Text style={{ textAlign: "center", marginTop: 10 }}>{categoryList.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

export default Services

const styles = StyleSheet.create({})