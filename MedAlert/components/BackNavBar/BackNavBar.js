import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, Image, View, TouchableOpacity } from "react-native";
import { Component } from "react";

export default function BackNavBar({ props, navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image src={"/Users/hungryjared/Desktop/NUS/Projects/Orbital/MedAlert/assets/back-icon.png"} style={styles.backButton} />
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Select type of medication</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-starts",
    borderColor: "black",
    borderWidth: 1,
  },

  backButton: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    margin: 1,
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
});
