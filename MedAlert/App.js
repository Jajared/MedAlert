import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import HomeScreen from "./pages/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddMedicationType from "./pages/AddMedicationType";
import AddMedicationDetails from "./pages/AddMedicationDetails";

const Stack = createNativeStackNavigator();
export default function App() {
  const [allMedicationItems, setAllMedicationItems] = useState([
    { Name: "Paracetamol", Type: "Pill", Purpose: "Fever", Instructions: { TabletsPerIntake: 2, FrequencyPerDay: 4, Specifications: "No specific instructions", FirstDosageTiming: 540 } },
    { Name: "Metophan", Type: "Liquid", Purpose: "Cough", Instructions: { TabletsPerIntake: 4, FrequencyPerDay: 4, Specifications: "No specific instructions", FirstDosageTiming: 540 } },
  ]);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => <HomeScreen {...props} props={{ allMedicationItems: allMedicationItems }} />}
        </Stack.Screen>
        <Stack.Screen name="Add Medication Type" options={{ headerShown: false }}>
          {(props) => <AddMedicationType {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Add Medication Details" options={{ headerShown: false }}>
          {(props) => <AddMedicationDetails {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
