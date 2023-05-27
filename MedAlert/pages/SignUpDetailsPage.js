import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, Button, StatusBar, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { doc, collection, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestorage, storage } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";

/**https://firebasestorage.googleapis.com/v0/b/medalert-386812.appspot.com/o/profilePictures%2FcLNeJdkRJkfEzLMugJipcamAWwb2?alt=media&token=e2ea4d15-ec26-410e-b584-3aac020bfe15 */

export default function SignUpDetailsPage({ navigation, route, setIsSignUpComplete }) {
  const userId = route.params.userId;
  const [imageUri, setImageUri] = useState(null);
  const [personalDetails, setPersonalDetails] = useState({
    Name: "",
    Gender: "",
    DateOfBirth: "",
    EmailAddress: route.params.EmailAddress,
    PhoneNumber: "",
  });

  const handleFormSubmit = async () => {
    await uploadImageToFirebase();
    console.log(personalDetails);
    const userInfoRef = doc(collection(firestorage, "UsersData"), userId);
    // Update user information in Firestore
    await setDoc(userInfoRef, { ...personalDetails })
      .then((docRef) => {
        console.log("Data pushed successfully.");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
    // Update medication information in Firestore
    const medInfoRef = doc(collection(firestorage, "MedicationInformation"), userId);
    setDoc(medInfoRef, { MedicationItems: [], ScheduledItems: [] })
      .then((docRef) => {
        console.log("Data pushed successfully.");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
    await setIsSignUpComplete(true);
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Name</Text>
        <TextInput style={styles.inputBox} value={personalDetails.Name} placeholder="Name" onChangeText={(text) => setPersonalDetails({ ...personalDetails, Name: text })}></TextInput>
      </View>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Date of Birth</Text>
        <TextInput style={styles.inputBox} value={personalDetails.DateOfBirth} placeholder="Date of Birth" onChangeText={(text) => setPersonalDetails({ ...personalDetails, DateOfBirth: text })}></TextInput>
      </View>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Phone Number</Text>
        <TextInput style={styles.inputBox} value={personalDetails.PhoneNumber} placeholder="Phone Number" keyboardType="numeric" onChangeText={(text) => setPersonalDetails({ ...personalDetails, PhoneNumber: text })}></TextInput>
      </View>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Gender</Text>
        <TextInput style={styles.inputBox} value={personalDetails.Gender} placeholder="Gender" onChangeText={(text) => setPersonalDetails({ ...personalDetails, Gender: text })}></TextInput>
      </View>
      <View style={styles.emptySection}></View>
      <TouchableOpacity onPress={() => handleFormSubmit()} style={styles.buttonContainer}>
        <LinearGradient colors={["#FFA7AF", "#FF014E"]} style={styles.gradient}>
          <Text style={styles.buttonText}>Confirm</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: "bold",
  },
  profileSection: {
    flex: 3,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },

  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputItem: {
    flex: 2,
    width: "90%",
    flexDirection: "column",
    margin: 15,
  },
  inputTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
  },
  inputBox: {
    flex: 1,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: "grey",
  },
  emptySection: {
    flex: 3,
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
});
