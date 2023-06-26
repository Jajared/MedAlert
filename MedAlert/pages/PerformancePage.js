import { SafeAreaView, StatusBar, View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";
import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, updateDoc, getDocs, setDoc } from "firebase/firestore";
import { firestorage } from "../firebaseConfig";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";

function PerformancePage({ navigation, userId }) {
  const [chartData, setChartData] = useState([
    { date: "2021-09-01", value: -1 },
    { date: "2021-09-02", value: 0.5 },
  ]);
  const [piechartData, setPieChartData] = useState([
    { value: 50, color: "rgb(20, 195, 142)" },
    { value: 50, color: "rgb(255, 74, 74)" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeFrame, setTimeFrame] = useState("Week");
  const timeFrames = ["Week", "Month", "Year"];

  useEffect(() => {
    getStatisticsData();
  }, []);

  const uploadMockData = async () => {
    try {
      const querySnapshot = doc(firestorage, "StatisticsData", userId);
      const mockData = {
        TimeData: [
          { date: "2021-09-01", value: 0.5 },
          { date: "2021-09-02", value: 0.5 },
          { date: "2021-09-03", value: 0.5 },
          { date: "2021-09-04", value: 0.5 },
        ],
      };
      await updateDoc(querySnapshot, mockData);
      console.log("mock data uploaded");
    } catch (error) {
      console.log(error);
    }
  };

  const getStatisticsData = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = doc(firestorage, "StatisticsData", userId);
      const snapshot = await getDoc(querySnapshot);
      const timeData = snapshot.data().TimeData;
      setChartData(timeData);
      const piechartData = getPieChartData(timeData);
      setPieChartData(piechartData);
      console.log("statistics data fetched");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
              }}
              style={[styles.filterItem, timeFrame == selectedTimeFrame && styles.selectedFilterItem]}
            >
              <Text style={[styles.filterText, timeFrame == selectedTimeFrame && styles.selectedFilterText]}>{timeFrame}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
      <View style={styles.chartSection}>
        <Text style={styles.header}>Trend</Text>
        <View style={styles.chart}>
          <LineChart
            areaChart
            data={chartData}
            hideDataPoints
            isAnimated
            scrollToEnd
            animationDuration={800}
            animateOnDataChange
            onDateChangeAnimationDuration={1000}
            spacing={30}
            color="black"
            startFillColor="#FF5C5C"
            endFillColor="#D1FFBD"
            startOpacity={0.7}
            endOpacity={0.7}
            initialSpacing={0}
            yAxisColor="white"
            yAxisThickness={0}
            noOfSections={2}
            stepValue={1}
            height={100}
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
                      height: 120,
                      width: 100,
                      backgroundColor: items[0].value > 0 ? "#D1FFBD" : "#FF5C5C",
                      borderRadius: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "black", fontSize: 14, fontWeight: "bold" }}>{items[0].date}</Text>
                    <Text style={{ color: "black" }}>{items[0].value}</Text>
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
    marginTop: 20,
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
    fontSize: 16,
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
  },
  chart: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    paddingHorizontal: 20,
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
