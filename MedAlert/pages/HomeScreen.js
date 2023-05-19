import { StyleSheet, Text, SafeAreaView, Image, View } from "react-native";
import { useState, useEffect } from "react";
import MedicationItem from "../components/MedicationItem/MedicationItem";
import { FlatList } from "react-native";
import HomeNavBar from "../components/HomeNavBar/HomeNavBar";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";

export default function HomeScreen({ scheduledItems, navigation, setAcknowledged, userName }) {
  const allMedicationItems = scheduledItems;
  console.log(scheduledItems);

  function deleteMedication(medicationData) {
    setAllMedicationItems((prevState) => prevState.filter(medicationData));
  }

  function deleteMedicationItem() {
    alert("Delete button pressed");
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topNavBar}>
        <HomeNavBar navigation={navigation} userName={userName} />
      </View>
      <View style={styles.medicationSection}>{allMedicationItems && <FlatList data={allMedicationItems.filter((data) => data.Acknowledged === false)} renderItem={(data) => <MedicationItem title={data.Name} props={data} navigation={navigation} deleteMedicationItem={deleteMedicationItem} setAcknowledged={setAcknowledged} />} keyExtractor={(item) => item.id} />}</View>
      <View style={styles.bottomNavBar}>
        <BottomNavBar navigation={navigation} />
      </View>
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
