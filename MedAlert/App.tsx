import { StyleSheet, Text, View, ActivityIndicator, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import HomeScreen from "./pages/HomeScreen";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddMedicationType from "./pages/AddMedicationType";
import AddMedicationDetails from "./pages/AddMedicationDetails";
import AddMedicationSchedule from "./pages/AddMedicationSchedule";
import MenuPage from "./pages/MenuPage";
import UpdateAccountPage from "./pages/UpdateAccountPage";
import { UserInformation, MedicationItem, ScheduledItem } from "./utils/types";
import { collection, addDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestorage } from "./firebaseConfig";
import { auth, signUp } from "./Auth";
import { userDataConverter } from "./converters/userDataConverter";
import { medDataConverter } from "./converters/medDataConverter";
import EditMedicationDetails from "./pages/EditMedicationDetails";
import EditMedicationSchedule from "./pages/EditMedicationSchedule";
import LoginPage from "./pages/LoginPage";
import SignUpHomePage from "./pages/SignUpHomePage";
import SignUpDetailsPage from "./pages/SignUpDetailsPage";
import ViewMedicationPage from "./pages/ViewMedicationPage";
import { DocumentReference } from "firebase/firestore";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";

const Stack = createNativeStackNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
interface NotificationItem {
  content: {
    title: string;
    body: string;
  };
  trigger: { seconds: number };
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export default function App() {
  const [userInformation, setUserInformation] = useState<UserInformation>({
    Name: "",
    Gender: "",
    DateOfBirth: "",
    EmailAddress: "",
    PhoneNumber: "",
    ProfilePicture: "",
  });
  const [allMedicationItems, setAllMedicationItems] = useState<MedicationItem[]>([]);
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState("");
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const medInfoRef = useRef<DocumentReference>();
  const userInfoRef = useRef<DocumentReference>();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const medInfoQuerySnapshot = await getDoc(medInfoRef.current.withConverter(medDataConverter));
      const userQuerySnapshot = await getDoc(userInfoRef.current.withConverter(userDataConverter));
      const medInfoData = medInfoQuerySnapshot.data();
      const userInfoData = userQuerySnapshot.data();
      setUserInformation(userInfoData);
      setAllMedicationItems(medInfoData.MedicationItems);
      setScheduledItems(medInfoData.ScheduledItems);
      console.log("Data fetched successfully");
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    signOutAllUsers();
  }, []);

  const signOutAllUsers = () => {
    auth
      .signOut()
      .then(() => {
        setUserId("");
        setIsSignUpComplete(false);
        setUserInformation({
          Name: "",
          Gender: "",
          DateOfBirth: "",
          EmailAddress: "",
          PhoneNumber: "",
          ProfilePicture: "",
        });
        setAllMedicationItems([]);
        setScheduledItems([]);
        console.log("Successfully signed out");
      })
      .catch((error) => {
        console.log("Error signing out:", error);
      });
  };

  useEffect(() => {
    if (userId && isSignUpComplete) {
      medInfoRef.current = doc(firestorage, "MedicationInformation", userId);
      userInfoRef.current = doc(firestorage, "UsersData", userId);
      fetchData();
      registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

      notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
        setNotification(true);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
      Notifications.cancelAllScheduledNotificationsAsync();
      scheduleNotifications();
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [userId, isSignUpComplete]);

  const handleLogin = (userId) => {
    setUserId(userId);
    setIsSignUpComplete(true);
    console.log("changing");
  };

  const handleSignUp = (userId) => {
    setUserId(userId);
  };

  const updateUserInformation = async (updatedUserData: UserInformation) => {
    try {
      setUserInformation(updatedUserData);
      await updateDoc(userInfoRef.current, { ...updatedUserData });
      console.log("User information updated to Firestore successfully");
    } catch (error) {
      console.error("Error adding user information to Firestore:", error);
    }
  };

  const setEdit = async (medicationItem) => {
    var newAllMedicationItems = [...allMedicationItems];
    for (var i = 0; i < newAllMedicationItems.length; i++) {
      if (newAllMedicationItems[i].Name == medicationItem.Name) {
        newAllMedicationItems[i] = medicationItem;
      }
    }
    await updateDoc(medInfoRef.current, { MedicationItems: newAllMedicationItems, ScheduledItems: getScheduledItems(newAllMedicationItems) })
      .then((docRef) => {
        console.log("Data changed successfully.");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
    fetchData();
  };

  const deleteMedicationFromList = async (medicationItem) => {
    var newAllMedicationItems = [...allMedicationItems];
    for (var i = 0; i < newAllMedicationItems.length; i++) {
      if (newAllMedicationItems[i].Name == medicationItem.Name) {
        newAllMedicationItems.splice(i, 1);
      }
    }
    await updateDoc(medInfoRef.current, { MedicationItems: newAllMedicationItems, ScheduledItems: getScheduledItems(newAllMedicationItems) })
      .then((docRef) => {
        console.log("Data changed successfully.");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
    fetchData();
  };

  async function scheduleNotifications() {
    console.log("Setting notifications");
    const currentDate = new Date();
    const currentTimePastMidnight = currentDate.getHours() * 60 * 60 + currentDate.getMinutes() * 60 + currentDate.getSeconds();
    for (let i = 0; i < scheduledItems.length; i++) {
      if (scheduledItems[i].Acknowledged === false) {
        const triggerTime = scheduledItems[i].Instructions.FirstDosageTiming * 60 - currentTimePastMidnight;
        if (triggerTime > 0) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Medication Reminder",
              body: "Please take " + scheduledItems[i].Name,
            },
            trigger: { seconds: triggerTime },
          });
        }
      }
    }
  }

  function setAcknowledged(id: number) {
    var newScheduledItems = [...scheduledItems];
    for (let i = 0; i < newScheduledItems.length; i++) {
      if (newScheduledItems[i].id === id) {
        newScheduledItems[i].Acknowledged = true;
      }
    }
    setScheduledItems(newScheduledItems);
    // Update firebase
    updateDoc(medInfoRef.current, { ScheduledItems: newScheduledItems });
  }

  function getScheduledItems(allMedicationItems) {
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
      await updateDoc(medInfoRef.current, {
        MedicationItems: newMedicationItems,
        ScheduledItems: newScheduledItems,
      });
      console.log("Medication added successfully.");
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isSignUpComplete) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginPage {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen name="Sign Up Home" options={{ headerShown: false }}>
            {(props) => <SignUpHomePage {...props} onSignUp={handleSignUp} />}
          </Stack.Screen>
          <Stack.Screen name="Sign Up Details" options={{ headerShown: false }}>
            {(props) => <SignUpDetailsPage {...props} setIsSignUpComplete={setIsSignUpComplete} />}
          </Stack.Screen>
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => <HomeScreen {...props} scheduledItems={scheduledItems} setAcknowledged={setAcknowledged} userName={userInformation.Name} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => <LoginPage {...props} onLogin={handleLogin} />}
        </Stack.Screen>
        <Stack.Screen name="Sign Up Home" options={{ headerShown: false }}>
          {(props) => <SignUpHomePage {...props} onSignUp={handleSignUp} />}
        </Stack.Screen>
        <Stack.Screen name="Sign Up Details" options={{ headerShown: false }}>
          {(props) => <SignUpDetailsPage {...props} setIsSignUpComplete={setIsSignUpComplete} />}
        </Stack.Screen>
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
          {(props) => <MenuPage {...props} userInformation={userInformation} />}
        </Stack.Screen>
        <Stack.Screen name="Update Account" options={{ headerShown: false }}>
          {(props) => <UpdateAccountPage {...props} userInformation={userInformation} updateUserInformation={updateUserInformation} />}
        </Stack.Screen>
        <Stack.Screen name="Edit Medication Details" options={{ headerShown: false }}>
          {(props) => <EditMedicationDetails {...props} allMedicationItems={allMedicationItems} deleteMedicationFromList={deleteMedicationFromList} />}
        </Stack.Screen>
        <Stack.Screen name="Edit Medication Schedule" options={{ headerShown: false }}>
          {(props) => <EditMedicationSchedule {...props} allMedicationItems={allMedicationItems} setEdit={setEdit} />}
        </Stack.Screen>
        <Stack.Screen name="View All Medications" options={{ headerShown: false }}>
          {(props) => <ViewMedicationPage {...props} allMedicationItems={allMedicationItems} />}
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
