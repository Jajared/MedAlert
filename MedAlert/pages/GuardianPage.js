import { SafeAreaView, Text, StyleSheet, StatusBar, View, TextInput } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";

export default function GuardianPage({ navigation }) {
  const [guardianEmail, setGuardianEmail] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="Guardian Page" />
      <View style={styles.subSection}>
        <View style={styles.title}>
          <Text style={styles.text}> Guardian Email: </Text>
        </View>
        <View style={styles.editBox}>
          <TextInput placeholder="Enter a valid email" onChangeText={(text) => setGuardianEmail(text)}></TextInput>
        </View>
      </View>
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
});
