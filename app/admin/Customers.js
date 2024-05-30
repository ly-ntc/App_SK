import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from "../firebase"; 
import { collection, getDocs } from 'firebase/firestore';

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    try {
      const colRef = collection(db, 'users'); 
      const docsSnap = await getDocs(colRef);
      const customersList = [];
      docsSnap.forEach(doc => {
        const data = doc.data();
        if (data.position === "1") {
          customersList.push({ ...data, id: doc.id });
        }

      });
      setCustomers(customersList);
    } catch (error) {
      console.error('Error fetching customers: ', error);
    }
  };

  const renderCustomer = ({ item }) => (
    <View style={styles.customerCard}>
      <Image source={{ uri: item.uri }} style={styles.customerImage} />
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerDetails}>{item.email}</Text>
        <Text style={styles.customerDetails}>{item.phone}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Customers</Text>
      </View>
      <FlatList
        data={customers}
        keyExtractor={item => item.id}
        renderItem={renderCustomer}
      />
    </View>
  );
};

export default Customers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  customerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
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
  customerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  customerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  customerDetails: {
    fontSize: 14,
    color: '#555',
  },
});
