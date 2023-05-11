import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, TextInput, Button } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddMedicationDetails({ props, navigation }) {
  const [state, setState] = useState({ name: "", purpose: "", tabletsPerIntake: 1, frequencyPerIntake: 0 });
  const [date, setDate] = useState(new Date(1598051730000));
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

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
      <View>
        <Text>Start Time</Text>
        <DateTimePicker testID="dateTimePicker" value={date} mode={"time"} is24Hour={true} onChange={onChange} />
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
