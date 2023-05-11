import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, Image, View } from "react-native";
import { Component } from "react";

export default class HomeNavBar extends Component {
  render() {
    return (
      <View style={"styles.container"}>
        <View style={styles.textContainer}>
          <Text style={{ fontWeight: "bold", fontSize: 25 }}>Upcoming Reminders</Text>
        </View>
        <View style={styles.addButtonContainer}>
          <Image src={"/Users/hungryjared/Desktop/NUS/Projects/Orbital/MedAlert/assets/plus-icon.png"} style={styles.addButton} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "red",
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
  },
  addButtonContainer: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
  },
  addButton: {
    height: 35,
    width: 35,
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "black",
    // justifyContent: "flex-end",
  },
});
