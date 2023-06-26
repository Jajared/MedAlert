import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesome5, Entypo, AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

export default function BottomNavBar({ navigation }) {
  const currentRoute = useRoute().name;
  return (
    <View style={styles.container}>
      <View style={styles.iconSection}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Entypo name="home" size={26} style={[styles.icon, currentRoute === "Home" && styles.selectedIcon]} />
          <Text style={[styles.text, currentRoute === "Home" && styles.selectedText]}>Home</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconSection}>
        <TouchableOpacity onPress={() => navigation.navigate("View All Medications")}>
          <FontAwesome5 name="pills" size={26} style={[styles.icon, currentRoute === "View All Medications" && styles.selectedIcon]} />
          <Text style={[styles.text, currentRoute === "View All Medications" && styles.selectedText]}>Medications</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.iconSection}>
        <TouchableOpacity onPress={() => navigation.navigate("Performance")}>
          <AntDesign name="areachart" size={26} style={[styles.icon, currentRoute === "Performance" && styles.selectedIcon]} />
          <Text style={[styles.text, currentRoute === "Performance" && styles.selectedText]}>Statistics</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconSection}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile Page")}>
          <Entypo name="menu" size={26} style={[styles.icon, currentRoute === "Profile Page" && styles.selectedIcon]} />
          <Text style={[styles.text, currentRoute === "Profile Page" && styles.selectedText]}>Menu</Text>
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
    borderTopColor: "gray",
    borderTopWidth: 0.5,
    paddingTop: 10,
    paddingHorizontal: 5,
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
    color: "gray",
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: "gray",
  },
  selectedIcon: {
    color: "black",
  },
  selectedText: {
    color: "black",
  },
});
