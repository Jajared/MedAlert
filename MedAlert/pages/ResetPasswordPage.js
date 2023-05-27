import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useState } from "react";
import { SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import { LinearGradient } from "expo-linear-gradient";

export default function ResetPasswordPage({ navigation }) {
  const [email, setEmail] = useState("");
  const handleSubmit = () => {
    checkUserExists()
      .then((exists) => {
        if (exists) {
          sendPasswordResetEmail(auth, email)
            .then(() => {
              alert("Email sent");
            })
            .catch((error) => {
              alert(error);
            });
        } else {
          alert("User does not exist");
        }
      })
      .catch((error) => {
        alert("Invalid email");
      });
  };

  const checkUserExists = () => {
    return fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
        if (signInMethods && signInMethods.length > 0) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("Error checking user existence:", error);
        throw error;
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Reset Password" />
      <Text style={{ margin: 10, fontSize: 15 }}>Enter the email associated with your account and we'll send an email with instructions to reset your password</Text>
      <Text style={{ margin: 10, fontSize: 15, fontWeight: "bold" }}>Email Address:</Text>
      <TextInput placeholder="Email" onChangeText={(text) => setEmail(text)} style={styles.inputBox} />
      <TouchableOpacity onPress={() => handleSubmit()} style={styles.buttonContainer}>
        <LinearGradient colors={["#FFA7AF", "#FF014E"]} style={styles.gradient}>
          <Text style={styles.buttonText}>Send Instructions</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputBox: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  buttonContainer: {
    margin: 10,
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
