import { View, SafeAreaView, StyleSheet, TextInput, FlatList, Text } from "react-native";
import { useState } from "react";
import medicationDb from "../assets/medicationDb.json";
import filter from "lodash.filter";

const medData = Array.from(Object.values(medicationDb));

export default function MedicationDatabase({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(medData);
  const [fullData, setFullData] = useState(medData);

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
      <View style={styles.searchBar}>
        <TextInput placeholder="Search" clearButtonMode="always" autoCapitalize="none" autoCorrect={false} onChangeText={(query) => handleSearch(query)} />
      </View>
      <View style={styles.data}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.productName}>{item.product_name}</Text>
            </View>
          )}
          keyExtractor={(item) => item.product_name}
        />
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
  searchBar: { marginTop: 10, paddingHorizontal: 20, paddingVertical: 10, width: "90%", borderColor: "grey", borderWidth: 1 },
  data: { flex: 1 },
  itemContainer: { padding: 10, borderBottomColor: "grey", borderBottomWidth: 1 },
  productName: { fontSize: 20, fontWeight: "bold" },
});
