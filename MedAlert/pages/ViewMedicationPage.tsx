import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity, StatusBar } from "react-native";
import BottomNavBar from "../components/BottomNavBar";
import BackNavBar from "../components/BackNavBar";
import { FlatList } from "react-native";
import { MedicationItemData } from "../utils/types";
import TextTicker from "react-native-text-ticker";

export default function ViewMedicationPage({ navigation, allMedicationItems }) {
  const pillIcon = require("../assets/pill-icon.png");
  const syrupIcon = require("../assets/syrup-icon.png");

  function getIcon(medicationData: MedicationItemData) {
    const type = medicationData.Type;
    if (type === "Pill") {
      return pillIcon;
    } else if (type === "Liquid") {
      return syrupIcon;
    }
  }

  function getUnits(medicationData: MedicationItemData) {
    const type = medicationData.Type;
    if (type === "Pill") {
      return "Tablets per Intake";
    } else if (type === "Liquid") {
      return "ml per Intake";
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="View Medications" />
      <View style={styles.medicationSection}>
        {allMedicationItems.length != 0 ? (
          <FlatList
            data={allMedicationItems}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity onPress={() => navigation.navigate("Edit Medication Details", { medicationName: item.Name })} style={styles.itemContainer}>
                  <Image source={getIcon(item)} style={styles.icon} />
                  <View style={styles.medicationInfo}>
                    <TextTicker style={{ fontWeight: "bold", fontSize: 20 }} duration={3000} loop bounceDelay={50} repeatSpacer={50} marqueeDelay={1000}>
                      {item.Name}
                    </TextTicker>
                    <TextTicker duration={3000} loop bounceDelay={50} repeatSpacer={50} marqueeDelay={1000}>
                      {item.Purpose}
                    </TextTicker>
                    <Text>
                      {item.Instructions.TabletsPerIntake} {getUnits(item)}
                    </Text>
                    <Image source={require("../assets/edit-icon.png")} style={styles.logo}></Image>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.Name}
          />
        ) : (
          <Text style={styles.warnMessage}>You have no existing medication</Text>
        )}
      </View>
      <View style={styles.bottomNavBar}>
        <BottomNavBar navigation={navigation} />
      </View>
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
    borderColor: "#FAF6E0",
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
  bottomNavBar: {
    height: 60,
  },
  logo: {
    height: 15,
    width: 15,
    marginLeft: 180,
  },
  warnMessage: {
    fontSize: 16,
    color: "grey",
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 20,
  },
});
