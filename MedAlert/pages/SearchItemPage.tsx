import BackNavBar from "../components/BackNavBar";
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView, StatusBar } from "react-native";
import TagButton from "../components/TagButton";
import { AntDesign, Ionicons } from "@expo/vector-icons";

export default function SearchItemPage({ route, navigation, addToFavourites, removeFromFavourites, isFavourite }) {
  const item = route.params.medicationDetails;
  const capitalizeWords = (str: string) => {
    const words = str.toLowerCase().split(" ");
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(" ");
  };
  const dosage_forms = item.dosage_form.split(", ");
  const displayAdd = () => {
    return dosage_forms.includes("TABLET") || dosage_forms.includes("SYRUP") || dosage_forms.includes("CAPSULE");
  };
  const getMedicationType = () => {
    if (dosage_forms.includes("TABLET") || dosage_forms.includes("CAPSULE")) {
      return "Pill";
    } else if (dosage_forms.includes("SYRUP")) {
      return "Liquid";
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {displayAdd() && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Add Medication Details", { Type: getMedicationType(), addInfo: { name: item.product_name } });
            }}
            style={styles.addButton}
          >
            <Ionicons name="add-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        )}
        {isFavourite(item.product_name + "," + item.manufacturer) == false ? (
          <TouchableOpacity
            onPress={() => {
              addToFavourites(item.product_name + "," + item.manufacturer);
            }}
            style={styles.favouritesButton}
          >
            <AntDesign name="hearto" size={22} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              removeFromFavourites(item.product_name + "," + item.manufacturer);
            }}
            style={styles.favouritesButton}
          >
            <AntDesign name="heart" size={22} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.productName}>
        <Text style={{ fontWeight: "bold", fontSize: 22 }}>{capitalizeWords(item.product_name)}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.header}>Manufacturer</Text>
        <Text style={styles.text}>{capitalizeWords(item.manufacturer)}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.header}>Dosage Form</Text>
        <View style={styles.buttonContainer}>
          {dosage_forms.map((form: string) => (
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
  backButton: {
    position: "absolute",
    left: 30,
  },
  addButton: {
    position: "absolute",
    right: 80,
  },
  favouritesButton: {
    position: "absolute",
    right: 30,
  },
  topBar: {
    flexDirection: "row",
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    width: "90%",
    flex: 1,
    flexDirection: "row",
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
  productName: {
    width: "90%",
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
