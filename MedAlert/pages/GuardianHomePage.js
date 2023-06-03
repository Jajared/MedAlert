import { SafeAreaView, Text, StyleSheet, StatusBar, View, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import { auth } from "../firebaseConfig";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { FontAwesome5 } from "@expo/vector-icons";

export default function GuardianHomePage({ navigation }) {
  const [guardianEmail, setGuardianEmail] = useState("");
  const handleFormSubmit = () => {
    fetchSignInMethodsForEmail(auth, guardianEmail).then((result) => {
      if (result.length === 0) {
        alert("No account found with this email.");
      } else {
      }
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="Guardian Page" />
      <TouchableOpacity onPress={() => navigation.navigate("Guardian Requests")} style={styles.addButton}>
        <FontAwesome5 name="user-friends" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.subSection}>
        <View style={styles.title}>
          <Text style={styles.text}> Guardian Email: </Text>
        </View>
        <View style={styles.editBox}>
          <TextInput placeholder="Enter a valid email" onChangeText={(text) => setGuardianEmail(text)}></TextInput>
        </View>
      </View>
      <TouchableOpacity onPress={handleFormSubmit} style={styles.buttonContainer}>
        <LinearGradient colors={["#FFA7AF", "#FF014E"]} style={styles.gradient}>
          <Text style={styles.buttonText}>Confirm</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  addButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 30,
    width: "100%",
  },
});
