import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, Image, View, TouchableOpacity } from "react-native";
import { Component } from "react";

export default function BackNavBar({ title, props, navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image src={"/Users/hungryjared/Desktop/NUS/Projects/Orbital/MedAlert/assets/back-icon.png"} style={styles.backButton} />
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    borderColor: "black",
    borderWidth: 1,
  },

  backButton: {
    width: 30,
    height: 30,
    borderRadius: 1,
    borderColor: "black",
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
