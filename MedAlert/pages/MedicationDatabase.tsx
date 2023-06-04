import { View, SafeAreaView, StyleSheet, TextInput, FlatList, Text, TouchableOpacity, Image, StatusBar, ScrollView } from "react-native";
import { useCallback, useState } from "react";
import medicationDb from "../assets/medicationDb.json";
import filter from "lodash.filter";
import { AntDesign, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import SearchItem from "../components/SearchItem/SearchItem";

const medData = Array.from(Object.values(medicationDb));

export default function MedicationDatabase({ navigation }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDosageForm, setSelectedDosageForm] = useState<string>("");
  const [data, setData] = useState(medData);
  const [fullData, setFullData] = useState(medData);

  const dosageFormTypes = ["All", "Tablet", "Injection", "Capsule", "Cream", "Solution", "Granule", "Syrup", "Ointment", "Powder"];

  const handleSearchByName = (query: string) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, (item) => {
      return contains(item, formattedQuery);
    });
    setData(filteredData);
  };

  const handleSearchByDosageForm = useCallback(
    (dosageForm) => {
      if (dosageForm === "All") {
        setData(fullData);
      } else {
        const filteredData = fullData.filter((item) => item.dosage_form.toLowerCase().includes(dosageForm.toLowerCase()));
        setData(filteredData);
      }
    },
    [fullData, setData]
  );

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
        <TextInput placeholder="Search" clearButtonMode="always" autoCapitalize="none" autoCorrect={false} onChangeText={(query) => handleSearchByName(query)} style={{ flex: 8 }} />
      </View>
      <View style={styles.filterBar}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          {dosageFormTypes.map((dosageForm) => (
            <TouchableOpacity
              key={dosageForm}
              onPress={() => {
                setSelectedDosageForm(dosageForm);
                handleSearchByDosageForm(dosageForm);
              }}
              style={[styles.filterItem, dosageForm === selectedDosageForm && styles.selectedFilterItem]}
            >
              <Text style={[styles.filterText, dosageForm === selectedDosageForm && styles.selectedFilterText]}>{dosageForm}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.data}>
        <FlatList data={data} renderItem={({ item }) => <SearchItem item={item} navigation={navigation} />} keyExtractor={(item) => item.product_name + item.manufacturer} initialNumToRender={10} />
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
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: "90%",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 8,
  },
  filterBar: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  filterItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#E0E0E0",
  },
  selectedFilterItem: {
    backgroundColor: "#FAF6E0",
  },
  filterText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  selectedFilterText: {
    color: "black",
    fontWeight: "bold",
  },
  data: {
    flex: 1,
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
