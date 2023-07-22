import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, Button, StatusBar, Image, Keyboard, TouchableWithoutFeedback, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { doc, collection, setDoc } from "firebase/firestore";
import { firestorage, storage, auth } from "../firebaseConfig";
import DropDownPicker from "react-native-dropdown-picker";
import CalendarPicker from "react-native-calendar-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUpDetailsPage({ navigation, route, setIsSignUpComplete }) {
  const emailAddress = route.params.EmailAddress;
  const password = route.params.Password;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    Name: "",
    Gender: "",
    DateOfBirth: "",
    EmailAddress: route.params.EmailAddress,
    PhoneNumber: "",
    Settings: {
      DoseBoundary: 30,
      FavouriteMedications: [],
    },
  });

  const handleModal = () => setIsModalVisible(() => !isModalVisible);
  function onDateChange(date) {
    var newDate = (date.date() < 10 ? "0" + date.date() : date.date()) + "/" + (date.month() < 10 ? "0" + +(parseInt(date.month()) + 1) : parseInt(date.month()) + 1) + "/" + date.year();
    setPersonalDetails({ ...personalDetails, DateOfBirth: newDate });
  }

  const handleFormSubmit = async () => {
    // Check for empty fields
    if (personalDetails.Name == "" || personalDetails.Gender == "" || personalDetails.DateOfBirth == "" || personalDetails.PhoneNumber == "") {
      alert("Please fill in all fields.");
      return;
    }
    createUserWithEmailAndPassword(auth, emailAddress, password).then(async (userCredential) => {
      const user = userCredential.user;
      const userId = user.uid;

      const createNewProfile = async (userId) => {
        console.log(userId);
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
        // Update guardian information in Firestore
        const guardianInfoRef = doc(collection(firestorage, "GuardianInformation"), userId);
        setDoc(guardianInfoRef, { IncomingRequests: [], OutgoingRequests: [], Guardians: [] })
          .then((docRef) => {
            console.log("Data pushed successfully.");
          })
          .catch((error) => {
            console.error("Error pushing data:", error);
          });
        // Update statistics data in Firestore
        const statisticsDataRef = doc(collection(firestorage, "StatisticsData"), userId);
        setDoc(statisticsDataRef, {
          ConsumptionEvents: [],
        })
          .then((docRef) => {
            console.log("Data pushed successfully.");
          })
          .catch((error) => {
            console.error("Error pushing data:", error);
          });
      };

      await createNewProfile(userId);
      await setIsSignUpComplete(true);
      console.log("Profile created");
      navigation.navigate("Home");
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.header}>More about you!</Text>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput style={styles.inputBox} value={personalDetails.Name} placeholder="Name" onChangeText={(text) => setPersonalDetails({ ...personalDetails, Name: text })}></TextInput>
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>Date of Birth</Text>
          <TextInput style={styles.inputBox} value={personalDetails.DateOfBirth} placeholder="Date of Birth" onTouchStart={handleModal} editable={false} />
          <Modal visible={isModalVisible} animationType="slide" transparent={true}>
            <SafeAreaView style={styles.popUpContainer}>
              <View style={styles.popUp}>
                <CalendarPicker onDateChange={onDateChange} selectedDayColor="#DE3163" />
                <Button title="Hide calendar" onPress={handleModal} />
              </View>
            </SafeAreaView>
          </Modal>
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>Phone Number</Text>
          <TextInput style={styles.inputBox} value={personalDetails.PhoneNumber} placeholder="Phone Number" keyboardType="numeric" onChangeText={(text) => setPersonalDetails({ ...personalDetails, PhoneNumber: text })}></TextInput>
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>Gender</Text>
          <DropDownPicker
            placeholder="Select One"
            open={dropDownOpen}
            setOpen={setDropDownOpen}
            items={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Prefer not to say", value: "Prefer not to say" },
            ]}
            value={personalDetails.Gender}
            onSelectItem={(item) => {
              setPersonalDetails({ ...personalDetails, Gender: item.value });
            }}
            textStyle={{ color: "grey", fontSize: 15 }}
            style={[styles.inputBox, { borderWidth: 0, borderRadius: 0 }]}
            dropDownContainerStyle={{ borderWidth: 0 }}
          />
        </View>
        <View style={styles.emptySection}></View>
        <TouchableOpacity onPress={() => handleFormSubmit()} style={styles.buttonContainer}>
          <LinearGradient colors={["#FFA7AF", "#FF014E"]} style={styles.gradient}>
            <Text style={styles.buttonText}>Confirm</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginTop: 30,
  },
  header: {
    fontSize: 18,
    marginLeft: "5%",
    color: "grey",
    alignSelf: "flex-start",
    marginBottom: 30,
  },
  inputItem: {
    flex: 2,
    width: "90%",
    flexDirection: "column",
    margin: 15,
  },
  inputTitle: {
    fontSize: 15,
    marginTop: 10,
    fontWeight: "bold",
  },
  inputBox: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    color: "grey",
    fontSize: 15,
    marginVertical: 15,
    padding: 10,
  },
  emptySection: {
    flex: 4,
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
  popUpContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
  },
  popUp: {
    backgroundColor: "white",
    width: "100%",
    height: "50%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
