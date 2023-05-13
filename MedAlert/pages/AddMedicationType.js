import { StyleSheet, Text, SafeAreaView, Image, View, TouchableOpacity } from "react-native";
import BackNavBar from "../components/BackNavBar/BackNavBar";

export default function AddMedicationType({ props, navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Select type of medication" />
      <TouchableOpacity style={styles.typeContainer} onPress={() => navigation.navigate("Add Medication Details", { Type: "Pill" })}>
        <Image source={require("../assets/pill-icon.png")} style={styles.icon} />
        <Text style={styles.medicineType}>Tablet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.typeContainer} onPress={() => navigation.navigate("Add Medication Details", { Type: "Liquid" })}>
        <Image source={require("../assets/syrup-icon.png")} style={styles.icon} />
        <Text style={styles.medicineType}>Liquid</Text>
      </TouchableOpacity>
      <View style={styles.bottomNavBar}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-starts",
  },
  bottomNavBar: {
    flex: 1,
  },
  medicineType: {
    flex: 2,
    fontWeight: "bold",
    fontSize: 25,
  },
  icon: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    margin: 10,
  },

  typeContainer: {
    backgroundColor: "#FAF6E0",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    margin: 15,
    alignItems: "center",
    height: 100,
    width: 200,
    flexDirection: "row",
  },
});
