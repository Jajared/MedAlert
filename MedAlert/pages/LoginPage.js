import { SafeAreaView, Text, StyleSheet, View, TextInput, TouchableOpacity, StatusBar, Image } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginPage({ navigation, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image source={require("../assets/medalert_icon.png")} style={styles.logo}></Image>
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.inputBox}>
        <AntDesign name="mail" size={20} color="black" style={styles.inputIcon} />
        <TextInput style={styles.inputText} value={email} placeholder="Email" onChangeText={(text) => setEmail(text)}></TextInput>
      </View>
      <View style={styles.inputBox}>
        <AntDesign name="lock" size={26} color="black" style={styles.inputIcon} />
        <TextInput style={{ flex: 8 }} value={password} secureTextEntry={!showPassword} placeholder="Password" onChangeText={(text) => setPassword(text)}></TextInput>
        <TouchableOpacity style={styles.showButton} onPress={togglePasswordVisibility}>
          <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={styles.optionsBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Reset Password")}>
          <Text style={{ color: "#FF014E" }}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={async () => {
          try {
            const success = await onLogin(email, password);
            if (success) {
              navigation.navigate("Home");
            } else {
              alert("Please retry logging in");
            }
          } catch (error) {
            console.log(error);
          }
        }}
        style={styles.buttonContainer}
      >
        <LinearGradient colors={["#FFA7AF", "#FF014E"]} style={styles.gradient}>
          <Text style={styles.buttonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.emptySection}></View>
      <View style={styles.signUpSection}>
        <Text style={{ fontSize: 15 }}>Don't have any account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Sign Up Home")}>
          <Text style={{ color: "#FF014E", fontSize: 15 }}> Sign Up</Text>
        </TouchableOpacity>
      </View>
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
  logo: {
    height: 100,
    width: 100,
    marginVertical: 60,
  },
  title: {
    flex: 1,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  optionsBar: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "90%",
    margin: 10,
  },
  inputIcon: {
    flex: 1,
    alignSelf: "center",
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: "grey",
    margin: 10,
  },
  inputText: {
    flex: 9,
    alignSelf: "center",
    color: "grey",
  },
  showButton: {
    flex: 1,
    alignSelf: "center",
  },
  buttonContainer: {
    flex: 2,
    margin: 10,
    width: "90%",
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
  emptySection: {
    flex: 4,
  },
  signUpSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
