import { SafeAreaView, StatusBar, View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";
import React, { useEffect, useState, useCallback } from "react";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { firestorage } from "../firebaseConfig";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";
import DatePicker from "../components/DatePicker/DatePicker";

function PerformancePage({ navigation, consumptionEvents, userId }) {
  const DEFAULT_CHART_DATA = [
    { date: new Date().toISOString().split("T")[0], value: 0 },
    { date: new Date().toISOString().split("T")[0], value: 0 },
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
  useEffect(() => {
    getChartData(selectedTimeFrame);
  }, [selectedDate]);

  const handleTimeFrameChange = useCallback((timeFrame) => {
    if (timeFrame === "Day") {
      setSpacing(150);
    } else if (timeFrame === "Week") {
      setSpacing(50);
    } else if (timeFrame === "Month") {
      setSpacing(20);
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
    setIsLoading(true);
    const chartData = calculateData(consumptionEvents, timeFrame);
    const piechartData = getPieChartData(chartData);
    setPieChartData(piechartData);
    setChartData(chartData);
    setIsLoading(false);
  };

  function calculateData(data, timeFrame) {
    try {
      if (timeFrame === "Day") {
        // Filter and calculate data based on a daily time frame
        const filteredData = data.filter((event) => event.date === selectedDate.toISOString().split("T")[0]);
        if (filteredData.length == 0) {
          return DEFAULT_CHART_DATA;
        } else {
          const chartData = filteredData.map((event) => {
            return { date: event.date, value: event.difference / 60 };
          });
          if (chartData.length < 2) {
            chartData.unshift({ date: new Date().toISOString().split("T")[0], value: 0 });
          }
          return chartData;
        }
      } else if (timeFrame === "Week") {
        // Filter and calculate data based on a weekly time frame
        const weekStartDate = selectedDate;
        const weekEndDate = new Date(selectedDate.getTime() + 6 * 24 * 60 * 60 * 1000);
        const filteredData = data.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= weekStartDate && eventDate <= weekEndDate;
        });
        const currentDate = new Date(weekStartDate);
        const chartData = [];
        while (currentDate <= weekEndDate) {
          const date = currentDate.toISOString().split("T")[0];
          const eventData = filteredData.find((event) => event.date === date);
          const value = eventData ? eventData.difference / 60 : 0;
          chartData.push({ date, value });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        console.log(chartData);
        return chartData;
      } else if (timeFrame === "Month") {
        // Filter and calculate data based on a monthly time frame
        const monthStartDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const monthEndDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        const filteredData = data.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= monthStartDate && eventDate <= monthEndDate;
        });
        const currentDate = new Date(monthStartDate);
        while (currentDate <= monthEndDate) {
          const date = currentDate.toISOString().split("T")[0];
          const eventData = filteredData.find((event) => event.date === date);
          const value = eventData ? eventData.difference / 60 : 0;
          chartData.push({ date, value });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        console.log(chartData);
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
    const { positiveCount, negativeCount } = data.reduce(
      (counts, { value }) => {
        if (value > 0.5 || value < -0.5) {
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
      <Text style={styles.pageHeader}>Consumption Pattern</Text>
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
            data={piechartData}
            donut
            radius={90}
            innerRadius={60}
            innerCircleColor={"white"}
            centerLabelComponent={() => {
              return (
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ fontSize: 22, color: "black", fontWeight: "bold" }}>{piechartData[0].value.toFixed(0)}%</Text>
                  <Text style={{ fontSize: 14, color: "black" }}>On Time</Text>
                </View>
              );
            }}
          />
        </View>
      </View>
      <View style={[styles.chartSection, { marginBottom: 40 }]}>
        <Text style={styles.header}>Trend</Text>
        <View style={styles.chart}>
          <LineChart
            areaChart
            data={chartData}
            isAnimated
            hideDataPoints
            animationDuration={800}
            animateOnDataChange
            onDataChangeAnimationDuration={800}
            spacing={spacing}
            color="black"
            startFillColor="#FF5C5C"
            endFillColor="#D1FFBD"
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
                      backgroundColor: items[0].value > 30 || items[0].value < -30 ? "#FF5C5C" : "#D1FFBD",
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
    flex: 1,
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
    borderRadius: 20,
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
    marginLeft: 10,
  },
  chartSection: {
    flex: 8,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  chart: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  bottomNavBar: {
    height: 60,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});

export default PerformancePage;
