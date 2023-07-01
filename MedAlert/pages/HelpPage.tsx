import { SafeAreaView, View, Text, StatusBar, StyleSheet } from "react-native";
import BackNavBar from "../components/BackNavBar";

export default function HelpPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="Help" />
      <Text>Help</Text>
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
