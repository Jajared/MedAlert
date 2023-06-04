import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function GuardianInfoItem({ props }) {
  const guardianInfo = props.item;
  return (
    <SafeAreaView style={styles.itemContainer}>
      {guardianInfo.Gender == "Female" ? <MaterialCommunityIcons name="face-woman-profile" size={24} color="black" style={{ flex: 1 }} /> : <MaterialCommunityIcons name="face-man-profile" size={24} color="black" style={{ flex: 1 }} />}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{guardianInfo.Name}</Text>
        <Text style={styles.email}>{guardianInfo.EmailAddress}</Text>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.removeButton} onPress={() => alert("Remove clicked!")}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  infoContainer: {
    flex: 3,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
  },
  name: {
    flex: 3,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  email: {
    flex: 4,
    fontSize: 14,
    color: "#888",
  },
  removeButton: {
    backgroundColor: "#BCBCBC",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
});
