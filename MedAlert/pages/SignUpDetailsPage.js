import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";

export default function SignUpPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.profileSection}>
        <View style={styles.profileCircle}>
          <AntDesign name="user" size={30} color="black" style={styles.profileImage} />
        </View>
        <Button title="Add Image" onPress={() => alert("Button pressed")} />
      </View>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Name</Text>
        <TextInput style={styles.inputBox} value={"Name"}></TextInput>
      </View>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Date of Birth</Text>
        <TextInput style={styles.inputBox} value={"Date of Birth"}></TextInput>
      </View>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Phone Number</Text>
        <TextInput style={styles.inputBox} value={"Phone Number"} keyboardType="numeric"></TextInput>
      </View>
      <View style={styles.inputItem}>
        <Text style={styles.inputTitle}>Gender</Text>
        <TextInput style={styles.inputBox} value={"Gender"}></TextInput>
      </View>
      <View style={styles.emptySection}></View>
      <TouchableOpacity onPress={() => alert("Button pressed")} style={styles.buttonContainer}>
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
  },
  profileImage: {
    alignSelf: "center",
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
