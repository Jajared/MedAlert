import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function HomeNavBar({ navigation, userName, hasReminders }) {
  const homeIcon = require("../assets/home-icon.png");
  return (
    <View style={styles.container} testID="HomeNavBar">
      <TouchableOpacity onPress={() => navigation.navigate("Add Medication Type")} style={styles.addButton} testID="AddButton">
        <AntDesign name="plus" size={25} color="black" />
      </TouchableOpacity>
      <Text style={styles.userSection}>Hey {userName}! 😃</Text>
      <View style={styles.homeContainer}>
        <View style={styles.upcomingReminderSection}>{hasReminders ? <Text style={styles.upcomingRemindersText}>You have upcoming reminders for the day.</Text> : <Text style={styles.upcomingRemindersText}>You have no reminders for the day.</Text>}</View>
        <Image source={homeIcon} style={styles.homeIcon} />
      </View>
    </View>
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
  userSection: {
    flex: 1,
    width: "90%",
    fontSize: 20,
    fontWeight: "bold",
  },
  upcomingRemindersText: {
    fontSize: 18,
    fontWeight: "400",
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 30,
    marginTop: 10,
    width: "100%",
  },
  homeContainer: {
    flex: 3,
    backgroundColor: "#FFD9C0",
    flexDirection: "row",
    borderColor: "#FFD9C0",
    borderWidth: 10,
    borderRadius: 12,
    width: "95%",
    padding: 10,
  },
  upcomingReminderSection: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  homeIcon: {
    flex: 2,
    width: "100%",
    height: "100%",
  },
});
