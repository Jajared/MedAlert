import { SafeAreaView, StyleSheet, Text } from "react-native";
import BackNavBar from "../components/BackNavBar/BackNavBar";

export default function UpdateAccountPage({ navigation, userInformation }) {
  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Update Account" />
      <Text>Update Account Page</Text>
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
