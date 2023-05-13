import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, TextInput, Button } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddMedicationDetails({ props, navigation }) {
  const [state, setState] = useState({ name: "", purpose: "", tabletsPerIntake: 1, frequencyPerIntake: 0 });

  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Add Medication" />
      <View style={styles.nameSection}>
        <Text style={styles.textHeader}>Name of Medication</Text>
        <TextInput style={styles.inputBox} onChangeText={(text) => setState({ ...state, name: text })} value={state.name} placeholder="Name" />
      </View>
      <View style={styles.purposeSection}>
        <Text style={styles.textHeader}>Purpose of Medication</Text>
        <TextInput style={styles.inputBox} onChangeText={(text) => setState({ ...state, purpose: text })} value={state.purpose} placeholder="Purpose" />
      </View>
      <View style={styles.intakeSection}>
        <Text style={styles.textHeader}>Tablets per Intake</Text>
        <Button
          title="-"
          onPress={() => {
            if (state < 1) {
              setState((prevState) => ({ ...prevState, tabletsPerIntake: prevState.tabletsPerIntake - 1 }));
            } else {
              alert("Cannot be less than 1");
            }
          }}
        />
        <Text style={styles.text}>{state.tabletsPerIntake}</Text>
        <Button title="+" onPress={() => setState((prevState) => ({ ...prevState, tabletsPerIntake: prevState.tabletsPerIntake + 1 }))} />
      </View>
      <View style={styles.frequencySection}>
        <Text style={styles.textHeader}>Take this medication:</Text>
      </View>
      <View style={styles.nextSection}>
        <Button title="next" onPress={() => navigation.navigate("Add Medication Schedule")} />
      </View>
      <View style={{ flex: 1 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-starts",
  },
  nameSection: {
    flex: 1,
    width: "80%",
  },
  purposeSection: {
    flex: 1,
    width: "80%",
  },
  intakeSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
    width: "80%",
  },
  frequencySection: {
    flex: 3,
    width: "80%",
  },
  textHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  nextSection: {
    flex: 1,
  },
});
