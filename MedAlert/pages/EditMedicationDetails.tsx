import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, TextInput, Button, Modal, StatusBar } from "react-native";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import { useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import CustomButton from "../components/Buttons/CustomButton";
import { MedicationItemData } from "../utils/types";

export default function EditMedicationDetails({ navigation, allMedicationItems, deleteMedicationFromList, route }) {
  const [medicationItems, setMedicationItems] = useState<MedicationItemData[]>(allMedicationItems);
  const { medicationName } = route.params;
  const [medicationItem, setMedicationItem] = useState<MedicationItemData>(medicationItems.filter((item: MedicationItemData) => item.Name === medicationName)[0]);
  const [isDeletionPopUpVisible, setIsDeletionPopUpVisible] = useState<boolean>(false);
  const [volume, setVolume] = useState<string>(medicationItem.Instructions.TabletsPerIntake.toString());

  function setFrequencyPerIntake(value: number) {
    setMedicationItem((prevState) => ({ ...prevState, Instructions: { ...prevState.Instructions, FrequencyPerDay: value } }));
  }

  function setVolumePerIntake() {
    setMedicationItem((prevState) => ({ ...prevState, Instructions: { ...prevState.Instructions, TabletsPerIntake: parseInt(volume) } }));
    return { ...medicationItem, Instructions: { ...medicationItem.Instructions, TabletsPerIntake: parseInt(volume) } };
  }

  function handleSubmit() {
    if (medicationItem.Name.trim() === "") {
      alert("Please enter name of medication");
      return false;
    }
    if (medicationItem.Purpose.trim() === "") {
      alert("Please enter purpose of medication");
      return false;
    }
    if (medicationItem.Instructions.FrequencyPerDay == 0) {
      alert("Please select frequency");
      return false;
    }
    if (isNaN(medicationItem.Instructions.TabletsPerIntake)) {
      alert("Please enter a numeric value for Volume per Intake");
      return false;
    }
    return true;
  }
  if (medicationItem.Type == "Pill") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <BackNavBar navigation={navigation} title="Edit Medication Details" />
        <View style={styles.nameSection}>
          <Text style={styles.textHeader}>Name of Medication</Text>
          <TextInput style={styles.inputBox} onChangeText={(text) => setMedicationItem({ ...medicationItem, Name: text.trim() })} value={medicationItem.Name} placeholder={medicationItem.Name} />
        </View>
        <View style={styles.purposeSection}>
          <Text style={styles.textHeader}>Purpose of Medication</Text>
          <TextInput style={styles.inputBox} onChangeText={(text) => setMedicationItem({ ...medicationItem, Purpose: text.trim() })} value={medicationItem.Purpose} placeholder={medicationItem.Purpose} />
        </View>
        <View style={styles.intakeSection}>
          <Text style={styles.textHeader}>Tablets per Intake</Text>
          <Button
            title="-"
            onPress={() => {
              if (medicationItem.Instructions.TabletsPerIntake > 1) {
                setMedicationItem((prevState) => ({ ...prevState, Instructions: { ...prevState.Instructions, TabletsPerIntake: prevState.Instructions.TabletsPerIntake - 1 } }));
              } else {
                alert("Cannot be less than 1");
              }
            }}
          />
          <Text style={styles.textHeader}>{medicationItem.Instructions.TabletsPerIntake}</Text>
          <Button title="+" onPress={() => setMedicationItem((prevState) => ({ ...prevState, Instructions: { ...prevState.Instructions, TabletsPerIntake: prevState.Instructions.TabletsPerIntake + 1 } }))} />
        </View>
        <View style={styles.frequencySection}>
          <Text style={styles.textHeader}>Take this medication:</Text>
          <BouncyCheckbox
            text="Daily"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={medicationItem.Instructions.FrequencyPerDay === 1}
            onPress={() => setFrequencyPerIntake(1)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Twice a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={medicationItem.Instructions.FrequencyPerDay === 2}
            onPress={() => setFrequencyPerIntake(2)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Three times a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={medicationItem.Instructions.FrequencyPerDay === 3}
            onPress={() => setFrequencyPerIntake(3)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Four times a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={medicationItem.Instructions.FrequencyPerDay === 4}
            onPress={() => setFrequencyPerIntake(4)}
            disableBuiltInState={true}
          />
        </View>
        <View style={styles.nextSection}>
          <CustomButton
            title="Continue Editing"
            onPress={() => {
              if (handleSubmit()) {
                navigation.navigate("Edit Medication Schedule", { medicationItem });
              }
            }}
          />
        </View>
        <View style={styles.nextSection}>
          <TouchableOpacity
            onPress={() => {
              setIsDeletionPopUpVisible(true);
            }}
          >
            <Text style={styles.deleteBox}>DELETE MEDICATION</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={isDeletionPopUpVisible} transparent={true} animationType="slide">
          <SafeAreaView style={styles.popUpContainer}>
            <View style={styles.popUp}>
              <Text style={styles.header}>Are you sure that you want to delete </Text>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}> {medicationItem.Name}</Text>
              <Text style={styles.header}>from your medication list?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    deleteMedicationFromList(medicationItem);
                    setIsDeletionPopUpVisible(false);
                    navigation.navigate("Home");
                  }}
                  style={[styles.button, { backgroundColor: "green" }]}
                >
                  <Text>YES</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsDeletionPopUpVisible(false);
                  }}
                  style={[styles.button, { backgroundColor: "red" }]}
                >
                  <Text>NO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <BackNavBar navigation={navigation} title="Edit Medication Details" />
        <View style={styles.nameSection}>
          <Text style={styles.textHeader}>Name of Medication</Text>
          <TextInput style={styles.inputBox} onChangeText={(text) => setMedicationItem({ ...medicationItem, Name: text.trim() })} value={medicationItem.Name} placeholder={medicationItem.Name} />
        </View>
        <View style={styles.purposeSection}>
          <Text style={styles.textHeader}>Purpose of Medication</Text>
          <TextInput style={styles.inputBox} onChangeText={(text) => setMedicationItem({ ...medicationItem, Purpose: text.trim() })} value={medicationItem.Purpose} placeholder={medicationItem.Purpose} />
        </View>
        <View style={styles.intakeSection}>
          <Text style={styles.textHeader}>Volume per Intake (in ml)</Text>
          <TextInput style={styles.volumeBox} keyboardType="decimal-pad" onChangeText={(text) => setVolume(text)} value={volume} placeholder={volume} />
        </View>
        <View style={styles.frequencySection}>
          <Text style={styles.textHeader}>Take this medication:</Text>
          <BouncyCheckbox
            text="Daily"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={medicationItem.Instructions.FrequencyPerDay === 1}
            onPress={() => setFrequencyPerIntake(1)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Twice a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={medicationItem.Instructions.FrequencyPerDay === 2}
            onPress={() => setFrequencyPerIntake(2)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Three times a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={medicationItem.Instructions.FrequencyPerDay === 3}
            onPress={() => setFrequencyPerIntake(3)}
            disableBuiltInState={true}
          />
          <BouncyCheckbox
            text="Four times a day"
            textStyle={{
              textDecorationLine: "none",
            }}
            style={styles.frequencyItem}
            isChecked={medicationItem.Instructions.FrequencyPerDay === 4}
            onPress={() => setFrequencyPerIntake(4)}
            disableBuiltInState={true}
          />
        </View>
        <View style={styles.nextSection}>
          <CustomButton
            title="Continue Editing"
            onPress={() => {
              const newItem = setVolumePerIntake();
              if (handleSubmit()) {
                navigation.navigate("Edit Medication Schedule", { medicationItem: newItem });
              }
            }}
          />
        </View>
        <View style={styles.nextSection}>
          <TouchableOpacity
            onPress={() => {
              setIsDeletionPopUpVisible(true);
            }}
          >
            <Text style={styles.deleteBox}>DELETE MEDICATION</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={isDeletionPopUpVisible} transparent={true} animationType="slide">
          <SafeAreaView style={styles.popUpContainer}>
            <View style={styles.popUp}>
              <Text style={styles.header}>Are you sure that you want to delete </Text>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}> {medicationItem.Name}</Text>
              <Text style={styles.header}>from your medication list?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    deleteMedicationFromList(medicationItem);
                    setIsDeletionPopUpVisible(false);
                    navigation.navigate("Home");
                  }}
                  style={[styles.button, { backgroundColor: "green" }]}
                >
                  <Text>YES</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsDeletionPopUpVisible(false);
                  }}
                  style={[styles.button, { backgroundColor: "red" }]}
                >
                  <Text>NO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
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
  deleteBox: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderColor: "red",
    color: "red",
  },
  nextPage: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderColor: "black",
    color: "black",
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
  popUpContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
  },
  popUp: {
    backgroundColor: "white",
    width: "80%",
    height: "30%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  header: {
    fontSize: 16,
  },
  button: {
    color: "black",
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "black",
    width: 80,
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
    fontSize: 18,
    borderRadius: 40,
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
  },
});
