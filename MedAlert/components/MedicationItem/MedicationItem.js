import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Animated } from "react-native";
import { Component } from "react";
import { Swipeable } from "react-native-gesture-handler";

export default function MedicationItem({ props, navigation }) {
  const medicationData = props.item;
  const pillIcon = require("../../assets/pill-icon.png");
  const syrupIcon = require("../../assets/syrup-icon.png");
  const rightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity onPress={() => alert("Consumed")}>
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
  return (
    <SafeAreaView style={styles.container}>
      <Swipeable renderRightActions={rightActions}>
        <View style={styles.textContainer}>
          <Image source={getIcon()} style={styles.icon} />
          <View style={styles.medicationInfo}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>{medicationData.Name}</Text>
            <Text>{medicationData.Purpose}</Text>
            <Text>{medicationData.Instructions.TabletsPerIntake} tablets per intake</Text>
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
  icon: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    margin: 20,
  },
  textContainer: {
    backgroundColor: "#FAF6E0",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    margin: 15,
    alignItems: "center",
    height: 100,
    width: 350,
    flexDirection: "row",
  },
  medicationInfo: {
    flex: 3,
  },
  rightAction: {
    backgroundColor: "#6f6f6f",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 30,
    height: 80,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    padding: 20,
  },
});
