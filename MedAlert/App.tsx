import { StyleSheet, View, ActivityIndicator, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import HomeScreen from "./pages/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddMedicationType from "./pages/AddMedicationType";
import AddMedicationDetails from "./pages/AddMedicationDetails";
import AddMedicationSchedule from "./pages/AddMedicationSchedule";
import MenuPage from "./pages/MenuPage";
import UpdateAccountPage from "./pages/UpdateAccountPage";
import { UserInformation, MedicationItem, ScheduledItem, NotificationItem } from "./utils/types";
import { collection, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import { firestorage } from "./firebaseConfig";
import { auth } from "./firebaseConfig";
import { userDataConverter } from "./converters/userDataConverter";
import { medDataConverter } from "./converters/medDataConverter";
import EditMedicationDetails from "./pages/EditMedicationDetails";
import EditMedicationSchedule from "./pages/EditMedicationSchedule";
import MedicationDatabase from "./pages/MedicationDatabase";
import LoginPage from "./pages/LoginPage";
import SignUpHomePage from "./pages/SignUpHomePage";
import SignUpDetailsPage from "./pages/SignUpDetailsPage";
import ViewMedicationPage from "./pages/ViewMedicationPage";
import { DocumentReference } from "firebase/firestore";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const Stack = createNativeStackNavigator();

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

const RESET_SCHEDULE_TASK = "RESET_SCHEDULE_TASK";

TaskManager.defineTask(RESET_SCHEDULE_TASK, async () => {
  try {
    resetScheduledItems();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log("Error resetting acknowledged field:", error);
  }
});

const scheduleTaskAtMidnight = async () => {
  const status = await BackgroundFetch.getStatusAsync();

  await BackgroundFetch.registerTaskAsync(RESET_SCHEDULE_TASK, {
    minimumInterval: 60 * 15, // Run once every 24 hours
  });

  console.log("Task scheduled at midnight");
};

async function resetScheduledItems() {
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
  // Sort scheduled items in order of time
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
  const scheduledItemsRef = collection(firestorage, "MedicationInformation");
  const querySnapshot = await getDocs(scheduledItemsRef);

  querySnapshot.forEach((doc) => {
    const medicationItems = doc.data().MedicationItems;
    updateDoc(doc.ref, { ScheduledItems: getScheduledItems(medicationItems) });
  });

  console.log("Acknowledged field reset successfully.");
}

scheduleTaskAtMidnight();
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState("");
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const medInfoRef = useRef<DocumentReference>();
  const userInfoRef = useRef<DocumentReference>();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();
  const [isNotificationReset, setIsNotificationReset] = useState(false);
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);

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

  /** useEffect(() => {
    fetchData();
    setIsNotificationReset(false);
  }, [isNotificationReset]); */

  useEffect(() => {
    checkUserAuthState();
  }, []);
  /** useEffect(() => {
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
  }; */

  useEffect(() => {
    if (userId && isSignUpComplete) {
      medInfoRef.current = doc(firestorage, "MedicationInformation", userId);
      userInfoRef.current = doc(firestorage, "UsersData", userId);
      registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

      // Foreground notification
      notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
        setNotification(true);
      });

      // When user interacts with notification
      responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
      fetchData().then(() => {
        // Resets all notifications
        Notifications.cancelAllScheduledNotificationsAsync().then((response) => {
          console.log("Resetting all notifications");
          scheduleAllNotifications(scheduledItems);
        });
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [userId, isSignUpComplete]);

  // Sign up handler
  const handleSignUpHome = (userId: string) => {
    setUserId(userId);
  };

  // Login handler
  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUserId(user.uid);
      medInfoRef.current = doc(firestorage, "MedicationInformation", user.uid);
      userInfoRef.current = doc(firestorage, "UsersData", user.uid);
      await fetchData();
      setUserLoggedIn(true);
      console.log("Successfully logged in");
      return true;
    } catch (error) {
      console.log("Error logging in:", error);
      return false;
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      signOut(auth).then(() => {
        setUserLoggedIn(false);
        setUserId("");
        console.log("Successfully signed out");
      });
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  const checkUserAuthState = async () => {
    console.log("Checking if user is logged in...");
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
          setUserLoggedIn(true);
          console.log("User is logged in");
        } else {
          console.log("No user token found");
        }
      });
    } catch (error) {
      console.log("Error checking user auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user information on database
  const updateUserInformation = async (updatedUserData: UserInformation) => {
    try {
      setUserInformation(updatedUserData);
      await updateDoc(userInfoRef.current, { ...updatedUserData });
      console.log("User information updated to Firestore successfully");
    } catch (error) {
      console.error("Error adding user information to Firestore:", error);
    }
  };

  // Edit medication item and updates database
  const setEdit = async (medicationItem) => {
    var newAllMedicationItems = [...allMedicationItems];
    for (var i = 0; i < newAllMedicationItems.length; i++) {
      if (newAllMedicationItems[i].Name == medicationItem.Name) {
        newAllMedicationItems[i] = medicationItem;
      }
    }
    const newScheduledItems = await editScheduledItems(newAllMedicationItems);
    await updateDoc(medInfoRef.current, { MedicationItems: newAllMedicationItems, ScheduledItems: newScheduledItems })
      .then((docRef) => {
        console.log("Data changed successfully.");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
    fetchData();
  };

  // Deletes medication item from list and updates database
  const deleteMedicationFromList = async (medicationItem: MedicationItem) => {
    var newAllMedicationItems = [...allMedicationItems];
    for (var i = 0; i < newAllMedicationItems.length; i++) {
      if (newAllMedicationItems[i].Name == medicationItem.Name) {
        newAllMedicationItems.splice(i, 1);
      }
    }
    const newScheduledItems = await editScheduledItems(newAllMedicationItems);
    await updateDoc(medInfoRef.current, { MedicationItems: newAllMedicationItems, ScheduledItems: newScheduledItems })
      .then((docRef) => {
        console.log("Data changed successfully.");
      })
      .catch((error) => {
        console.error("Error pushing data:", error);
      });
    fetchData();
  };

  // Edit scheduled items and notifications after edit/delete operations on MedicationItems
  async function editScheduledItems(newAllMedicationItems: MedicationItem[]) {
    var temp = [];
    var count = 1;
    Notifications.cancelAllScheduledNotificationsAsync().then((response) => {
      console.log("Resetting all notifications");
    });
    for (let i = 0; i < newAllMedicationItems.length; i++) {
      const timeInterval = 24 / newAllMedicationItems[i].Instructions.FrequencyPerDay;
      for (let j = 0; j < newAllMedicationItems[i].Instructions.FrequencyPerDay; j++) {
        const newScheduledItem: ScheduledItem = {
          ...newAllMedicationItems[i],
          Acknowledged: false,
          id: count,
          notificationId: "",
          Instructions: {
            ...newAllMedicationItems[i].Instructions,
            FirstDosageTiming: newAllMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j > 24 * 60 ? newAllMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j - 24 * 60 : newAllMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j,
          },
        };
        const scheduledItem = await scheduleNotificationItem(newScheduledItem);
        temp.push(scheduledItem);
        count++;
      }
    }
    var result = sortScheduledItems(temp);
    return result;
  }

  // Schedules all notifications on system
  async function scheduleAllNotifications(scheduledItems: ScheduledItem[]) {
    console.log("Setting all notifications");
    for (let i = 0; i < scheduledItems.length; i++) {
      var hours = Math.floor(scheduledItems[i].Instructions.FirstDosageTiming / 60);
      if (hours == 24) {
        hours = 0;
      }
      const minutes = scheduledItems[i].Instructions.FirstDosageTiming % 60;
      const newNotificationItem: NotificationItem = {
        content: {
          title: "Medication Reminder",
          body: "Please take " + scheduledItems[i].Name,
        },
        trigger: { hour: hours, minute: minutes, repeats: true },
      };
      const notificationId = await Notifications.scheduleNotificationAsync(newNotificationItem);
      scheduledItems[i].notificationId = notificationId;
    }
  }

  // Scheduled individual notification on system
  async function scheduleNotificationItem(scheduledItem: ScheduledItem) {
    console.log("Setting notifications");
    var hours = Math.floor(scheduledItem.Instructions.FirstDosageTiming / 60);
    if (hours == 24) {
      hours = 0;
    }
    const minutes = scheduledItem.Instructions.FirstDosageTiming % 60;
    const newNotificationItem: NotificationItem = {
      content: {
        title: "Medication Reminder",
        body: "Please take " + scheduledItem.Name,
      },
      trigger: { hour: hours, minute: minutes, repeats: true },
    };
    const notificationId = await Notifications.scheduleNotificationAsync(newNotificationItem);
    scheduledItem.notificationId = notificationId;
    return scheduledItem;
  }

  // Acknowledge notification
  function setAcknowledged(id: number) {
    var newScheduledItems = [...scheduledItems];
    for (let i = 0; i < newScheduledItems.length; i++) {
      if (newScheduledItems[i].id === id) {
        newScheduledItems[i].Acknowledged = true;
      }
    }
    setScheduledItems(newScheduledItems);
    updateDoc(medInfoRef.current, { ScheduledItems: newScheduledItems });
  }

  // Get new scheduled items after adding new medication item
  async function getNewScheduledItems(medicationData: MedicationItem) {
    var count = scheduledItems.length + 1;
    var temp: ScheduledItem[] = [];
    const timeInterval = 24 / medicationData.Instructions.FrequencyPerDay;
    for (let j = 0; j < medicationData.Instructions.FrequencyPerDay; j++) {
      const newScheduledItem: ScheduledItem = {
        ...medicationData,
        Acknowledged: false,
        id: count,
        notificationId: "",
        Instructions: {
          ...medicationData.Instructions,
          FirstDosageTiming: medicationData.Instructions.FirstDosageTiming + timeInterval * 60 * j > 24 * 60 ? medicationData.Instructions.FirstDosageTiming + timeInterval * 60 * j - 24 * 60 : medicationData.Instructions.FirstDosageTiming + timeInterval * 60 * j,
        },
      };
      const scheduledItem = await scheduleNotificationItem(newScheduledItem);
      temp.push(scheduledItem);
      count++;
    }
    return temp;
  }

  // Sort scheduled items in order of time
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

  // Add medication item
  const addMedication = async (medicationData: MedicationItem) => {
    try {
      const newScheduledItems = await getNewScheduledItems(medicationData);
      const newMedicationItems = [...allMedicationItems, medicationData];
      setScheduledItems(sortScheduledItems([...scheduledItems, ...newScheduledItems]));
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

  if (!isUserLoggedIn && !isSignUpComplete) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginPage {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen name="Sign Up Home" options={{ headerShown: false }}>
            {(props) => <SignUpHomePage {...props} onSignUpHome={handleSignUpHome} />}
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
          {(props) => <MenuPage {...props} userInformation={userInformation} resetScheduledItems={resetScheduledItems} setIsNotificationReset={setIsNotificationReset} onSignOut={handleSignOut} />}
        </Stack.Screen>
        <Stack.Screen name="Medication Database" options={{ headerShown: false }}>
          {(props) => <MedicationDatabase {...props} />}
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
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => <LoginPage {...props} onLogin={handleLogin} />}
        </Stack.Screen>
        <Stack.Screen name="Sign Up Home" options={{ headerShown: false }}>
          {(props) => <SignUpHomePage {...props} onSignUpHome={handleSignUpHome} />}
        </Stack.Screen>
        <Stack.Screen name="Sign Up Details" options={{ headerShown: false }}>
          {(props) => <SignUpDetailsPage {...props} setIsSignUpComplete={setIsSignUpComplete} />}
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
