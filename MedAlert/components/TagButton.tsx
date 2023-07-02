import React from "react";
import { Text, StyleSheet, View } from "react-native";

const TagButton = ({ title }) => {
  function getColor(type: string) {
    const colors = { TABLET: "#FFD6A5", INJECTION: "#CBFFA9", CAPSULE: "#F2D8D8", CREAM: "#E3F4F4", SOLUTION: "#CDF0EA", GRANULE: "#D2E9E9", SYRUP: "#FCF9BE", OINTMENT: "#DAE2B6", POWDER: "#E4CDA7" };
    if (type in colors) {
      return colors[type];
    } else {
      return "#FFEFBC";
    }
  }

  function convertToTitleCase(str: string) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  return (
    <View style={[styles.buttonContainer, { backgroundColor: getColor(title) }]}>
      <Text style={styles.buttonText}>{convertToTitleCase(title)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 7,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 14,
  },
});

export default TagButton;
