import { SafeAreaView, Text, StyleSheet, StatusBar, View, TextInput, TouchableOpacity } from "react-native";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import { FontAwesome5 } from "@expo/vector-icons";

export default function GuardianHomePage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity onPress={() => navigation.navigate("Guardian Requests")} style={styles.addButton}>
        <FontAwesome5 name="user-friends" size={24} color="black" />
      </TouchableOpacity>
      <BackNavBar navigation={navigation} title="Guardian Page" />
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
  addButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 30,
    width: "100%",
  },
});
