import { SafeAreaView, Text, StyleSheet, StatusBar, View, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import { auth } from "../firebaseConfig";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { firestorage } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, arrayUnion, setDoc } from "firebase/firestore";

export default function GuardianRequestsPage({ navigation, userId }) {
  const [guardianEmail, setGuardianEmail] = useState("");

  // Register guardian
  const handleFormSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guardianEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    fetchSignInMethodsForEmail(auth, guardianEmail).then(async (result) => {
      if (result.length === 0) {
        alert("No account found with this email.");
      } else {
        const guardianId = await searchDocumentIdByEmail(guardianEmail);
        addRequest(guardianId);
      }
    });
  };

  const searchDocumentIdByEmail = async (email) => {
    const querySnapshot = query(collection(firestorage, "UsersData"), where("EmailAddress", "==", email));
    const snapshot = await getDocs(querySnapshot);
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }
    return snapshot.docs[0].id;
  };

  const addRequest = async (guardianId) => {
    try {
      // Update guardian side
      const guardianInfoRef = doc(collection(firestorage, "GuardianInformation"), guardianId);
      await setDoc(guardianInfoRef, { IncomingRequests: arrayUnion(userId) }, { merge: true });

      // Update user side
      const userInfoRef = doc(collection(firestorage, "GuardianInformation"), userId);
      await setDoc(userInfoRef, { OutgoingRequests: arrayUnion(guardianId) }, { merge: true });
      alert("Successfully requested!");
    } catch (error) {
      console.error("Error adding guardian request:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Guardian Requests" />
      <Text style={styles.title}>Add a guardian!</Text>
      <Text style={styles.header}>Allow other existing users to track your medication schedule. Simply enter their registered email!</Text>
      <View style={styles.subSection}>
        <View style={styles.inputTitle}>
          <Text style={styles.text}> Guardian Email: </Text>
        </View>
        <View style={styles.editBox}>
          <TextInput placeholder="Enter a registered email" onChangeText={(text) => setGuardianEmail(text)}></TextInput>
        </View>
      </View>
      <TouchableOpacity onPress={handleFormSubmit} style={styles.buttonContainer}>
        <LinearGradient colors={["#FFA7AF", "#FF014E"]} style={styles.gradient}>
          <Text style={styles.buttonText}>Confirm</Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.emptySection}></View>
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
  subSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
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

  inputTitle: {
    alignItems: "center",
  },

  editBox: {
    height: 50,
    borderWidth: 1,
    width: "100%",
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 2,
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
  emptySection: {
    flex: 2,
  },
});
