import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [finish, setForFinish] = useState([]);
  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = async () => {
    try {
      const colRef = collection(db, "orders");
      const docsSnap = await getDocs(colRef);
      const itemsList = [];
      docsSnap.forEach((doc) => {
        const data = doc.data();
        itemsList.push({ ...data, id: doc.id });
      });
      setOrders(itemsList);
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };

  
  const confirmOrder = async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        confirm: 'yes'
      });

      const orderSnapshot = await getDoc(orderRef);
      const orderData = orderSnapshot.data();
      const userId = orderData.userId;
      const createdAt = orderData.createdAt;

      const userRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();


      const updatedOrders = userData.orders.map(order =>
        order.createdAt === createdAt ? { ...order, confirm: 'yes' } : order
        // console.log(order.createdAt)
      );

      await updateDoc(userRef, {
        orders: updatedOrders
      });

      console.log('Order confirmed successfully and user orders updated');

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, confirm: 'yes' } : order
        )
      );
    } catch (error) {
      console.error('Error confirming order: ', error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Orders</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 5,
            }}>
              <Text>{'OrderBy: ' + item.orderBy}</Text>
              <Pressable
                style={{
                  backgroundColor: item.confirm === 'yes' && item.finish === 'yes' ? '#F68D9F' : '#81D773',
                  padding: 8,
                  borderRadius: 10,
                }}
                onPress={() => confirmOrder(item.id)}
              >
                <Text style={{ color: 'white' }}>
                  {item.confirm === 'yes' && item.finish === 'yes' ? 'Finished' : item.confirm === 'yes' ? 'Transport' : 'Confirm'}
                </Text>
              </Pressable>
            </View>
            <FlatList
              data={item.items}
              keyExtractor={(subItem, index) => `${item.id}-${index}`}
              renderItem={({ item: subItem }) => (
                <View style={styles.itemView}>
                  <Image
                    source={{ uri: subItem.image }}
                    style={styles.itemImage}
                  />
                  <View>
                    <Text style={styles.nameText}>{subItem.name}</Text>
                    <Text style={styles.nameText}>
                      {'Price: ' + subItem.discountPrice + ', Qty: ' + subItem.quality}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Orders;

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
  orderItem: {
    width: '90%',
    borderRadius: 10,
    elevation: 5,
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  itemView: {
    margin: 10,
    width: '100%',
    flexDirection: 'row',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 20,
    marginTop: 5,
  },
});
