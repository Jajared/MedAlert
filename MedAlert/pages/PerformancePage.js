import { SafeAreaView, StatusBar, View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";
import React, { useEffect, useState, useCallback } from "react";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { firestorage } from "../firebaseConfig";
import BottomNavBar from "../components/BottomNavBar";
import DatePicker from "../components/DatePicker";
import { Feather, Entypo } from "@expo/vector-icons";
import BackNavBar from "../components/BackNavBar";

function PerformancePage({ navigation, consumptionEvents, userId, prevSettings }) {
  const DEFAULT_CHART_DATA = [
    { date: "00:00", value: 0 },
    { date: "12:00", value: 0 },
    { date: "23:59", value: 0 },
  ];
  const DEFAULT_PIECHART_DATA = [
    { value: 100, color: "rgb(20, 195, 142)" },
    { value: 0, color: "rgb(255, 74, 74)" },
  ];

  const [chartData, setChartData] = useState(DEFAULT_CHART_DATA);
  const [piechartData, setPieChartData] = useState(DEFAULT_PIECHART_DATA);
  const [selectedTimeFrame, setTimeFrame] = useState("Week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [spacing, setSpacing] = useState(80);
  const timeFrames = ["Day", "Week", "Month"];
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [settings, setSettings] = useState({ ...prevSettings, DoseBoundary: prevSettings.DoseBoundary });
  const [timeBoundary, setTimeBoundary] = useState(prevSettings.DoseBoundary);
  const [hasNoData, setHasNoData] = useState(false);
  useEffect(() => {
    getChartData(selectedTimeFrame);
  }, [selectedDate, selectedTimeFrame, timeBoundary]);

  const handleTimeFrameChange = useCallback((timeFrame) => {
    if (timeFrame === "Day") {
      setSpacing(150);
    } else if (timeFrame === "Week") {
      setSpacing(50);
    } else if (timeFrame === "Month") {
      setSpacing(10);
    }
    getChartData(timeFrame);
  }, []);

  function testData() {
    const startDate = new Date(); // Current date
    startDate.setDate(startDate.getDate() - 15); // Go back 1 month
    const endDate = new Date(); // Current date
    const sampleData = [];
    while (startDate <= endDate) {
      const currentDate = new Date(startDate);
      const event = {
        date: currentDate.toISOString().split("T")[0],
        medicationName: "Test",
        scheduledTime: 1340,
        actualTime: 1366,
        difference: Math.floor(Math.random() * 121) - 60,
      };
      sampleData.push(event);
      currentDate.setDate(currentDate.getDate() + 1);
      startDate.setDate(currentDate.getDate());
    }
    setDoc(doc(firestorage, "StatisticsData", userId), { ConsumptionEvents: sampleData });
    console.log("Sample data added");
  }

  const getChartData = async (timeFrame) => {
    try {
      setIsLoading(true);
      const chartData = await calculateData(consumptionEvents, timeFrame);
      const pieChartData = getPieChartData(chartData);
      setPieChartData(pieChartData);
      setChartData(chartData);
    } catch (error) {
      console.log("Error");
      alert("Unable to get data");
      setChartData(DEFAULT_CHART_DATA);
      setPieChartData(DEFAULT_PIECHART_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  function toTime(time) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  }

  function calculateData(data, timeFrame) {
    try {
      if (timeFrame === "Day") {
        // Filter and calculate data based on a daily time frame
        const filteredData = data.filter((event) => event.date === selectedDate.toISOString().split("T")[0]);
        if (filteredData.length == 0) {
          setHasNoData(true);
          return DEFAULT_CHART_DATA;
        } else {
          setHasNoData(false);
          const chartData = filteredData.map((event) => {
            return { date: toTime(event.actualTime), value: event.difference / 60 };
          });
          chartData.unshift({ date: "00:00", value: 0 });
          chartData.push({ date: "23:59", value: 0 });
          return chartData;
        }
      } else if (timeFrame === "Week") {
        setHasNoData(false);
        // Filter and calculate data based on a weekly time frame
        const weekStartDate = new Date(selectedDate.getTime());
        const currentDay = weekStartDate.getDay();
        const offset = currentDay === 0 ? -6 : 1 - currentDay; // Calculate the offset to get the Monday of the current week
        weekStartDate.setDate(weekStartDate.getDate() + offset);
        const weekEndDate = new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000);
        const filteredData = data.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= weekStartDate && eventDate <= weekEndDate;
        });
        const currentDate = new Date(weekStartDate);
        const chartData = [];
        if (filteredData.length == 0) {
          setHasNoData(true);
        }
        while (currentDate <= weekEndDate) {
          const date = currentDate.toLocaleDateString("en-US", { weekday: "short" }).split(",")[0];
          const eventData = filteredData.filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === currentDate.getDate();
          });
          let totalValue = 0;
          eventData.forEach((event) => {
            totalValue += event.difference / 60;
          });
          const value = eventData.length > 0 ? totalValue / eventData.length : 0;
          chartData.push({ date, value });
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return chartData;
      } else if (timeFrame === "Month") {
        setHasNoData(false);
        // Filter and calculate data based on a monthly time frame
        const monthStartDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const monthEndDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        const filteredData = data.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= monthStartDate && eventDate <= monthEndDate;
        });
        if (filteredData.length == 0) {
          setHasNoData(true);
        }
        const currentDate = new Date(monthStartDate);
        const chartData = [];
        while (currentDate <= monthEndDate) {
          const date = currentDate.toISOString().split("T")[0];
          const eventData = filteredData.filter((event) => event.date === date);
          let totalValue = 0;
          eventData.forEach((event) => {
            totalValue += event.difference / 60;
          });
          const value = eventData.length > 0 ? totalValue / eventData.length : 0;
          chartData.push({ date, value });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return chartData;
      }
    } catch (error) {
      console.log("Error");
      alert("Unable to get data");
      setChartData(DEFAULT_CHART_DATA);
      setPieChartData(DEFAULT_PIECHART_DATA);
    }
  }

  const getPieChartData = (data) => {
    const boundary = timeBoundary / 60;
    const { positiveCount, negativeCount } = data.reduce(
      (counts, { value }) => {
        if (value > boundary || value < -boundary) {
          // 0.5hr (30 minutes) is the threshold
          counts.negativeCount++;
        } else {
          counts.positiveCount++;
        }
        return counts;
      },
      { positiveCount: 0, negativeCount: 0 }
    );

    const total = positiveCount + negativeCount;
    const positivePercentage = (positiveCount / total) * 100;
    const negativePercentage = (negativeCount / total) * 100;

    return [
      { value: positivePercentage, color: "rgb(20, 195, 142)" },
      { value: negativePercentage, color: "rgb(255, 74, 74)" },
    ];
  };

  const updateSettings = async () => {
    try {
      setIsLoading(true);
      const docRef = doc(firestorage, "UsersData", userId);
      await updateDoc(docRef, { Settings: settings });
      setTimeBoundary(settings.DoseBoundary);
      console.log("Settings updated");
    } catch (error) {
      console.log("Error");
      alert("Unable to update settings");
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerBar}>
        <BackNavBar navigation={navigation} title="Consumption Pattern" />
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => {
            setIsSettingsVisible(true);
          }}
        >
          <Feather name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          {timeFrames.map((timeFrame) => (
            <TouchableOpacity
              key={timeFrame}
              onPress={() => {
                setTimeFrame(timeFrame);
                handleTimeFrameChange(timeFrame);
              }}
              style={[styles.filterItem, timeFrame == selectedTimeFrame && styles.selectedFilterItem]}
            >
              <Text style={[styles.filterText, timeFrame == selectedTimeFrame && styles.selectedFilterText]}>{timeFrame}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.datepicker}>
        <DatePicker timeFrame={selectedTimeFrame} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </View>
      <View style={styles.chartSection}>
        <View style={styles.chart}>
          <PieChart
            data={hasNoData ? [{ value: 100, color: "grey" }] : piechartData}
            donut
            radius={90}
            innerRadius={60}
            innerCircleColor={"white"}
            centerLabelComponent={() => {
              if (hasNoData) {
                return (
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 22, color: "lightgray", fontWeight: "bold" }}>No Data</Text>
                  </View>
                );
              } else {
                return (
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 22, color: "black", fontWeight: "bold" }}>{piechartData[0].value.toFixed(0)}%</Text>
                    <Text style={{ fontSize: 14, color: "black" }}>On Time</Text>
                  </View>
                );
              }
            }}
          />
        </View>
      </View>
      <View style={[styles.chartSection, { marginBottom: 40 }]}>
        <Text style={styles.header}>Trend</Text>
        <View style={styles.chart}>
          {hasNoData && <Text style={{ color: "lightgray", position: "absolute", top: 40, left: "47%" }}>No data</Text>}
          <LineChart
            data={chartData}
            isAnimated
            hideDataPoints
            animationDuration={800}
            animateOnDataChange
            onDataChangeAnimationDuration={800}
            spacing={spacing}
            color="orange"
            thickness={2}
            initialSpacing={10}
            yAxisColor="white"
            yAxisThickness={0}
            noOfSections={2}
            stepValue={1}
            height={100}
            width={300}
            minValue={-2}
            maxValue={2}
            rulesType="solid"
            rulesColor="lightgray"
            yAxisLabelSuffix=" hr"
            pointerConfig={{
              pointerStripUptoDataPoint: true,
              pointerStripColor: "lightgray",
              pointerStripWidth: 2,
              strokeDashArray: [2, 5],
              stripOverPointer: true,
              pointerColor: "black",
              radius: 4,
              pointerLabelWidth: 100,
              pointerLabelHeight: 120,
              pointerLabelComponent: (items) => {
                return (
                  <View
                    style={{
                      height: 40,
                      width: 100,
                      backgroundColor: items[0].value > 0.5 || items[0].value < -0.5 ? "#FF5C5C" : "#D1FFBD",
                      borderRadius: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "black", fontSize: 14, fontWeight: "bold" }}>{items[0].date}</Text>
                  </View>
                );
              },
            }}
          />
        </View>
      </View>
      <View style={styles.bottomNavBar}>
        <BottomNavBar navigation={navigation} />
      </View>
      <Modal visible={isSettingsVisible} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={styles.popUpContainer}>
            <View style={styles.popUp}>
              <View style={styles.topBar}>
                <Text style={styles.header}>Settings</Text>
                <TouchableOpacity
                  onPress={() => {
                    setSettings({ ...prevSettings });
                    setIsSettingsVisible(false);
                  }}
                  style={styles.closeFilter}
                >
                  <Entypo name="cross" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={styles.optionsContainer}>
                <View style={styles.settings}>
                  <Text style={styles.optionHeader}>Dose Boundary (in minutes)</Text>
                  <TextInput
                    style={styles.inputBox}
                    keyboardType="decimal-pad"
                    placeholder={settings.DoseBoundary.toString()}
                    onChangeText={(text) => {
                      if (isNaN(text)) {
                        alert("Please enter a number");
                      } else {
                        setSettings({ ...settings, DoseBoundary: parseInt(text) });
                      }
                    }}
                  ></TextInput>
                </View>
                <View style={{ flex: 3 }}></View>
                <TouchableOpacity
                  onPress={() => {
                    updateSettings();
                    setIsSettingsVisible(false);
                  }}
                  style={styles.confirmButton}
                >
                  <Text>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  pageHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  datepicker: {
    flex: 1.5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  backNavBar: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  filterSection: {
    flex: 1.2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#E0E0E0",
  },
  selectedFilterItem: {
    backgroundColor: "#FAF6E0",
  },
  filterText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  selectedFilterText: {
    color: "black",
    fontWeight: "bold",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartSection: {
    flex: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  chart: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNavBar: {
    height: 60,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  popUpContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  popUp: {
    backgroundColor: "white",
    width: "90%",
    height: "60%",
    borderRadius: 20,
    padding: 20,
  },
  closeFilter: {
    flex: 1,
    alignItems: "flex-end",
  },
  topBar: {
    flexDirection: "row",
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "column",
    marginTop: 20,
  },
  settings: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 20,
  },
  optionHeader: {
    flex: 2,
    fontSize: 16,
    alignSelf: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  inputBox: {
    flex: 3,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    alignSelf: "center",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: "#baeaa6",
    width: 100,
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
    fontSize: 18,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  settingsIcon: {
    position: "absolute",
    right: 30,
  },
});

export default PerformancePage;
