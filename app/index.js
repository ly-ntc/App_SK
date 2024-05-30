import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from "./StackNavigator";

export default function index() {
  return (
    <View style = {styles.container}>
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      <StackNavigator/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
   
  },
});
