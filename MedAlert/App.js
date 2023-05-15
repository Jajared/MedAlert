import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import HomeScreen from "./pages/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddMedicationType from "./pages/AddMedicationType";
import AddMedicationDetails from "./pages/AddMedicationDetails";
import AddMedicationSchedule from "./pages/AddMedicationSchedule";
import ProfilePage from "./pages/ProfilePage";
import UpdateAccountPage from "./pages/UpdateAccountPage";

const Stack = createNativeStackNavigator();
export default function App() {
  const [userInformation, setUserInformation] = useState({ Username: "Jane", Gender: "Male", DateOfBirth: "29/05/2001", EmailAddress: "test@gmail.com", PhoneNumber: "9123456", ProfileImage: "./assets/jamal.png", Preferences: {} })
  const [allMedicationItems, setAllMedicationItems] = useState([
    { Name: "Paracetamol", Type: "Pill", Purpose: "Fever", Instructions: { TabletsPerIntake: 2, FrequencyPerDay: 4, Specifications: "No specific instructions", FirstDosageTiming: 540 } },
    { Name: "Metophan", Type: "Liquid", Purpose: "Cough", Instructions: { TabletsPerIntake: 4, FrequencyPerDay: 4, Specifications: "No specific instructions", FirstDosageTiming: 540 } },
  ]);

  const scheduledItems = [];
  const scheduledItemsInOrder = [];
  for (let i = 0; i < allMedicationItems.length; i++) {
    const timeInterval = 24 / allMedicationItems[i].Instructions.FrequencyPerDay;
    for (let j = 0; j < allMedicationItems[i].Instructions.FrequencyPerDay; j++) {
      scheduledItems.push({
        Name: allMedicationItems[i].Name,
        Type: allMedicationItems[i].Type,
        Purpose: allMedicationItems[i].Purpose,
        Instructions: {
          TabletsPerIntake: allMedicationItems[i].Instructions.TabletsPerIntake,
          FrequencyPerDay: allMedicationItems[i].Instructions.FrequencyPerDay,
          Specifications: allMedicationItems[i].Instructions.Specifications,
          FirstDosageTiming: allMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j > 24 * 60 ? allMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j - 24 * 60 : allMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j,
        },
      });
    }
  }

  var lowestTime = 24 * 60;
  var prevLowest = -1;
  while (scheduledItems.length != scheduledItemsInOrder.length) {
    for (let i = 0; i < scheduledItems.length; i++) {
      if (scheduledItems[i].Instructions.FirstDosageTiming < lowestTime && scheduledItems[i].Instructions.FirstDosageTiming > prevLowest) {
        lowestTime = scheduledItems[i].Instructions.FirstDosageTiming;
      }

      if (i == scheduledItems.length - 1) {
        prevLowest = lowestTime;
        for (let j = 0; j < scheduledItems.length; j++) {
          if (scheduledItems[j].Instructions.FirstDosageTiming == lowestTime) {
            scheduledItemsInOrder.push(scheduledItems[j]);
          }
        }
        lowestTime = 24 * 60;
      }
    }
  }

  function addMedication(medicationData) {
    setAllMedicationItems((prevState) => [...prevState, medicationData]);
  }

  function deleteMedication(medicationData) {
    setAllMedicationItems((prevState) => prevState.filter(medicationData));
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => <HomeScreen {...props} props={{ allMedicationItems: scheduledItemsInOrder }} />}
        </Stack.Screen>
        <Stack.Screen name="Add Medication Type" options={{ headerShown: false }}>
          {(props) => <AddMedicationType {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Add Medication Details" options={{ headerShown: false }}>
          {(props) => <AddMedicationDetails {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Add Medication Schedule" options={{ headerShown: false }}>
          {(props) => <AddMedicationSchedule {...props} addMedication={addMedication} />}
        </Stack.Screen>
        <Stack.Screen name="Profile Page" options={{ headerShown: false }}>
          {(props) => <ProfilePage {...props} userInformation={userInformation} />}
        </Stack.Screen>
        <Stack.Screen name="Update Account" options={{ headerShown: false }}>
          {(props) => <UpdateAccountPage {...props} userInformation={userInformation} setUserInformation={setUserInformation}/>}
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
