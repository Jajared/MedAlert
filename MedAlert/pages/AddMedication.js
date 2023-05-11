import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, Image, View, TouchableOpacity } from "react-native";
import BackNavBar from "../components/BackNavBar/BackNavBar";

export default function AddMedication({ props, navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Select type of navigation" />
      <View style={styles.typeContainer}>
        <Image src={"/Users/hungryjared/Desktop/NUS/Projects/Orbital/MedAlert/assets/pill-icon.png"} style={styles.icon} />
        <Text style={styles.medicineType}>Tablet</Text>
      </View>
      <View style={styles.typeContainer}>
        <Image src={"/Users/hungryjared/Desktop/NUS/Projects/Orbital/MedAlert/assets/syrup-icon.png"} style={styles.icon} />
        <Text style={styles.medicineType}>Liquid</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-starts",
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
    margin: 20,
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
