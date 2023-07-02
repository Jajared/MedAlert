import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { ScheduledItem } from "../utils/types";

export default function MedicationItem({ props, setAcknowledged, deleteReminder }) {
  const medicationData: ScheduledItem = props.item;
  const pillIcon = require("../assets/pill-icon.png");
  const syrupIcon = require("../assets/syrup-icon.png");

  function getIcon() {
    const type = medicationData.Type;
    if (type === "Pill") {
      return pillIcon;
    } else if (type === "Liquid") {
      return syrupIcon;
    }
  }

  function getUnits() {
    const type = medicationData.Type;
    if (type === "Pill") {
      return "Tablets per Intake";
    } else {
      return "ml per Intake";
    }
  }

  function getTime() {
    const time = medicationData.Instructions.FirstDosageTiming;
    const date = new Date();
    date.setHours(Math.floor(time / 60), time % 60);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  const getCurrentTime = () => {
    const timeNow = new Date();
    const minutes = timeNow.getHours() * 60 + timeNow.getMinutes();
    return minutes;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.itemContainer}>
        {getCurrentTime() >= medicationData.Instructions.FirstDosageTiming ? <Text style={[styles.timeSection, { color: "red" }]}>{getTime()}</Text> : <Text style={styles.timeSection}>{getTime()}</Text>}
        <View style={styles.textContainer}>
          <Image source={getIcon()} style={styles.icon} />
          {getCurrentTime() >= medicationData.Instructions.FirstDosageTiming ? (
            <View style={styles.medicationInfo}>
              <Text style={{ fontWeight: "bold", fontSize: 18, color: "red" }}>{medicationData.Name}</Text>
              <Text style={{ color: "red" }}>{medicationData.Purpose}</Text>
              <Text style={{ color: "red" }}>
                {medicationData.Instructions.TabletsPerIntake} {getUnits()}
              </Text>
            </View>
          ) : (
            <View style={styles.medicationInfo}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>{medicationData.Name}</Text>
              <Text>{medicationData.Purpose}</Text>
              <Text>
                {medicationData.Instructions.TabletsPerIntake} {getUnits()}
              </Text>
            </View>
          )}
          <View style={styles.buttonSection}>
            <TouchableOpacity onPress={() => setAcknowledged(medicationData.id)}>
              <Image source={require("../assets/checked-icon.png")} style={styles.logo}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteReminder(medicationData.id)}>
              <Image source={require("../assets/delete-icon.png")} style={styles.logo}></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  timeSection: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 18,
    width: "90%",
    marginTop: 10,
  },
  icon: {
    flex: 1,
    width: "80%",
    height: "80%",
    resizeMode: "contain",
    marginLeft: 10,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FAF0D7",
    borderColor: "#FAF0D7",
    borderWidth: 1,
    borderRadius: 15,
    margin: 15,
    alignItems: "center",
    height: 100,
    width: "90%",
  },
  textContainer: {
    flex: 3,
    flexDirection: "row",
  },
  medicationInfo: {
    flex: 2,
    marginLeft: 20,
  },
  rightAction: {
    backgroundColor: "green",
    justifyContent: "center",
    height: 100,
    margin: 15,
    borderRadius: 15,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    padding: 10,
  },
  logo: {
    height: 25,
    width: 25,
    marginHorizontal: 15,
  },
  buttonSection: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});