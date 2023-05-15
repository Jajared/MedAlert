import { StyleSheet, Text, SafeAreaView, Image, View, useState } from "react-native";
import MedicationItem from "../components/MedicationItem/MedicationItem";
import { FlatList } from "react-native";
import HomeNavBar from "../components/HomeNavBar/HomeNavBar";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";

export default function HomeScreen({ props, navigation }) {
  const allMedicationItems = props.allMedicationItems;

  function deleteMedication(medicationData) {
    setAllMedicationItems((prevState) => prevState.filter(medicationData));
  }

  function deleteMedicationItem() {
    alert("Delete button pressed")
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topNavBar}>
        <HomeNavBar navigation={navigation} />
      </View>
      <View style={styles.medicationSection}>{allMedicationItems && <FlatList data={allMedicationItems} renderItem={(data) => <MedicationItem title={data.Name} props={data} navigation={navigation} deleteMedicationItem={deleteMedicationItem} />} keyExtractor={(item) => item.Name + item.Instructions.FirstDosageTiming} />}</View>
      <View style={styles.bottomNavBar}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  topNavBar: {
    flex: 2,
  },
  bottomNavBar: {
    flex: 1,
  },
  medicationSection: {
    flex: 7,
    width: "100%",
  },
});
