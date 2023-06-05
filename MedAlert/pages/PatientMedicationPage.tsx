import { SafeAreaView, Text, StyleSheet, StatusBar, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { firestorage } from "../firebaseConfig";
import { ScheduledItem, GuardianScheduledItems } from "../utils/types";
import PatientMedicationItem from "../components/PatientMedicationItem/PatientMedicationItem";

export default function GuardianHomePage({ navigation, userId }) {
  const [patientList, setPatientList] = useState<string[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [fullData, setFullData] = useState<GuardianScheduledItems>({});
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await getAllPatients();
      for (const patientId of patientList) {
        setItems((prev) => [...prev, { label: patientId, value: patientId }]);
      }
      await getAllPatientMedication();
      setIsDataLoaded(true);
    };
    fetchData();
  }, []);

  const getAllPatientMedication = async () => {
    for (const patientId of patientList) {
      const patientMedicationRef = doc(firestorage, "MedicationInformation", patientId);
      const snapshot = await getDoc(patientMedicationRef);
      const patientMedicationList: ScheduledItem[] = snapshot.data().ScheduledItems;
      setFullData((prev) => ({ ...prev, [patientId]: patientMedicationList }));
    }
  };

  // Get all patients from firebase
  const getAllPatients = async () => {
    const patientInfoRef = doc(firestorage, "GuardianInformation", userId);
    const snapshot = await getDoc(patientInfoRef);
    const patientList = snapshot.data().Patients;
    setPatientList(patientList);
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
      <TouchableOpacity onPress={() => navigation.navigate("Guardian Requests")} style={styles.addButton}>
        <FontAwesome5 name="user-friends" size={24} color="black" />
      </TouchableOpacity>
      <BackNavBar navigation={navigation} title="Guardian Page" />
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
  dropDownBox: {
    height: 50,
    borderWidth: 1,
    width: "50%",
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    justifyContent: "center",
  },
});
