import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { Component } from 'react';

export default class MedicationItem extends Component {
  render() {
    const medicationData = this.props.props.item;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <Image src={""}/>
          <Text style={{fontWeight: "bold"}}>{medicationData.Name}</Text>
          <Text>{medicationData.Type}</Text>
          <Text>{medicationData.Purpose}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: "red",
    borderWidth: 2,
  },
  textContainer: {
    backgroundColor: "#FAF6E0",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    margin: 15,
    alignItems: "center",
    height: 100,
    width: 350,
  },
});
