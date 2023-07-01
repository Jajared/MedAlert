import { StyleSheet, SafeAreaView, View, StatusBar, RefreshControl, FlatList, Text } from "react-native";
import MedicationItem from "../components/MedicationItem";
import { useState } from "react";
import HomeNavBar from "../components/HomeNavBar";
import BottomNavBar from "../components/BottomNavBar";
import { ScheduledItem } from "../utils/types";

export default function HomeScreen({ navigation, scheduledItems, setAcknowledged, userName, fetchData, deleteReminder }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topNavBar}>
        <HomeNavBar navigation={navigation} userName={userName} hasReminders={scheduledItems.filter((data: ScheduledItem) => data.Acknowledged === false).length == 0 ? false : true} />
      </View>
      <View style={styles.medicationSection}>
        <Text style={styles.medSectHeader}>Upcoming Reminders</Text>
        {scheduledItems && <FlatList data={scheduledItems.filter((data: ScheduledItem) => data.Acknowledged === false)} renderItem={(data) => <MedicationItem props={data} setAcknowledged={setAcknowledged} deleteReminder={deleteReminder} />} keyExtractor={(item: ScheduledItem) => item.notificationId} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />} />}
      </View>
      <View style={styles.bottomNavBar}>
        <BottomNavBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  topNavBar: {
    flex: 2,
  },
  bottomNavBar: {
    height: 60,
  },
  medicationSection: {
    flex: 4,
    width: "100%",
    marginTop: 10,
  },
  medSectHeader: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
