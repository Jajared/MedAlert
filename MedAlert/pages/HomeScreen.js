import { StyleSheet, Text, SafeAreaView, Image, View } from "react-native";
import MedicationItem from "../components/MedicationItem/MedicationItem";
import { FlatList } from "react-native";
import HomeNavBar from "../components/HomeNavBar/HomeNavBar";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";

export default function HomeScreen({ props, navigation }) {
  const allMedicationItems = props.allMedicationItems;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topNavBar}>
        <HomeNavBar navigation={navigation} />
      </View>
      <View style={styles.medicationSection}>{allMedicationItems && <FlatList data={allMedicationItems} renderItem={(data) => <MedicationItem title={data.Name} props={data} navigation={navigation} />} keyExtractor={(item) => item.Name} />}</View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  topNavBar: {
    flex: 2,
  },
  bottomNavBar: {
    flex: 1,
  },
  medicationSection: {
    flex: 7,
    width: "100%",
  },
});
