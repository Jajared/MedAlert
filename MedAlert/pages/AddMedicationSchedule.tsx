import { StyleSheet, Text, SafeAreaView, View, StatusBar, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../components/Buttons/CustomButton";
import { MedicationItemData } from "../utils/types";

export default function AddMedicationSchedule({ navigation, route, addMedication }) {
  const [state, setState] = useState<MedicationItemData>({ ...route.params.state });
  const [date, setDate] = useState<Date>(new Date(2023, 1, 1, 9, 0, 0));
  const onChange = (event, selectedDate: Date) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setFirstDosageTiming(currentDate);
  };

  function setFirstDosageTiming(date: Date) {
    setState((prevState) => ({ ...prevState, Instructions: { ...prevState.Instructions, FirstDosageTiming: convertTimeStringtoInteger(date) } }));
  }

  function convertTimeStringtoInteger(date: Date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var time = hours * 60 + minutes;
    return time;
  }

  function setSpecifications(value: string) {
    setState((prevState) => ({ ...prevState, Instructions: { ...prevState.Instructions, Specifications: value } }));
  }

  function handleSubmit() {
    if (state.Instructions.Specifications.trim() == "") {
      alert("Please select instructions");
      return false;
    }
    return true;
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
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
                isChecked={state.Instructions.Specifications === "Before Meal"}
                onPress={() => setSpecifications("Before Meal")}
                disableBuiltInState={true}
              />
              <BouncyCheckbox
                text="After Meal"
                textStyle={{
                  textDecorationLine: "none",
                }}
                style={styles.optionsItem}
                isChecked={state.Instructions.Specifications === "After Meal"}
                onPress={() => setSpecifications("After Meal")}
                disableBuiltInState={true}
              />
            </View>
            <View style={styles.optionsRow}>
              <BouncyCheckbox
                text="Every morning"
                textStyle={{
                  textDecorationLine: "none",
                }}
                style={styles.optionsItem}
                isChecked={state.Instructions.Specifications === "Every morning"}
                onPress={() => setSpecifications("Every morning")}
                disableBuiltInState={true}
              />
              <BouncyCheckbox
                text="No specific instructions"
                textStyle={{
                  textDecorationLine: "none",
                }}
                style={styles.optionsItem}
                isChecked={state.Instructions.Specifications === "No specific instructions"}
                onPress={() => setSpecifications("No specific instructions")}
                disableBuiltInState={true}
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
          <CustomButton
            title="next"
            onPress={() => {
              if (handleSubmit() == true) {
                addMedication(state);
                navigation.navigate("Home");
              }
            }}
          />
        </View>
        <View style={styles.bottomNavBar}></View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bottomNavBar: {
    flex: 1,
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
