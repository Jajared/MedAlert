import { SafeAreaView, View, Text, StatusBar, StyleSheet } from "react-native";
import BackNavBar from "../components/BackNavBar/BackNavBar";

export default function AboutPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="About" />
      <Text>We are a group of students from NUS</Text>
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
});
