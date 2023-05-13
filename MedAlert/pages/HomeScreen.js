import { StyleSheet, Text, SafeAreaView, Image, View } from "react-native";
import MedicationItem from "../components/MedicationItem/MedicationItem";
import { FlatList } from "react-native";
import HomeNavBar from "../components/HomeNavBar/HomeNavBar";

export default function HomeScreen({ props, navigation }) {
  const allMedicationItems = props.allMedicationItems;
  return (
    <SafeAreaView style={styles.container}>
      <HomeNavBar navigation={navigation} />
      {allMedicationItems && <FlatList data={allMedicationItems} renderItem={(data) => <MedicationItem title={data.Name} props={data} navigation={navigation} />} keyExtractor={(item) => item.Name} />}
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
});
