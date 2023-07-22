import { Text, SafeAreaView, StyleSheet, View, TouchableOpacity, StatusBar } from "react-native";
import BackNavBar from "../components/BackNavBar";
import { MaterialCommunityIcons, MaterialIcons, AntDesign, Ionicons, Feather } from "@expo/vector-icons";

export default function ProfilePage({ navigation, onSignOut }) {
  return (
    <SafeAreaView style={styles.container} testID="MenuPage">
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="Menu" />
      <View style={styles.mainSettingsSection}>
        <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate("Update Account")} testID="UpdateAccountButton">
          <MaterialCommunityIcons name="account" size={30} color="black" style={{ flex: 1 }} />
          <View style={styles.settingInfo}>
            <Text style={styles.settingsTitle}>Update Account</Text>
            <Text style={styles.settingDescription}>Make changes to your account</Text>
          </View>
          <Feather name="arrow-right" size={24} color="black" style={{ flex: 1 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate("Guardian Home")} testID="GuardianButton">
          <MaterialIcons name="supervisor-account" size={30} color="black" style={{ flex: 1 }} />
          <View style={styles.settingInfo}>
            <Text style={styles.settingsTitle}>Saved Guardian</Text>
            <Text style={styles.settingDescription}>Manage your guardian information</Text>
          </View>
          <Feather name="arrow-right" size={24} color="black" style={{ flex: 1 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate("Medication Database")} testID="MedicationDatabaseButton">
          <AntDesign name="database" size={30} color="black" style={{ flex: 1 }} />
          <View style={styles.settingInfo}>
            <Text style={styles.settingsTitle}>Medication Database</Text>
            <Text style={styles.settingDescription}>Search through our database for your medication</Text>
          </View>
          <Feather name="arrow-right" size={24} color="black" style={{ flex: 1 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsItem}
          onPress={async () => {
            await onSignOut();
            navigation.navigate("Login");
          }}
          testID="LogoutButton"
        >
          <Ionicons name="exit-outline" size={30} color="black" style={{ flex: 1 }} />
          <View style={styles.settingInfo}>
            <Text style={styles.settingsTitle}>Log Out</Text>
            <Text style={styles.settingDescription}>Log out of your existing account</Text>
          </View>
          <Feather name="arrow-right" size={24} color="black" style={{ flex: 1 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.moreSettingsSection}>
        <Text style={{ fontSize: 15, fontWeight: "bold", flex: 1 }}>More</Text>
        <View style={styles.moreSettingsContainer}>
          <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate("Help")} testID="HelpButton">
            <MaterialIcons name="support-agent" size={24} color="black" style={{ flex: 1 }} />
            <View style={styles.settingInfo}>
              <Text style={styles.settingsTitle}>Help & Support</Text>
            </View>
            <Feather name="arrow-right" size={24} color="black" style={{ flex: 1 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate("About")} testID="AboutButton">
            <Ionicons name="ios-heart-circle" size={24} color="black" style={{ flex: 1 }} />
            <View style={styles.settingInfo}>
              <Text style={styles.settingsTitle}>About App</Text>
            </View>
            <Feather name="arrow-right" size={24} color="black" style={{ flex: 1 }} />
          </TouchableOpacity>
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
  mainSettingsSection: {
    flex: 5,
    flexDirection: "column",
    borderColor: "black",
    borderWidth: 1,
    margin: 10,
    width: "90%",
    borderRadius: 15,
  },
  settingsItem: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  settingInfo: {
    flex: 6,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  settingDescription: {
    fontSize: 12,
  },
  moreSettingsSection: {
    flex: 3,
    flexDirection: "column",
    margin: 10,
    width: "90%",
  },
  moreSettingsContainer: {
    flex: 4,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
  },
});
