import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import { FlatList } from "react-native";

export default function ViewMedicationPage({ navigation, allMedicationItems }) {
  const pillIcon = require("../assets/pill-icon.png");
  const syrupIcon = require("../assets/syrup-icon.png");

  function getIcon(medicationData) {
    const type = medicationData.Type;
    if (type === "Pill") {
      return pillIcon;
    } else if (type === "Liquid") {
      return syrupIcon;
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="View Medications" style={{ flex: 1 }} />
      <View style={styles.medicationSection}>
        {allMedicationItems && (
          <FlatList
            data={allMedicationItems}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity onPress={() => navigation.navigate("Edit Medication Details", { medicationName: item.Name })} style={styles.itemContainer}>
                  <Image source={getIcon(item)} style={styles.icon} />
                  <View style={styles.medicationInfo}>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>{item.Name}</Text>
                    <Text>{item.Purpose}</Text>
                    <Text>{item.Instructions.TabletsPerIntake} tablets per intake</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.Name}
          />
        )}
      </View>
      <BottomNavBar navigation={navigation} style={{ flex: 1 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  medicationSection: {
    flex: 9,
    width: "90%",
  },
  medicationInfo: {
    flex: 3,
    marginLeft: 20,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FAF6E0",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    margin: 15,
    alignItems: "center",
    height: 100,
  },
  icon: {
    flex: 1,
    width: "80%",
    height: "80%",
    resizeMode: "contain",
    marginLeft: 10,
  },
});
