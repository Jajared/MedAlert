import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BackNavBar({ title, navigation }) {
  return (
    <View style={styles.container} testID="BackNavBar">
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} testID="BackButton">
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 50,
    paddingHorizontal: 16,
    width: "100%",
    justifyContent: "center",
  },
  backButton: {
    marginLeft: -20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
});
