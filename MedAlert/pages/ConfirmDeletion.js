import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, TextInput, Button } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";

export default function ConfirmDeletion({ navigation, route, deleteMedicationFromList }) {
  const [medicationItem, setMedicationItem] = useState({...route.params.medicationItem})

  return (
    <SafeAreaView style={styles.container}>
      <View style = {styles.container}>
        {/* <BackNavBar navigation={navigation} title="Confirm Deletion"/> */}
        <Text></Text>
        <Text style = {styles.header}>Are you sure that you want to delete </Text>
        <Text style = {{ fontWeight: "bold", fontSize: 20}}> {medicationItem.Name}</Text>
        <Text style = {styles.header}>from your medication list?</Text>
        <Text></Text>
        <View style = {styles.buttons}>
          <TouchableOpacity 
            onPress={() => {
              deleteMedicationFromList(medicationItem);
              navigation.navigate("Home");
            }}>
            <Text style = {{color: "darkgreen", fontWeight: "bold", paddingRight: 40}}>YES</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Home");
            }}>
            <Text style = {{color: "darkred", fontWeight: "bold", paddingLeft: 40}}>NO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttons :{
    flexDirection: "row",
  }, 
  header: {
    fontSize: 16,
  }
})