import { StyleSheet, SafeAreaView, View, StatusBar } from "react-native";
import MedicationItem from "../components/MedicationItem/MedicationItem";
import { FlatList } from "react-native";
import HomeNavBar from "../components/HomeNavBar/HomeNavBar";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";

export default function HomeScreen({ navigation, scheduledItems, setAcknowledged, userName }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topNavBar}>
        <HomeNavBar navigation={navigation} userName={userName} />
      </View>
      <View style={styles.medicationSection}>{scheduledItems && <FlatList data={scheduledItems.filter((data) => data.Acknowledged === false)} renderItem={(data) => <MedicationItem props={data} setAcknowledged={setAcknowledged} />} keyExtractor={(item) => item.id} />}</View>
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
