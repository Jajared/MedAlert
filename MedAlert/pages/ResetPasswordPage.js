import { sendPasswordResetEmail } from "firebase/auth";
import { SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import { LinearGradient } from "expo-linear-gradient";

export default function ResetPasswordPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Reset Password" />
      <Text style={{ margin: 10 }}>Enter the email associated with your account and we'll send an email with instructions to reset your password</Text>
      <Text style={{ margin: 10 }}>Email Address:</Text>
      <TextInput placeholder="email" style={styles.inputBox} />
      <TouchableOpacity onPress={() => alert("Button pressed")} style={styles.buttonContainer}>
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
    padding: 10,
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
