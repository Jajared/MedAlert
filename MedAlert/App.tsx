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
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, query, doc, getDoc, getDocs } from "firebase/firestore";

const Stack = createNativeStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyA630mEkGs-Zq9cMkIVWs9rfrLEZGOIKic",
  authDomain: "medalert-386812.firebaseapp.com",
  projectId: "medalert-386812",
  storageBucket: "medalert-386812.appspot.com",
  messagingSenderId: "435459398641",
  appId: "1:435459398641:web:c640e32a44f0e4cb598250",
  measurementId: "G-ZL35VZP8EM",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

interface UserInformation {
  Name: string;
  Gender: string;
  DateOfBirth: string;
  EmailAddress: string;
  PhoneNumber: string;
}

interface ScheduledItem extends MedicationItem {
  Acknowledged: boolean;
  id: number;
}

interface MedicationItem {
  Name: string;
  Type: string;
  Purpose: string;
  Instructions: {
    TabletsPerIntake: number;
    FrequencyPerDay: number;
    Specifications: string;
    FirstDosageTiming: number;
  };
}

export default function App() {
  const [userInformation, setUserInformation] = useState<UserInformation>();
  const [allMedicationItems, setAllMedicationItems] = useState<MedicationItem[]>([]);
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Users"));
        const documents = querySnapshot.docs.map((doc) => doc.data());
        setUserInformation(documents[0].UserInfo);
        setAllMedicationItems(documents[0].MedicationItems);
        setScheduledItems(Array.from(getScheduledItems()));
        console.log("Data fetched successfully");
      } catch (error) {}
    };

    fetchData();
  }, []);

  // initialiseData();
  function initialiseData() {
    const userData = {
      UserInfo: {
        Name: "Jane",
        Gender: "Male",
        DateOfBirth: "29/05/2001",
        EmailAddress: "test@gmail.com",
        PhoneNumber: "9123456",
      },
      MedicationItems: [
        { Name: "Paracetamol", Type: "Pill", Purpose: "Fever", Instructions: { TabletsPerIntake: 2, FrequencyPerDay: 2, Specifications: "No specific instructions", FirstDosageTiming: 540 } },
        { Name: "Metophan", Type: "Liquid", Purpose: "Cough", Instructions: { TabletsPerIntake: 4, FrequencyPerDay: 2, Specifications: "No specific instructions", FirstDosageTiming: 540 } },
      ],
    };

    const usersRef = collection(firestore, "Users");
    addDoc(usersRef, userData)
      .then((docRef) => {
        console.log("Data pushed successfully. Document ID:", docRef.id);
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
  }

  function setAcknowledged(id: number) {
    var temp = [...scheduledItems];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].id === id) {
        temp[i].Acknowledged = true;
      }
    }
    setScheduledItems(temp);
  }
  function getScheduledItems() {
    var temp = [];
    var count = 1;
    for (let i = 0; i < allMedicationItems.length; i++) {
      const timeInterval = 24 / allMedicationItems[i].Instructions.FrequencyPerDay;
      for (let j = 0; j < allMedicationItems[i].Instructions.FrequencyPerDay; j++) {
        temp.push({
          ...allMedicationItems[i],
          Acknowledged: false,
          id: count,
          Instructions: {
            ...allMedicationItems[i].Instructions,
            FirstDosageTiming: allMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j > 24 * 60 ? allMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j - 24 * 60 : allMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j,
          },
        });
        count++;
      }
    }
    var result = sortScheduledItems(temp);
    return result;
  }

  function getNewScheduledItems(medicationData: MedicationItem) {
    var count = scheduledItems.length + 1;
    var temp = [];
    const timeInterval = 24 / medicationData.Instructions.FrequencyPerDay;
    for (let j = 0; j < medicationData.Instructions.FrequencyPerDay; j++) {
      temp.push({
        ...medicationData,
        Acknowledged: false,
        id: count,
        Instructions: {
          ...medicationData.Instructions,
          FirstDosageTiming: medicationData.Instructions.FirstDosageTiming + timeInterval * 60 * j > 24 * 60 ? medicationData.Instructions.FirstDosageTiming + timeInterval * 60 * j - 24 * 60 : medicationData.Instructions.FirstDosageTiming + timeInterval * 60 * j,
        },
      });
      count++;
    }
    return temp;
  }
  function sortScheduledItems(data: ScheduledItem[]) {
    var scheduledItemsInOrder = [];
    var lowestTime = 24 * 60;
    var prevLowest = -1;
    while (data.length != scheduledItemsInOrder.length) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].Instructions.FirstDosageTiming < lowestTime && data[i].Instructions.FirstDosageTiming > prevLowest) {
          lowestTime = data[i].Instructions.FirstDosageTiming;
        }

        if (i == data.length - 1) {
          prevLowest = lowestTime;
          for (let j = 0; j < data.length; j++) {
            if (data[j].Instructions.FirstDosageTiming == lowestTime) {
              scheduledItemsInOrder.push(data[j]);
            }
          }
          lowestTime = 24 * 60;
        }
      }
    }
    return scheduledItemsInOrder;
  }

  function addMedication(medicationData: MedicationItem) {
    setScheduledItems(sortScheduledItems([...scheduledItems, ...JSON.parse(JSON.stringify(getNewScheduledItems(medicationData)))]));
    setAllMedicationItems((prevState) => [...prevState, medicationData]);
  }

  // Function wrong
  function deleteMedication(medicationData) {
    setAllMedicationItems((prevState) => prevState.filter(medicationData));
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => <HomeScreen {...props} props={{ allMedicationItems: scheduledItems }} setAcknowledged={setAcknowledged} />}
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
          {(props) => <UpdateAccountPage {...props} userInformation={userInformation} setUserInformation={setUserInformation} />}
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
