import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function GuardianRequestItem({ props, acceptGuardianRequest, rejectGuardianRequest }) {
  const guardianRequestInfo = props.item;
  return (
    <View style={styles.itemContainer}>
      {guardianRequestInfo.Gender == "Female" ? <MaterialCommunityIcons name="face-woman-profile" size={24} color="black" style={{ flex: 1 }} /> : <MaterialCommunityIcons name="face-man-profile" size={24} color="black" style={{ flex: 1 }} />}
      <Text style={styles.name}>{guardianRequestInfo.Name}</Text>
      <Text style={styles.email}>{guardianRequestInfo.EmailAddress}</Text>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => acceptGuardianRequest(guardianRequestInfo.UserId)}>
        <MaterialCommunityIcons name="check" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => rejectGuardianRequest(guardianRequestInfo.UserId)}>
        <MaterialCommunityIcons name="close" size={24} color="black" />
      </TouchableOpacity>
    </View>
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
  name: {
    flex: 2,
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    flex: 3,
    fontSize: 14,
    color: "#888",
  },
});
