import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { ScheduledItem } from "../utils/types";
import TextTicker from "react-native-text-ticker";

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

  const getBackgroundColor = () => {
    const timeNow = new Date();
    const minutes = timeNow.getHours() * 60 + timeNow.getMinutes();
    return minutes >= medicationData.Instructions.FirstDosageTiming ? "#FF8989" : "#FAF0D7";
  };

  return (
    <SafeAreaView style={styles.container} testID="MedicationItem">
      <View style={[styles.itemContainer, { backgroundColor: getBackgroundColor() }]}>
        <Text style={styles.timeSection}>{getTime()}</Text>
        <View style={styles.textContainer}>
          <Image source={getIcon()} style={styles.icon} />

          <View style={styles.medicationInfo}>
            <TextTicker style={{ fontWeight: "bold", fontSize: 16 }} duration={3000} loop bounceDelay={50} repeatSpacer={50} marqueeDelay={1000}>
              {medicationData.Name}
            </TextTicker>
            <TextTicker duration={3000} loop bounceDelay={50} repeatSpacer={50} marqueeDelay={1000}>
              {medicationData.Purpose}
            </TextTicker>
            <TextTicker duration={3000} loop bounceDelay={50} repeatSpacer={50} marqueeDelay={1000}>
              {medicationData.Instructions.TabletsPerIntake} {getUnits()}
            </TextTicker>
          </View>
          <View style={styles.buttonSection}>
            <TouchableOpacity onPress={() => setAcknowledged(medicationData.id)} testID="AcknowledgeButton">
              <Image source={require("../assets/checked-icon.png")} style={styles.logo}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteReminder(medicationData.id)} testID="DeleteButton">
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
