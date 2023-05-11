import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, Image, View } from "react-native";
import MedicationItem from "../components/MedicationItem/MedicationItem";
import { Component } from "react";
import { FlatList } from "react-native";
import HomeNavBar from "../components/HomeNavBar/HomeNavBar";

export default class HomeScreen extends Component {
  render() {
    const allMedicationItems = this.props.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.homeNavBar}>
          <HomeNavBar style={styles.homeNavBar} />
        </View>
        <View style={styles.medicationInfo}>{allMedicationItems && <FlatList data={allMedicationItems} renderItem={(data) => <MedicationItem title={data.Name} props={data} />} keyExtractor={(item) => item.Name} />}</View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  homeNavBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: "red",
  },
  medicationInfo: {
    flex: 9,
  },
});
