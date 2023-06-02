import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { AntDesign, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const dosageFormIcons = {
  Tablet: <Image source={require("../../assets/medicationDB/tablet.png")} style={{ width: 24, height: 24 }} />,
  Injection: <Image source={require("../../assets/medicationDB/injection.png")} style={{ width: 24, height: 24 }} />,
  Capsule: <Image source={require("../../assets/medicationDB/capsule.png")} style={{ width: 24, height: 24 }} />,
  Cream: <Image source={require("../../assets/medicationDB/cream.png")} style={{ width: 24, height: 24 }} />,
  Solution: <Image source={require("../../assets/medicationDB/solution.png")} style={{ width: 24, height: 24 }} />,
  Granule: <Image source={require("../../assets/medicationDB/capsule.png")} style={{ width: 24, height: 24 }} />,
  Syrup: <Image source={require("../../assets/medicationDB/syrup.png")} style={{ width: 24, height: 24 }} />,
  Ointment: <Image source={require("../../assets/medicationDB/ointment.png")} style={{ width: 24, height: 24 }} />,
  Powder: <Image source={require("../../assets/medicationDB/powder.png")} style={{ width: 24, height: 24 }} />,
};

export default class SearchItem extends PureComponent {
  getDosageFormIcon(dosageForm) {
    const formattedDosageForm = dosageForm.toLowerCase().replace(/\s/g, "");

    for (const form in dosageFormIcons) {
      if (formattedDosageForm.includes(form.toLowerCase())) {
        return dosageFormIcons[form];
      }
    }

    // If no matching dosage form found, return a default icon
    return <AntDesign name="medicinebox" size={24} color="black" />;
  }

  render() {
    const { item, navigation } = this.props;
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Search Medication Item", { medicationDetails: item })} style={styles.searchItem}>
        <View style={styles.searchItemIcon}>{this.getDosageFormIcon(item.dosage_form)}</View>
        <View style={styles.searchItemText}>
          <Text style={styles.searchItemTitle}>{item.product_name}</Text>
          <Text style={styles.seachItemInfo}>{item.manufacturer}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  searchItem: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 2,
    backgroundColor: "white",
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
    marginBottom: 5,
  },
});
