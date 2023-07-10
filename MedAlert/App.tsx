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
import { UserInformation, MedicationItemData, ScheduledItem, NotificationItem, ConsumptionEvent } from "./utils/types";
import { collection, doc, getDoc, updateDoc, getDocs, setDoc } from "firebase/firestore";
import { firestorage } from "./firebaseConfig";
import { auth } from "./firebaseConfig";
import { userDataConverter } from "./converters/userDataConverter";
import { medDataConverter } from "./converters/medDataConverter";
import { statisticsDataConverter } from "./converters/statisticsDataConverter";
import EditMedicationDetails from "./pages/EditMedicationDetails";
import EditMedicationSchedule from "./pages/EditMedicationSchedule";
import MedicationDatabase from "./pages/MedicationDatabase";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SearchItemPage from "./pages/SearchItemPage";
import PerformancePage from "./pages/PerformancePage";
import SignUpHomePage from "./pages/SignUpHomePage";
import SignUpDetailsPage from "./pages/SignUpDetailsPage";
import ViewMedicationPage from "./pages/ViewMedicationPage";
import ChatBotPage from "./pages/ChatBotPage";
import { DocumentReference } from "firebase/firestore";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import PatientMedicationPage from "./pages/PatientMedicationPage";
import GuardianHomePage from "./pages/GuardianHomePage";
import AboutPage from "./pages/AboutPage";
import HelpPage from "./pages/HelpPage";

const Stack = createNativeStackNavigator();

export default function App() {
  const [userInformation, setUserInformation] = useState<UserInformation>({
    Name: "",
    Gender: "",
    DateOfBirth: "",
    EmailAddress: "",
    PhoneNumber: "",
    Settings: {
      DoseBoundary: 30,
      FavouriteMedications: [],
    },
  });
  const [allMedicationItems, setAllMedicationItems] = useState<MedicationItemData[]>([]);
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);
  const [consumptionEvents, setConsumptionEvents] = useState<ConsumptionEvent[]>([]);
  const [favouriteMedications, setFavouriteMedications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState("");
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const medInfoRef = useRef<DocumentReference>();
  const userInfoRef = useRef<DocumentReference>();
  const statisticsInfoRef = useRef<DocumentReference>();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();
  const [isNotificationReset, setIsNotificationReset] = useState(false);
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);

  // Register for local push notifications
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
      setExpoPushToken(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  // Fetch user and medication data from firebase
  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const medInfoQuerySnapshot = await getDoc(medInfoRef.current.withConverter(medDataConverter));
      const userQuerySnapshot = await getDoc(userInfoRef.current.withConverter(userDataConverter));
      const statisticsSnapshot = await getDoc(statisticsInfoRef.current.withConverter(statisticsDataConverter));
      const statisticsInfoData = statisticsSnapshot.data();
      const medInfoData = medInfoQuerySnapshot.data();
      const userInfoData = userQuerySnapshot.data();
      setUserInformation(userInfoData);
      setAllMedicationItems(medInfoData.MedicationItems);
      setScheduledItems(medInfoData.ScheduledItems);
      setConsumptionEvents(statisticsInfoData.ConsumptionEvents);
      setFavouriteMedications(userInfoData.Settings.FavouriteMedications);
      console.log("Data fetched successfully");
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserAuthState();
  }, []);

  useEffect(() => {
    if (userId && isSignUpComplete) {
      medInfoRef.current = doc(firestorage, "MedicationInformation", userId);
      userInfoRef.current = doc(firestorage, "UsersData", userId);
      statisticsInfoRef.current = doc(firestorage, "StatisticsData", userId);
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
      statisticsInfoRef.current = doc(firestorage, "StatisticsData", user.uid);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("Wait 0.3 seconds");
        }, 300);
      });
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
        setIsSignUpComplete(false);
        setUserId("");
        setAllMedicationItems([]);
        setScheduledItems([]);
        setUserInformation({
          Name: "",
          Gender: "",
          DateOfBirth: "",
          EmailAddress: "",
          PhoneNumber: "",
          Settings: {
            DoseBoundary: 30,
            FavouriteMedications: [],
          },
        });
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
  const setEdit = async (medicationItem: MedicationItemData) => {
    var newAllMedicationItems = [...allMedicationItems];
    for (var i = 0; i < newAllMedicationItems.length; i++) {
      if (newAllMedicationItems[i].Name == medicationItem.Name) {
        newAllMedicationItems[i] = medicationItem;
      }
    }
    const newScheduledItems = await editScheduledItems(medicationItem);
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
  const deleteMedicationFromList = async (medicationItem: MedicationItemData) => {
    var newAllMedicationItems = [...allMedicationItems];
    for (var i = 0; i < newAllMedicationItems.length; i++) {
      if (newAllMedicationItems[i].Name == medicationItem.Name) {
        newAllMedicationItems.splice(i, 1);
      }
    }
    const newScheduledItems = scheduledItems.filter((item) => item.Name != medicationItem.Name);
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
  async function editScheduledItems(changedMedicationItem: MedicationItemData) {
    var temp = [];
    var count = 1;
    Notifications.cancelAllScheduledNotificationsAsync().then((response) => {
      console.log("Resetting all notifications");
    });
    const tempScheduledItems = scheduledItems.filter((item) => item.Name != changedMedicationItem.Name);
    const timeInterval = 24 / changedMedicationItem.Instructions.FrequencyPerDay;
    for (let j = 0; j < changedMedicationItem.Instructions.FrequencyPerDay; j++) {
      const newScheduledItem: ScheduledItem = {
        ...changedMedicationItem,
        Acknowledged: false,
        id: count,
        notificationId: "",
        Instructions: {
          ...changedMedicationItem.Instructions,
          FirstDosageTiming: changedMedicationItem.Instructions.FirstDosageTiming + timeInterval * 60 * j > 24 * 60 ? changedMedicationItem.Instructions.FirstDosageTiming + timeInterval * 60 * j - 24 * 60 : changedMedicationItem.Instructions.FirstDosageTiming + timeInterval * 60 * j,
        },
      };
      const scheduledItem = await scheduleNotificationItem(newScheduledItem);
      temp.push(scheduledItem);
      count++;
    }
    const newScheduledItems = [...tempScheduledItems, ...temp];
    var result = sortScheduledItems(newScheduledItems);
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
    console.log("Acknowledged");
    var newScheduledItems = [...scheduledItems];
    var newConsumptionEvents = [...consumptionEvents];
    var currentDate = new Date();
    for (let i = 0; i < newScheduledItems.length; i++) {
      if (newScheduledItems[i].id === id) {
        newScheduledItems[i].Acknowledged = true;
        // Update statistics data
        const newEntry: ConsumptionEvent = {
          date: currentDate.toISOString().split("T")[0],
          medicationName: newScheduledItems[i].Name,
          scheduledTime: newScheduledItems[i].Instructions.FirstDosageTiming,
          actualTime: currentDate.getHours() * 60 + currentDate.getMinutes(),
          difference: currentDate.getHours() * 60 + currentDate.getMinutes() - newScheduledItems[i].Instructions.FirstDosageTiming,
        };
        newConsumptionEvents.push(newEntry);
      }
    }
    setConsumptionEvents(newConsumptionEvents);
    updateDoc(statisticsInfoRef.current, { ConsumptionEvents: newConsumptionEvents });
    setScheduledItems(newScheduledItems);
    updateDoc(medInfoRef.current, { ScheduledItems: newScheduledItems });
  }

  function deleteReminder(id: number) {
    console.log("Deleted");
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
  async function getNewScheduledItems(medicationData: MedicationItemData) {
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
  const addMedication = async (medicationData: MedicationItemData) => {
    try {
      const newScheduledItem = await getNewScheduledItems(medicationData);
      const newMedicationItems = [...allMedicationItems, medicationData];
      const newScheduledItems = sortScheduledItems([...scheduledItems, ...newScheduledItem]);
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

  function addToFavourites(medicationName: string) {
    console.log("Added to favourites");
    var newFavouriteMedications = [...favouriteMedications, medicationName];
    setFavouriteMedications(newFavouriteMedications);
    const userRef = doc(firestorage, "UsersData", userId);
    updateDoc(userRef, { Settings: { ...userInformation.Settings, FavouriteMedications: newFavouriteMedications } });
  }

  function removeFromFavourites(medicationName: string) {
    console.log("Removed from favourites");
    var newFavouriteMedications = favouriteMedications.filter((med) => med !== medicationName);
    setFavouriteMedications(newFavouriteMedications);
    const userRef = doc(firestorage, "UsersData", userId);
    updateDoc(userRef, { Settings: { ...userInformation.Settings, FavouriteMedications: newFavouriteMedications } });
  }

  function isFavourite(medicationName: string) {
    return favouriteMedications.includes(medicationName);
  }

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
          <Stack.Screen name="Reset Password" options={{ headerShown: false }}>
            {(props) => <ResetPasswordPage {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Sign Up Home" options={{ headerShown: false }}>
            {(props) => <SignUpHomePage {...props} onSignUpHome={handleSignUpHome} />}
          </Stack.Screen>
          <Stack.Screen name="Sign Up Details" options={{ headerShown: false }}>
            {(props) => <SignUpDetailsPage {...props} setIsSignUpComplete={setIsSignUpComplete} />}
          </Stack.Screen>
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => <HomeScreen {...props} scheduledItems={scheduledItems} setAcknowledged={setAcknowledged} userName={userInformation.Name} fetchData={fetchData} deleteReminder={deleteReminder} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => <HomeScreen {...props} scheduledItems={scheduledItems} setAcknowledged={setAcknowledged} userName={userInformation.Name} fetchData={fetchData} deleteReminder={deleteReminder} />}
        </Stack.Screen>
        <Stack.Screen name="Performance" options={{ headerShown: false }}>
          {(props) => <PerformancePage {...props} consumptionEvents={consumptionEvents} userId={userId} prevSettings={userInformation.Settings} />}
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
          {(props) => <MenuPage {...props} userInformation={userInformation} setIsNotificationReset={setIsNotificationReset} onSignOut={handleSignOut} />}
        </Stack.Screen>
        <Stack.Screen name="Guardian Home" options={{ headerShown: false }}>
          {(props) => <GuardianHomePage {...props} userId={userId} />}
        </Stack.Screen>
        <Stack.Screen name="Patient Medication" options={{ headerShown: false }}>
          {(props) => <PatientMedicationPage {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Medication Database" options={{ headerShown: false }}>
          {(props) => <MedicationDatabase {...props} settings={userInformation.Settings} userId={userId} favouriteMedications={favouriteMedications} />}
        </Stack.Screen>
        <Stack.Screen name="Search Medication Item" options={{ headerShown: false }}>
          {(props) => <SearchItemPage {...props} addToFavourites={addToFavourites} removeFromFavourites={removeFromFavourites} isFavourite={isFavourite} />}
        </Stack.Screen>
        <Stack.Screen name="Chat Bot" options={{ headerShown: false }}>
          {(props) => <ChatBotPage {...props} gender={userInformation.Gender} dateOfBirth={userInformation.DateOfBirth} />}
        </Stack.Screen>
        <Stack.Screen name="Update Account" options={{ headerShown: false }}>
          {(props) => <UpdateAccountPage {...props} userInformation={userInformation} updateUserInformation={updateUserInformation} />}
        </Stack.Screen>
        <Stack.Screen name="Help" options={{ headerShown: false }}>
          {(props) => <HelpPage {...props} />}
        </Stack.Screen>
        <Stack.Screen name="About" options={{ headerShown: false }}>
          {(props) => <AboutPage {...props} />}
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
