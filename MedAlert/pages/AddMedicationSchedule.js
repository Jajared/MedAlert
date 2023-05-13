import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, TextInput, Button } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddMedicationSchedule({ props, navigation }) {
  const [state, setState] = useState({ name: "", purpose: "", tabletsPerIntake: 1, frequencyPerIntake: 0 });
  const [date, setDate] = useState(new Date(1598051730000));
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Schedule" />
      <View style={styles.optionsSection}>
        <Text style={styles.textHeader}>Medication Instructions</Text>
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <BouncyCheckbox
              text="Before Meal"
              textStyle={{
                textDecorationLine: "none",
              }}
              style={styles.optionsItem}
            />
            <BouncyCheckbox
              text="After Meal"
              textStyle={{
                textDecorationLine: "none",
              }}
              style={styles.optionsItem}
            />
          </View>
          <View style={styles.optionsRow}>
            <BouncyCheckbox
              text="Every morning"
              textStyle={{
                textDecorationLine: "none",
              }}
              style={styles.optionsItem}
            />
            <BouncyCheckbox
              text="No specific instructions"
              textStyle={{
                textDecorationLine: "none",
              }}
              style={styles.optionsItem}
            />
          </View>
        </View>
      </View>
      <View style={styles.dosageSection}>
        <Text style={styles.textHeader}>First dosage timing:</Text>
        <DateTimePicker testID="dateTimePicker" display="spinner" value={date} mode="time" onChange={onChange} />
      </View>
      <View style={{ flex: 3 }} />
      <View style={styles.nextSection}>
        <Button title="next" onPress={() => navigation.navigate("Add Medication Schedule")} />
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
    justifyContent: "flex-starts",
  },
  optionsSection: {
    flex: 1,
    width: "80%",
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "column",
  },
  optionsRow: {
    flexDirection: "row",
    flex: 1,
  },
  optionsItem: {
    flex: 1,
  },
  dosageSection: {
    flex: 1,
    width: "80%",
  },
  textHeader: {
    fontSize: 14,
    fontWeight: "bold",
  },
  nextSection: {
    flex: 1,
  },
});
