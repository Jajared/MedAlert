import { SafeAreaView, Text, StyleSheet, StatusBar, View, TextInput, TouchableOpacity, Modal, FlatList, ScrollView } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import { auth } from "../firebaseConfig";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { firestorage } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, arrayUnion, setDoc, getDoc, arrayRemove, updateDoc } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import GuardianRequestItem from "../components/GuardianRequestItem/GuardianRequestItem";
import GuardianInfoItem from "../components/GuardianInfoItem/GuardianInfoItem";
import { GuardianInfo, GuardianRequest } from "../utils/types";
import { GuardianScheduledItems, ScheduledItem } from "../utils/types";

export default function GuardianRequestsPage({ navigation, userId }) {
  const [addGuardianEmail, setAddGuardianEmail] = useState<string>("");
  const [isAddPopUpVisible, setIsAddPopUpVisible] = useState<boolean>(false);
  const [guardiansRequests, setGuardiansRequests] = useState<GuardianRequest[]>([]);
  const [guardiansInfo, setGuardiansInfo] = useState<GuardianInfo[]>([]);
  const [fullData, setFullData] = useState<GuardianScheduledItems>({});
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDosageForm, setSelectedDosageForm] = useState<string>("");
  const [selectedFunction, setSelectedFunction] = useState<string>("Guardians");
  const functionTypes = ["Guardians", "Requests", "Add Guardian"];

  useEffect(() => {
    getAllGuardianRequests();
    getAllGuardians();
    getAllGuardianMedication();
  }, []);

  // Get all guardian requests
  const getAllGuardianRequests = async () => {
    const querySnapshot = doc(firestorage, "GuardianInformation", userId);
    const snapshot = await getDoc(querySnapshot);
    const guardianRequestsIds = snapshot.data().IncomingRequests;
    // Get user data of each guardian request
    const guardianRequests = [];
    for (const guardianRequestId of guardianRequestsIds) {
      const querySnapshot = doc(firestorage, "UsersData", guardianRequestId);
      const snapshot = await getDoc(querySnapshot);
      const guardianRequestInfo: GuardianRequest = { ...(snapshot.data() as GuardianRequest), UserId: guardianRequestId };
      guardianRequests.push(guardianRequestInfo);
    }
    setGuardiansRequests(guardianRequests);
  };

  // Get all guardians
  const getAllGuardians = async () => {
    const querySnapshot = doc(firestorage, "GuardianInformation", userId);
    const snapshot = await getDoc(querySnapshot);
    const guardiansIds = snapshot.data().Guardians;
    // Get user data of each guardian
    const guardians = [];
    for (const guardianId of guardiansIds) {
      const querySnapshot = doc(firestorage, "UsersData", guardianId);
      const snapshot = await getDoc(querySnapshot);
      const guardianInfo: GuardianInfo = { ...(snapshot.data() as GuardianInfo), UserId: guardianId };
      guardians.push(guardianInfo);
    }
    setGuardiansInfo(guardians);
  };

  // Get all guardian medication
  const getAllGuardianMedication = async () => {
    for (const guardianInfo of guardiansInfo) {
      const guardianId = guardianInfo.UserId;
      const guardianMedicationRef = doc(firestorage, "MedicationInformation", guardianId);
      const snapshot = await getDoc(guardianMedicationRef);
      const guardianMedicationList: ScheduledItem[] = snapshot.data().ScheduledItems;
      setFullData((prev) => ({ ...prev, [guardianInfo.UserId]: guardianMedicationList }));
    }
  };

  // Accept Guardian Request
  const acceptGuardianRequest = async (patientId: string) => {
    try {
      // Update patient side
      const patientInfoRef = doc(firestorage, "GuardianInformation", patientId);
      await updateDoc(patientInfoRef, { OutgoingRequests: arrayRemove(userId), Guardians: arrayUnion(userId) });
      // Update guardian side
      const userInfoRef = doc(firestorage, "GuardianInformation", userId);
      await updateDoc(userInfoRef, { IncomingRequests: arrayRemove(patientId), Guardians: arrayUnion(patientId) });
      setGuardiansRequests(guardiansRequests.filter((guardianRequest) => guardianRequest.UserId !== patientId));
    } catch (error) {
      console.error("Error accepting guardian request:", error);
    }
  };

  // Reject Guardian Request
  const rejectGuardianRequest = async (guardianId: string) => {
    try {
      // Update guardian side
      const guardianInfoRef = doc(firestorage, "GuardianInformation", guardianId);
      await updateDoc(guardianInfoRef, { IncomingRequests: arrayRemove(userId) });
      // Update user side
      const userInfoRef = doc(firestorage, "GuardianInformation", userId);
      await updateDoc(userInfoRef, { OutgoingRequests: arrayRemove(guardianId) });
      setGuardiansRequests(guardiansRequests.filter((guardianRequest) => guardianRequest.UserId !== guardianId));
    } catch (error) {
      console.error("Error rejecting guardian request:", error);
    }
  };

  // Remove guardian
  const removeGuardian = async (guardianId: string) => {
    try {
      // Update guardian side
      const guardianInfoRef = doc(firestorage, "GuardianInformation", guardianId);
      await updateDoc(guardianInfoRef, { Guardians: arrayRemove(userId) });
      // Update user side
      const userInfoRef = doc(firestorage, "GuardianInformation", userId);
      await updateDoc(userInfoRef, { Guardians: arrayRemove(guardianId) });
      setGuardiansInfo(guardiansInfo.filter((guardianInfo) => guardianInfo.UserId !== guardianId));
    } catch (error) {
      console.error("Error removing guardian:", error);
    }
  };

  // Register guardian
  const handleFormSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addGuardianEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    fetchSignInMethodsForEmail(auth, addGuardianEmail).then(async (result) => {
      if (result.length === 0) {
        alert("No account found with this email.");
      } else {
        const guardianId = await searchDocumentIdByEmail(addGuardianEmail);
        addRequest(guardianId);
        setAddGuardianEmail("");
      }
    });
  };

  // Search document id by email
  const searchDocumentIdByEmail = async (email: string) => {
    const querySnapshot = query(collection(firestorage, "UsersData"), where("EmailAddress", "==", email));
    const snapshot = await getDocs(querySnapshot);
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }
    return snapshot.docs[0].id;
  };

  // Add request
  const addRequest = async (guardianId: string) => {
    try {
      // Update guardian side
      const guardianInfoRef = doc(collection(firestorage, "GuardianInformation"), guardianId);
      await setDoc(guardianInfoRef, { IncomingRequests: arrayUnion(userId) }, { merge: true });

      // Update user side
      const userInfoRef = doc(collection(firestorage, "GuardianInformation"), userId);
      await setDoc(userInfoRef, { OutgoingRequests: arrayUnion(guardianId) }, { merge: true });
      alert("Successfully requested!");
      setIsAddPopUpVisible(false);
    } catch (error) {
      console.error("Error adding guardian request:", error);
    }
  };

  if (selectedFunction == "Guardians") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <BackNavBar navigation={navigation} title="Guardian Home" />
        <View style={styles.pageBar}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pageBar}>
            {functionTypes.map((req) => (
              <TouchableOpacity
                key={req}
                onPress={() => {
                  setSelectedFunction(req);
                }}
                style={[styles.filterItem, req === selectedFunction && styles.selectedFilterItem]}
              >
                <Text style={[styles.filterText, req === selectedFunction && styles.selectedFilterText]}>{req}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={[styles.section, { flex: 2 }]}>
          <View style={{ width: "100%" }}>{guardiansInfo && <FlatList data={guardiansInfo} renderItem={(data) => <GuardianInfoItem props={data} removeGuardian={removeGuardian} />} keyExtractor={(item) => item.Name} />}</View>
        </View>
      </SafeAreaView>
    );
  } else if (selectedFunction == "Requests") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <BackNavBar navigation={navigation} title="Guardian Home" />
        <View style={styles.pageBar}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pageBar}>
            {functionTypes.map((req) => (
              <TouchableOpacity
                key={req}
                onPress={() => {
                  setSelectedFunction(req);
                }}
                style={[styles.filterItem, req === selectedFunction && styles.selectedFilterItem]}
              >
                <Text style={[styles.filterText, req === selectedFunction && styles.selectedFilterText]}>{req}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={[styles.section, { flex: 1 }]}>
          <View style={{ width: "100%" }}>{guardiansRequests && <FlatList data={guardiansRequests} renderItem={(data) => <GuardianRequestItem props={data} acceptGuardianRequest={acceptGuardianRequest} rejectGuardianRequest={rejectGuardianRequest} />} keyExtractor={(item) => item.Name} />}</View>
        </View>
      </SafeAreaView>
    );
  } else if (selectedFunction == "Add Guardian") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <BackNavBar navigation={navigation} title="Guardian Home" />
        <View style={styles.pageBar}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pageBar}>
            {functionTypes.map((req) => (
              <TouchableOpacity
                key={req}
                onPress={() => {
                  setSelectedFunction(req);
                }}
                style={[styles.filterItem, req === selectedFunction && styles.selectedFilterItem]}
              >
                <Text style={[styles.filterText, req === selectedFunction && styles.selectedFilterText]}>{req}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <SafeAreaView style={styles.popUpContainer}>
          <Text style={styles.title}>Add a guardian!</Text>
          <Text style={styles.header}>Allow other existing users to track your medication schedule. Simply enter their registered email!</Text>
          <TextInput placeholder="Enter a registered email" onChangeText={(text) => setAddGuardianEmail(text)} style={styles.editBox}></TextInput>
          <TouchableOpacity onPress={handleFormSubmit} style={styles.buttonContainer}>
            <LinearGradient colors={["#FFA7AF", "#FF014E"]} style={styles.gradient}>
              <Text style={styles.buttonText}>Confirm</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <BackNavBar navigation={navigation} title="Guardian Home" />
        <View style={styles.pageBar}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pageBar}>
            {functionTypes.map((req) => (
              <TouchableOpacity
                key={req}
                onPress={() => {
                  setSelectedFunction(req);
                }}
                style={[styles.filterItem, req === selectedFunction && styles.selectedFilterItem]}
              >
                <Text style={[styles.filterText, req === selectedFunction && styles.selectedFilterText]}>{req}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
  },
  subSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    alignSelf: "flex-start",
    marginLeft: "5%",
    fontWeight: "bold",
    marginTop: 20,
  },
  header: {
    fontSize: 15,
    marginLeft: "5%",
    color: "grey",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  popUpContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  inputTitle: {
    alignItems: "center",
  },
  editBox: {
    height: 50,
    borderWidth: 1,
    width: 340,
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    marginBottom: 20,
  },
  text: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 1,
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    right: 30,
    top: 70,
    zIndex: 1,
  },
  section: {
    width: "100%",
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 18,
    marginLeft: 10,
    marginBottom: 10,
    fontWeight: "bold",
    color: "black",
    alignSelf: "flex-start",
  },
  emptySection: {
    flex: 2,
  },
  pageBar: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  filterItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#E0E0E0",
  },
  selectedFilterItem: {
    backgroundColor: "#FAF6E0",
  },
  filterText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  selectedFilterText: {
    color: "black",
    fontWeight: "bold",
  },
});
