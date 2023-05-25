import { View, SafeAreaView, StyleSheet, TextInput, FlatList, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { useState } from "react";
import medicationDb from "../assets/medicationDb.json";
import filter from "lodash.filter";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import BackNavBar from "../components/BackNavBar/BackNavBar";

const medData = Array.from(Object.values(medicationDb));

export default function MedicationDatabase({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(medData);
  const [fullData, setFullData] = useState(medData);

  const dosageFormIcons = {
    Tablet: <Image source={require("../assets/medicationDB/tablet.png")} style={{ width: 24, height: 24 }} />,
    Injection: <Image source={require("../assets/medicationDB/injection.png")} style={{ width: 24, height: 24 }} />,
    Capsule: <Image source={require("../assets/medicationDB/capsule.png")} style={{ width: 24, height: 24 }} />,
    Cream: <Image source={require("../assets/medicationDB/cream.png")} style={{ width: 24, height: 24 }} />,
    Solution: <Image source={require("../assets/medicationDB/solution.png")} style={{ width: 24, height: 24 }} />,
    Granule: <Image source={require("../assets/medicationDB/capsule.png")} style={{ width: 24, height: 24 }} />,
    Syrup: <Image source={require("../assets/medicationDB/syrup.png")} style={{ width: 24, height: 24 }} />,
    Ointment: <Image source={require("../assets/medicationDB/ointment.png")} style={{ width: 24, height: 24 }} />,
    Powder: <Image source={require("../assets/medicationDB/powder.png")} style={{ width: 24, height: 24 }} />,
  };

  const getDosageFormIcon = (dosageForm) => {
    const formattedDosageForm = dosageForm.toLowerCase().replace(/\s/g, "");

    for (const form in dosageFormIcons) {
      if (formattedDosageForm.includes(form.toLowerCase())) {
        return dosageFormIcons[form];
      }
    }

    // If no matching dosage form found, return a default icon
    return <AntDesign name="medicinebox" size={24} color="black" />;
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, (item) => {
      return contains(item, formattedQuery);
    });
    setData(filteredData);
  };

  const contains = ({ product_name }, query) => {
    if (product_name.toLowerCase().includes(query)) {
      return true;
    }
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="Medication Database" />
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="black" style={{ flex: 1 }} />
        <TextInput placeholder="Search" clearButtonMode="always" autoCapitalize="none" autoCorrect={false} onChangeText={(query) => handleSearch(query)} style={{ flex: 9 }} />
      </View>
      <View style={styles.data}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("Search Medication Item", { medicationDetails: item })} style={styles.searchItem}>
              <View style={styles.searchItemIcon}>{getDosageFormIcon(item.dosage_form)}</View>
              <View style={styles.searchItemText}>
                <Text style={styles.searchItemTitle}>{item.product_name}</Text>
                <Text style={styles.seachItemInfo}>{item.manufacturer}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.product_name + item.manufacturer}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center", // Align items vertically in the center
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8, // Adjust vertical padding to make it more compact
    width: "90%",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 8,
  },

  data: {
    flex: 1,
    marginTop: 10,
    width: "90%",
  },
  searchItem: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  searchItemIcon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchItemText: {
    flex: 7,
  },
  searchItemInfo: {
    fontSize: 12,
  },
  searchItemTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
