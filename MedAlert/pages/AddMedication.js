import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, Image, View, TouchableOpacity } from "react-native";
import MedicationItem from "../components/MedicationItem/MedicationItem";
import { Component } from "react";
import { FlatList } from "react-native";
import HomeNavBar from "../components/HomeNavBar/HomeNavBar";
import BackNavBar from "../components/BackNavBar/BackNavBar";

export default function AddMedication({ props, navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} />
      {/*</>View style={styles.textContainer}>
        <Text>Hello</Text>
  </View>*/}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-starts",
  },

  backButton: {
    flex: 1,
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
