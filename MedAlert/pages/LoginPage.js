import { SafeAreaView, Text, StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { signIn } from "../Auth";

export default function LoginPage({ navigation, onLogin }) {
  const [email, setEmail] = useState("Email");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const [success, id] = await signIn(email, password);
      if (success) {
        console.log("Login successful");
        onLogin(id);
        navigation.navigate("Home", { id: id });
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Email</Text>
        <View style={styles.inputBox}>
          <AntDesign name="mail" size={20} color="black" style={styles.inputIcon} />
          <TextInput style={styles.inputText} value={email} onChangeText={(text) => setEmail(text)}></TextInput>
        </View>
      </View>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Password</Text>
        <View style={styles.inputBox}>
          <AntDesign name="lock" size={26} color="black" style={styles.inputIcon} />
          <TextInput style={{ flex: 8 }} value={password} secureTextEntry={!showPassword} onChangeText={(text) => setPassword(text)}></TextInput>
          <TouchableOpacity style={styles.showButton} onPress={togglePasswordVisibility}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.buttonContainer}>
        <LinearGradient colors={["#FFA7AF", "#FF014E"]} style={styles.gradient}>
          <Text style={styles.buttonText}>Sign In</Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={{ margin: 5, flexDirection: "row", alignItems: "center", width: "90%" }}>
        <View style={styles.line}></View>
        <Text style={{ fontWeight: "bold", fontSize: 15, marginHorizontal: 10 }}>Or</Text>
        <View style={styles.line}></View>
      </View>

      <TouchableOpacity onPress={() => alert("Button Pressed")} style={styles.buttonContainer}>
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
  showButton: {
    flex: 1,
    alignSelf: "center",
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
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
});
