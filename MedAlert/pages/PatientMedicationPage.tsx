import { SafeAreaView, StyleSheet, StatusBar, View, FlatList, ActivityIndicator } from "react-native";
import BackNavBar from "../components/BackNavBar";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestorage } from "../firebaseConfig";
import { ScheduledItem } from "../utils/types";
import PatientMedicationItem from "../components/PatientMedicationItem";

export default function PatientMedicationPage({ navigation, route }) {
  const { guardianId, guardianName } = route.params;
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    getAllGuardianMedication();
    setIsDataLoaded(true);
  }, []);

  const getAllGuardianMedication = async () => {
    const patientMedicationRef = doc(firestorage, "MedicationInformation", guardianId);
    const snapshot = await getDoc(patientMedicationRef);
    const patientMedicationList: ScheduledItem[] = snapshot.data().ScheduledItems;
    setScheduledItems(patientMedicationList);
  };

  if (!isDataLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title={guardianName + "'s Medications"} />
      <View style={styles.medicationSection}>{scheduledItems && <FlatList data={scheduledItems.filter((data) => data.Acknowledged === false)} renderItem={(data) => <PatientMedicationItem props={data} />} keyExtractor={(item) => item.notificationId} />}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
  },
  addButton: {
    position: "absolute",
    right: 30,
    top: 70,
    zIndex: 1,
  },
  medicationSection: {
    flex: 7,
    width: "100%",
  },
});
