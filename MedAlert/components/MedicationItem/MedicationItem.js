import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { Component } from "react";

export default class MedicationItem extends Component {
  render() {
    const medicationData = this.props.props.item;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <Image src={"/Users/hungryjared/Desktop/NUS/Projects/Orbital/MedAlert/assets/pill-icon.png"} style={styles.icon} />
          <View style={styles.medicationInfo}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>{medicationData.Name}</Text>
            <Text>{medicationData.Purpose}</Text>
            <Text>{medicationData.Instructions.TabletsPerIntake} tablets per intake</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  icon: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    margin: 20,
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
    flexDirection: "row",
  },
  medicationInfo: {
    flex: 3,
  },
});
