import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import BackNavBar from "../components/BackNavBar/BackNavBar";

export default function ProfilePage({ props, navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Profile" />
      <View style={styles.profileSection}>
        <Text>Profile page</Text>
      </View>
      <View style={styles.mainSettingsSection}>
        <View style={styles.settingSection}>
          <Text>Update Account</Text>
        </View>
        <View style={styles.settingSection}>
          <Text>Saved Guardian</Text>
        </View>
        <View style={styles.settingSection}>
          <Text>Face ID/Touch ID</Text>
        </View>
        <View style={styles.settingSection}>
          <Text>Log Out</Text>
        </View>
      </View>
      <View style={styles.moreSettingsSection}>
        <Text>Hello</Text>
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
  profileSection: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FAF6E0",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    margin: 10,
    alignItems: "center",
    width: "90%",
  },
  mainSettingsSection: {
    flex: 4,
    flexDirection: "column",
    borderColor: "black",
    borderWidth: 1,
    margin: 10,
    width: "90%",
  },
  moreSettingsSection: {
    flex: 2,
    flexDirection: "column",
    borderColor: "black",
    borderWidth: 1,
    margin: 10,
    width: "90%",
  },
});
