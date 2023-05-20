import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { signUp } from "../Auth";

export default function SignUpHomePage({ navigation, onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async () => {
    try {
      if (isValidEmail() && isValidPassword()) {
        const [success, userId] = await signUp(email, password);
        if (success) {
          await onSignUp(userId);
          navigation.replace("Sign Up Details", { userId: userId, EmailAddress: email });
        } else {
          alert("Sign up failed. Please try again.");
        }
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isValidEmail = () => {
    // Regular expression pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const isValidPassword = () => {
    return password.length >= 8;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Email</Text>
        <View style={styles.inputBox}>
          <AntDesign name="mail" size={20} color="black" style={styles.inputIcon} />
          <TextInput style={styles.inputText} value={email} placeholder="example@site.com" onChangeText={(text) => setEmail(text)}></TextInput>
        </View>
      </View>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Password</Text>
        <View style={styles.inputBox}>
          <AntDesign name="lock" size={26} color="black" style={styles.inputIcon} />
          <TextInput style={{ flex: 8 }} value={password} secureTextEntry={!showPassword} placeholder="Minimum 8 characters" onChangeText={(text) => setPassword(text)}></TextInput>
          <TouchableOpacity style={styles.showButton} onPress={togglePasswordVisibility}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={handleSignUp} style={styles.buttonContainer}>
        <LinearGradient colors={["#FFA7AF", "#FF014E"]} style={styles.gradient}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.emptySection}></View>
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
  inputIcon: {
    flex: 1,
    alignSelf: "center",
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: "grey",
  },
  inputText: {
    flex: 9,
    alignSelf: "center",
    color: "grey",
  },
  buttonContainer: {
    flex: 2,
    justifyContent: "center",
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
  },
  emptySection: {
    flex: 10,
  },
});
