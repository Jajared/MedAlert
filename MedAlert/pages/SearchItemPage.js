import BackNavBar from "../components/BackNavBar/BackNavBar";
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView, StatusBar } from "react-native";

export default function SearchItem({ route, navigation }) {
  const item = route.params.medicationDetails;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title={item.product_name} style={{ flex: 1 }} />
      <Text style={styles.subheader}>Product Name:</Text>
      <Text style={styles.text}>{item.product_name}</Text>
      <Text style={styles.subheader}>Manufacturer:</Text>
      <Text style={styles.text}>{item.manufacturer}</Text>
      <Text style={styles.subheader}>Dosage Form:</Text>
      <Text style={styles.text}>{item.dosage_form}</Text>
      <Text style={styles.subheader}>Active Ingredients:</Text>
      <Text style={styles.text}>{item.active_ingredients}</Text>
      <Text style={styles.subheader}>Strength:</Text>
      <Text style={styles.text}>{item.strength}</Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  item: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
  },
  subheader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
  },
});
