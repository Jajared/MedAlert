import { StyleSheet, Text, SafeAreaView, Image, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons, FontAwesome5, Entypo } from "@expo/vector-icons";

export default function BottomNavBar({ title, props, navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconSection}>
        <TouchableOpacity onPress={() => alert("Pressed")}>
          <FontAwesome5 name="pills" size={30} color="black" style={styles.icon} />
          <Text style={styles.text}>Medication</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconSection}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Entypo name="home" size={30} color="black" style={styles.icon} />
          <Text style={styles.text}>Home</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconSection}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile Page")}>
          <MaterialCommunityIcons name="face-man-profile" size={30} color="black" style={styles.icon} />
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    borderTopColor: "black",
    borderTopWidth: 1,
    paddingTop: 10,
  },
  iconSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  icon: {
    flex: 1,
    alignSelf: "center",
  },
  text: {
    flex: 1,
    fontSize: 15,
  },
});
