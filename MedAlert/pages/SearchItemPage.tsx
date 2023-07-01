import BackNavBar from "../components/BackNavBar";
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView, StatusBar } from "react-native";

export default function SearchItemPage({ route, navigation }) {
  const item = route.params.medicationDetails;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title={item.product_name} />
      <View style={styles.item}>
        <Text style={styles.subheader}>Product Name:</Text>
        <Text style={styles.text}>{item.product_name}</Text>
        <Text style={styles.subheader}>Manufacturer:</Text>
        <Text style={styles.text}>{item.manufacturer}</Text>
        <Text style={styles.subheader}>Dosage Form:</Text>
        <Text style={styles.text}>{item.dosage_form}</Text>
        <Text style={styles.subheader}>Active Ingredients:</Text>
        <Text style={styles.text}>{item.active_ingredients.replace(/&&/g, ", ")}</Text>
        <Text style={styles.subheader}>Strength:</Text>
        <Text style={styles.text}>{item.strength.replace(/&&/g, ", ")}</Text>
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
  },
  item: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
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
