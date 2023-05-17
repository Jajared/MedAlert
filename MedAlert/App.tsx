import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import HomeScreen from "./pages/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddMedicationType from "./pages/AddMedicationType";
import AddMedicationDetails from "./pages/AddMedicationDetails";
import AddMedicationSchedule from "./pages/AddMedicationSchedule";
import ProfilePage from "./pages/ProfilePage";
import UpdateAccountPage from "./pages/UpdateAccountPage";
import { UserInformation, MedicationItem, ScheduledItem } from "./utils/types";
import { collection, addDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import { signUp } from "./Auth";
import { userDataConverter } from "./converters/userDataConverter";
import { medDataConverter } from "./converters/medDataConverter";
import { storage } from "./firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Stack = createNativeStackNavigator();
const testID = "cLNeJdkRJkfEzLMugJipcamAWwb2";

export default function App() {
  const [userInformation, setUserInformation] = useState<UserInformation>();
  const [allMedicationItems, setAllMedicationItems] = useState<MedicationItem[]>([]);
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const medInfoRef = doc(firestore, "MedicationInformation", testID);
  const userInfoRef = doc(firestore, "UsersData", testID);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const medInfoQuerySnapshot = await getDoc(medInfoRef.withConverter(medDataConverter));
        const userQuerySnapshot = await getDoc(userInfoRef.withConverter(userDataConverter));
        const medInfoData = medInfoQuerySnapshot.data();
        const userInfoData = userQuerySnapshot.data();
        setUserInformation(userInfoData);
        setAllMedicationItems(medInfoData.MedicationItems);
        setScheduledItems(medInfoData.ScheduledItems);
        setIsLoading(false);
        console.log("Data fetched successfully");
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // initialiseData();
  function initialiseData() {
    const userLoginCredentials = {
      email: "test@gmail.com",
      password: "JaJaWong1",
    };
    // signUp(userLoginCredentials.email, userLoginCredentials.password);
    const userData = {
      Name: "Jane",
      Gender: "Male",
      DateOfBirth: "29/05/2001",
      EmailAddress: "test@gmail.com",
      PhoneNumber: "9123456",
    };
    const usersDataRef = doc(collection(firestore, "UsersData"), testID);
    setDoc(usersDataRef, userData)
      .then((docRef) => {
        console.log("Data pushed successfully.");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
    const medicationInformation = {
      MedicationItems: [
        { Name: "Paracetamol", Type: "Pill", Purpose: "Fever", Instructions: { TabletsPerIntake: 2, FrequencyPerDay: 2, Specifications: "No specific instructions", FirstDosageTiming: 540 } },
        { Name: "Metophan", Type: "Liquid", Purpose: "Cough", Instructions: { TabletsPerIntake: 4, FrequencyPerDay: 2, Specifications: "No specific instructions", FirstDosageTiming: 540 } },
      ],
      ScheduledItems: [
        { Acknowledged: false, Instructions: { FirstDosageTiming: 540, FrequencyPerDay: 2, Specifications: "No specific instructions", TabletsPerIntake: 2 }, Name: "Paracetamol", Purpose: "Fever", Type: "Pill", id: 1 },
        { Acknowledged: false, Instructions: { FirstDosageTiming: 540, FrequencyPerDay: 2, Specifications: "No specific instructions", TabletsPerIntake: 4 }, Name: "Metophan", Purpose: "Cough", Type: "Liquid", id: 3 },
        { Acknowledged: false, Instructions: { FirstDosageTiming: 1260, FrequencyPerDay: 2, Specifications: "No specific instructions", TabletsPerIntake: 2 }, Name: "Paracetamol", Purpose: "Fever", Type: "Pill", id: 2 },
        { Acknowledged: false, Instructions: { FirstDosageTiming: 1260, FrequencyPerDay: 2, Specifications: "No specific instructions", TabletsPerIntake: 4 }, Name: "Metophan", Purpose: "Cough", Type: "Liquid", id: 4 },
      ],
    };
    const medInfoRef = doc(collection(firestore, "MedicationInformation"), testID);
    setDoc(medInfoRef, medicationInformation)
      .then((docRef) => {
        console.log("Data pushed successfully.");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
  }

  const uploadProfilePicture = async (userId, filePath) => {
    function filePathToBlob(filePath) {
      return fetch(filePath)
        .then((response) => response.blob())
        .then((blob) => blob);
    }
    const storageRef = ref(storage, `profilePictures/${userId}`);

    try {
      const file = await filePathToBlob(filePath);
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);

      // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      console.log(downloadURL);
      // 3. Storing the Download URL in Firestore
      // const userDocRef = doc(firestore, "users", userId);
      // await setDoc(userDocRef, { profilePictureURL: downloadURL }, { merge: true });

      console.log("Profile picture uploaded successfully.");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  // uploadProfilePicture(testID, "/Users/hungryjared/Desktop/NUS/Projects/Orbital/MedAlert/assets/jamal.png");

  const updateUserInformation = async (updatedUserData: UserInformation) => {
    try {
      setUserInformation(updatedUserData);
      await updateDoc(userInfoRef, { ...updatedUserData });
      console.log("User information updated to Firestore successfully");
    } catch (error) {
      console.error("Error adding user information to Firestore:", error);
    }
  };

  function setAcknowledged(id: number) {
    var newScheduledItems = [...scheduledItems];
    for (let i = 0; i < newScheduledItems.length; i++) {
      if (newScheduledItems[i].id === id) {
        newScheduledItems[i].Acknowledged = true;
      }
    }
    setScheduledItems(newScheduledItems);
    // Update firebase
    updateDoc(medInfoRef, { ScheduledItems: newScheduledItems });
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

  const addMedication = async (medicationData: MedicationItem) => {
    try {
      const newScheduledItems = sortScheduledItems([...scheduledItems, ...JSON.parse(JSON.stringify(getNewScheduledItems(medicationData)))]);
      const newMedicationItems = [...allMedicationItems, medicationData];
      setScheduledItems(newScheduledItems);
      setAllMedicationItems(newMedicationItems);
      // Update firebase
      await updateDoc(medInfoRef, {
        MedicationItems: newMedicationItems,
        ScheduledItems: newScheduledItems,
      });
      console.log("Medication added successfully.");
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  // Function wrong
  function deleteMedication(medicationData) {
    setAllMedicationItems((prevState) => prevState.filter(medicationData));
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => <HomeScreen {...props} scheduledItems={scheduledItems} setAcknowledged={setAcknowledged} userName={userInformation.Name} />}
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
          {(props) => <UpdateAccountPage {...props} userInformation={userInformation} updateUserInformation={updateUserInformation} />}
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
