import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, Image, View, TouchableOpacity } from "react-native";
import { Component } from "react";

export default function HomeNavBar({ props, navigation }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25, fontWeight: "bold" }}>Upcoming Reminders </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Add Medication")}>
        <Image src={"/Users/hungryjared/Desktop/NUS/Projects/Orbital/MedAlert/assets/plus-icon.png"} style={styles.addButton} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },
  addButton: {
    height: 35,
    width: 35,
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "transparent",
    // justifyContent: "flex-end",
  },
});
