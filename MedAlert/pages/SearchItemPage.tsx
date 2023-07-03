import BackNavBar from "../components/BackNavBar";
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView, StatusBar } from "react-native";
import TagButton from "../components/TagButton";
import { AntDesign } from "@expo/vector-icons";

export default function SearchItemPage({ route, navigation, addToFavourites, removeFromFavourites, isFavourite }) {
  const item = route.params.medicationDetails;
  const capitalizeWords = (str: string) => {
    const words = str.toLowerCase().split(" ");
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(" ");
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title={item.product_name} />
      {isFavourite(item.product_name) == false ? (
        <TouchableOpacity
          onPress={() => {
            addToFavourites(item.product_name);
          }}
          style={{ position: "absolute", top: 50, right: 50 }}
        >
          <AntDesign name="hearto" size={22} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            removeFromFavourites(item.product_name);
          }}
          style={{ position: "absolute", top: 50, right: 50 }}
        >
          <AntDesign name="heart" size={22} color="black" />
        </TouchableOpacity>
      )}
      <View style={styles.label}>
        <Text style={styles.header}>Product Name</Text>
        <Text style={styles.text}>{capitalizeWords(item.product_name)}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.header}>Manufacturer</Text>
        <Text style={styles.text}>{capitalizeWords(item.manufacturer)}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.header}>Dosage Form</Text>
        <View style={styles.buttonContainer}>
          {item.dosage_form.split(", ").map((form: string) => (
            <TagButton title={form} key={form} />
          ))}
        </View>
      </View>
      <View style={styles.label}>
        <Text style={styles.header}>Route of Administration</Text>
        <Text style={styles.text}>{capitalizeWords(item.route_of_administration)}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.header}>Active Ingredients</Text>
        <Text style={styles.text}>{item.active_ingredients.replace(/&&/g, ", ")}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.header}>Strength</Text>
        <Text style={styles.text}>{item.strength.replace(/&&/g, ", ")}</Text>
      </View>
      <View style={{ flex: 3 }}></View>
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
  label: {
    width: "90%",
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
  },
  item: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    flex: 2,
    marginLeft: 10,
  },
  buttonContainer: {
    flex: 2,
    alignItems: "flex-start",
    flexDirection: "row",
  },
});
