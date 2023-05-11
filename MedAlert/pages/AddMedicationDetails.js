import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, Image, View, TouchableOpacity, TextInput, Button } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";

export default function AddMedicationDetails({ props, navigation }) {
  const [state, setState] = useState({ name: "", purpose: "", tabletsPerIntake: 1, frequencyPerIntake: 0 });

  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Add Medication" />
      <View>
        <Text>Name of Medication</Text>
        <TextInput style={styles.input} onChangeText={(text) => setState({ ...state, name: text })} value={state.name} placeholder="Name" />
      </View>
      <View>
        <Text>Purpose of Medication</Text>
        <TextInput style={styles.input} onChangeText={(text) => setState({ ...state, purpose: text })} value={state.purpose} placeholder="Purpose" />
      </View>
      <View style={styles.counterContainer}>
        <Text>Tablets per Intake</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-starts",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 18,
    color: "#333",
  },
  typeContainer: {
    backgroundColor: "#FAF6E0",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    margin: 15,
    alignItems: "center",
    height: 100,
    width: 200,
    flexDirection: "row",
  },
});
