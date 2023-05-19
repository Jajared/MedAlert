import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Animated } from "react-native";
import { Swipeable, RectButton } from "react-native-gesture-handler";

export default function MedicationItem({ props, navigation, setAcknowledged }) {
  const medicationData = props.item;
  const pillIcon = require("../../assets/pill-icon.png");
  const syrupIcon = require("../../assets/syrup-icon.png");
  const rightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-50, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <TouchableOpacity onPress={() => setAcknowledged(medicationData.id)}>
        <View style={styles.rightAction}>
          <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>Consumed</Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };
  function getIcon() {
    const type = medicationData.Type;
    if (type === "Pill") {
      return pillIcon;
    } else if (type === "Liquid") {
      return syrupIcon;
    }
  }

  function getTime() {
    const time = medicationData.Instructions.FirstDosageTiming;
    const date = new Date();
    date.setHours(Math.floor(time / 60), time % 60);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Swipeable renderRightActions={rightActions}>
        <View style={styles.itemContainer}>
          <Text style={styles.timeSection}>{getTime()}</Text>
          <View style={styles.textContainer}>
            <Image source={getIcon()} style={styles.icon} />
            <View style={styles.medicationInfo}>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>{medicationData.Name}</Text>
              <Text>{medicationData.Purpose}</Text>
              <Text>{medicationData.Instructions.TabletsPerIntake} tablets per intake</Text>
            </View>
          </View>
        </View>
      </Swipeable>
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
    fontSize: 20,
    width: "90%",
    marginBottom: 10,
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
    backgroundColor: "#FAF6E0",
    borderColor: "black",
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
    flex: 3,
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
});
