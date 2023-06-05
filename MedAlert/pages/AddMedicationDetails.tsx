import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, TextInput, Button, StatusBar } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Entypo } from "@expo/vector-icons";
import CameraComponent from "../components/CameraComponent/CameraComponent";
import CustomButton from "../components/Buttons/CustomButton";
import { MedicationItemData } from "../utils/types";

export default function AddMedicationDetails({ navigation, route }) {
  const [state, setState] = useState<MedicationItemData>({ Name: "", Type: route.params.Type, Purpose: "", Instructions: { TabletsPerIntake: 1, FrequencyPerDay: 0, Specifications: "", FirstDosageTiming: 540 } });
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("");

  function setFrequencyPerIntake(value: number) {
    setState((prevState) => ({ ...prevState, Instructions: { ...prevState.Instructions, FrequencyPerDay: value } }));
  }
  function handleSubmit() {
    if (state.Name.trim() === "") {
      alert("Please enter Name of Medication");
      return false;
    }
    if (state.Purpose.trim() === "") {
      alert("Please enter Purpose of Medication");
      return false;
    }
    if (state.Instructions.FrequencyPerDay == 0) {
      alert("Please select Frequency");
      return false;
    }
    if (isNaN(state.Instructions.TabletsPerIntake)) {
      alert("Please enter a numeric value for Volume per Intake");
      return false;
    }
    return true;
  }

  const handleCancel = () => {
    setShowCamera(false);
  };

  if (route.params.Type == "Pill") {
    return showCamera ? (
      <View style={{ width: "100%", height: "100%" }}>
        <CameraComponent onCancel={handleCancel} />
      </View>
    ) : (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity style={{ position: "absolute", top: 60, right: 40, zIndex: 1 }} onPress={() => setShowCamera(true)}>
          <Entypo name="camera" size={24} color="black" />
        </TouchableOpacity>
        <BackNavBar navigation={navigation} title="Add Medication" />
        <View style={styles.nameSection}>
          <Text style={styles.textHeader}>Name of Medication</Text>
          <TextInput style={styles.inputBox} onChangeText={(text) => setState({ ...state, Name: text.trim() })} value={state.Name} placeholder="Name" />
        </View>
        <View style={styles.purposeSection}>
          <Text style={styles.textHeader}>Purpose of Medication</Text>
          <TextInput style={styles.inputBox} onChangeText={(text) => setState({ ...state, Purpose: text.trim() })} value={state.Purpose} placeholder="Purpose" />
        </View>
        <View style={styles.intakeSection}>
          <Text style={styles.textHeader}>Tablets per Intake</Text>
          <Button
            title="-"
            onPress={() => {
              if (state.Instructions.TabletsPerIntake > 1) {
                setState((prevState) => ({ ...prevState, Instructions: { ...prevState.Instructions, TabletsPerIntake: prevState.Instructions.TabletsPerIntake - 1 } }));
              } else {
                alert("Cannot be less than 1");
              }
            }}
          />
          <Text style={styles.textHeader}>{state.Instructions.TabletsPerIntake}</Text>
          <Button title="+" onPress={() => setState((prevState) => ({ ...prevState, Instructions: { ...prevState.Instructions, TabletsPerIntake: prevState.Instructions.TabletsPerIntake + 1 } }))} />
        </View>
        <View style={styles.frequencySection}>
          <Text style={styles.textHeader}>Take this medication:</Text>
          <BouncyCheckbox
            text="Daily"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={state.Instructions.FrequencyPerDay === 1}
            onPress={() => setFrequencyPerIntake(1)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Twice a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={state.Instructions.FrequencyPerDay === 2}
            onPress={() => setFrequencyPerIntake(2)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Three times a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={state.Instructions.FrequencyPerDay === 3}
            onPress={() => setFrequencyPerIntake(3)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Four times a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={state.Instructions.FrequencyPerDay === 4}
            onPress={() => setFrequencyPerIntake(4)}
            disableBuiltInState={true}
          />
        </View>
        <View style={styles.nextSection}>
          <CustomButton
            title="Next"
            onPress={() => {
              if (handleSubmit() == true) {
                navigation.navigate("Add Medication Schedule", { state });
              }
            }}
          />
        </View>
        <View style={styles.bottomNavBar} />
      </SafeAreaView>
    );
  } else {
    return showCamera ? (
      <View style={{ width: "100%", height: "100%" }}>
        <CameraComponent onCancel={handleCancel} />
      </View>
    ) : (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity style={{ position: "absolute", top: 60, right: 40, zIndex: 1 }} onPress={() => setShowCamera(true)}>
          <Entypo name="camera" size={24} color="black" />
        </TouchableOpacity>
        <BackNavBar navigation={navigation} title="Add Medication" />
        <View style={styles.nameSection}>
          <Text style={styles.textHeader}>Name of Medication</Text>
          <TextInput style={styles.inputBox} onChangeText={(text) => setState({ ...state, Name: text.trim() })} value={state.Name} placeholder="Name" />
        </View>
        <View style={styles.purposeSection}>
          <Text style={styles.textHeader}>Purpose of Medication</Text>
          <TextInput style={styles.inputBox} onChangeText={(text) => setState({ ...state, Purpose: text.trim() })} value={state.Purpose} placeholder="Purpose" />
        </View>
        <View style={styles.intakeSection}>
          <Text style={styles.textHeader}>Volume per Intake (in ml)</Text>
          <TextInput style={styles.volumeBox} keyboardType="decimal-pad" onChangeText={(text) => setState({ ...state, Instructions: { ...state.Instructions, TabletsPerIntake: parseFloat(text) } })} />
        </View>
        <View style={styles.frequencySection}>
          <Text style={styles.textHeader}>Take this medication:</Text>
          <BouncyCheckbox
            text="Daily"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={state.Instructions.FrequencyPerDay === 1}
            onPress={() => setFrequencyPerIntake(1)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Twice a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={state.Instructions.FrequencyPerDay === 2}
            onPress={() => setFrequencyPerIntake(2)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Three times a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={state.Instructions.FrequencyPerDay === 3}
            onPress={() => setFrequencyPerIntake(3)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Four times a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={state.Instructions.FrequencyPerDay === 4}
            onPress={() => setFrequencyPerIntake(4)}
            disableBuiltInState={true}
          />
        </View>
        <View style={styles.nextSection}>
          <CustomButton
            title="Next"
            onPress={() => {
              if (handleSubmit() == true) {
                navigation.navigate("Add Medication Schedule", { state });
              }
            }}
          />
        </View>
        <View style={styles.bottomNavBar} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  nameSection: {
    flex: 1,
    width: "80%",
  },
  bottomNavBar: {
    flex: 1,
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
    flex: 2,
    width: "80%",
  },
  frequencyItem: {
    marginTop: 5,
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
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  volumeBox: {
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 20,
    marginTop: 5,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    textAlign: "center",
  },
});
