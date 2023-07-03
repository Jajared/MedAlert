import { View, SafeAreaView, StyleSheet, TextInput, FlatList, Text, TouchableOpacity, StatusBar, ScrollView, Modal } from "react-native";
import { useCallback, useState } from "react";
import medicationDb from "../assets/medicationDb.json";
import filter from "lodash.filter";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { firestorage } from "../firebaseConfig";
import { MaterialCommunityIcons, AntDesign, Entypo } from "@expo/vector-icons";
import BackNavBar from "../components/BackNavBar";
import SearchItem from "../components/SearchItem";

const medData = Array.from(Object.values(medicationDb));

export default function MedicationDatabase({ navigation, settings, userId }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDosageForm, setSelectedDosageForm] = useState<string[]>([]);
  const [data, setData] = useState(medData);
  const [fullData, setFullData] = useState(medData);
  const [isFilterPopUpVisible, setIsFilterPopUpVisible] = useState<boolean>(false);
  const [favouriteMedications, setFavouriteMedications] = useState<string[]>(settings.FavouriteMedications);
  const dosageFormTypes = ["Tablet", "Injection", "Capsule", "Cream", "Solution", "Granule", "Syrup", "Ointment", "Powder", "Spray", "Lotion"];
  const administrationRoutes = ["Oral", "Topical", "Intravenous", "Intramuscular", "Submucosal", "Dental", "Rectal", "Vaginal", "Cutaneous", "Intravitreous", "Conjunctival"];
  const handleSearchByName = (query: string) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, (item) => {
      return contains(item, formattedQuery);
    });
    setData(filteredData);
  };
  const addFilterOption = (dosageForm: string) => {
    if (selectedDosageForm.includes(dosageForm)) {
      setSelectedDosageForm(selectedDosageForm.filter((form) => form !== dosageForm));
    } else {
      setSelectedDosageForm([...selectedDosageForm, dosageForm]);
    }
  };

  const handleSearchByDosageForm = () => {
    if (selectedDosageForm.length === 0) {
      setData(fullData);
    } else {
      const filteredData = fullData.filter((item) => {
        const lowercaseDosageForm = item.dosage_form.toLowerCase();
        const lowercaseRouteOfAdmin = item.route_of_administration.toLowerCase();
        return selectedDosageForm.some((dosageForm) => lowercaseDosageForm.includes(dosageForm.toLowerCase()) || lowercaseRouteOfAdmin.includes(dosageForm.toLowerCase()));
      });
      setData(filteredData);
    }
  };

  const contains = ({ product_name, active_ingredients }, query) => {
    if (product_name.toLowerCase().includes(query) || active_ingredients.toLowerCase().includes(query)) {
      return true;
    }
    return false;
  };

  const getFavourites = () => {
    const favourites = fullData.filter((item) => favouriteMedications.some((med) => med === item.product_name));
    setData(favourites);
  };

  const addFavourite = async (medication: string) => {
    const newFavourites = [...favouriteMedications, medication];
    setFavouriteMedications(newFavourites);
    const docRef = doc(firestorage, "UsersData", userId);
    await updateDoc(docRef, { Settings: { ...settings, FavouriteMedications: newFavourites } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="Database" />
      <TouchableOpacity onPress={() => getFavourites()} style={{ position: "absolute", top: 70, right: 70 }}>
        <AntDesign name="hearto" size={22} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsFilterPopUpVisible(true)} style={{ position: "absolute", top: 70, right: 30 }}>
        <AntDesign name="filter" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="black" style={{ flex: 1 }} />
        <TextInput placeholder="Search by name or active ingredient" clearButtonMode="always" autoCapitalize="none" autoCorrect={false} onChangeText={(query) => handleSearchByName(query)} style={{ flex: 8 }} />
      </View>
      <View style={styles.data}>
        <FlatList data={data} renderItem={({ item }) => <SearchItem item={item} navigation={navigation} />} keyExtractor={(item) => item.product_name + item.manufacturer} initialNumToRender={10} />
      </View>
      <Modal visible={isFilterPopUpVisible} transparent={true} animationType="slide">
        <SafeAreaView style={styles.popUpContainer}>
          <View style={styles.popUp}>
            <View style={styles.topBar}>
              <Text style={styles.header}>Filters</Text>
              <AntDesign name="filter" size={20} color="black" />
              <TouchableOpacity
                onPress={() => {
                  setSelectedDosageForm([]);
                  setIsFilterPopUpVisible(false);
                }}
                style={styles.closeFilter}
              >
                <Entypo name="cross" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.filterContainer}>
              <Text style={styles.optionHeader}>Dosage Forms</Text>
              <View style={styles.filterOptions}>
                {dosageFormTypes.map((dosageForm) => (
                  <TouchableOpacity
                    key={dosageForm}
                    onPress={() => {
                      addFilterOption(dosageForm);
                    }}
                    style={[styles.filterItem, selectedDosageForm.includes(dosageForm) && styles.selectedFilterItem, { width: 65 }]}
                  >
                    <Text style={[styles.filterText, selectedDosageForm.includes(dosageForm) && styles.selectedFilterText]}>{dosageForm}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.optionHeader}>Route of Administration</Text>
              <View style={styles.filterOptions}>
                {administrationRoutes.map((route) => (
                  <TouchableOpacity
                    key={route}
                    onPress={() => {
                      addFilterOption(route);
                    }}
                    style={[styles.filterItem, selectedDosageForm.includes(route) && styles.selectedFilterItem, { width: 90 }]}
                  >
                    <Text style={[styles.filterText, selectedDosageForm.includes(route) && styles.selectedFilterText]}>{route}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={() => {
                handleSearchByDosageForm();
                setIsFilterPopUpVisible(false);
              }}
              style={styles.confirmButton}
            >
              <Text>Confirm</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  filterIcon: {
    position: "absolute",
    top: 70,
    right: 30,
  },
  topBar: {
    flexDirection: "row",
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
  filterItem: {
    margin: 5,
    borderRadius: 20,
    backgroundColor: "#eeeeee",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedFilterItem: {
    backgroundColor: "#FAF6E0",
  },
  filterText: {
    fontSize: 12,
  },
  selectedFilterText: {
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
  popUpContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  popUp: {
    backgroundColor: "white",
    width: "90%",
    height: "60%",
    borderRadius: 20,
    padding: 20,
  },
  filterContainer: {
    flexDirection: "column",
    marginTop: 10,
  },
  filterOptions: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  button: {
    color: "black",
    backgroundColor: "#F4BFBF",
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#F4BFBF",
    width: 80,
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
    fontSize: 18,
    borderRadius: 40,
  },
  closeFilter: {
    flex: 1,
    alignItems: "flex-end",
  },
  confirmButton: {
    backgroundColor: "#baeaa6",
    width: 100,
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
    fontSize: 18,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
  },
});
