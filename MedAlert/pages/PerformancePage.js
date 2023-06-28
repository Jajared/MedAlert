import { SafeAreaView, StatusBar, View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";
import React, { useEffect, useState, useCallback } from "react";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";

function PerformancePage({ navigation, statisticsData }) {
  const [chartData, setChartData] = useState([
    { date: "1", value: 0 },
    { date: "2", value: 0 },
  ]);
  const [piechartData, setPieChartData] = useState([
    { value: 50, color: "rgb(20, 195, 142)" },
    { value: 50, color: "rgb(255, 74, 74)" },
  ]);
  const [selectedTimeFrame, setTimeFrame] = useState("Week");
  const timeFrames = ["Day", "Week", "Month"];
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setChartData(statisticsData);
    getPieChartData(statisticsData);
  }, []);

  const handleTimeFrameChange = useCallback((timeFrame) => {
    if (timeFrame === "Day") {
      const todayData = statisticsData[statisticsData.length - 1];
      console.log(todayData);
      setChartData([todayData]);
      getPieChartData([todayData]);
    } else if (timeFrame === "Week") {
      const weekData = statisticsData.slice(statisticsData.length - 7, statisticsData.length);
      setChartData(weekData);
      getPieChartData(weekData);
    } else {
      const monthData = statisticsData.slice(statisticsData.length - 30, statisticsData.length);
      setChartData(monthData);
      getPieChartData(monthData);
    }
  }, []);

  const getPieChartData = (data) => {
    setIsLoading(true);
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

    setPieChartData([
      { value: positivePercentage, color: "rgb(20, 195, 142)" },
      { value: negativePercentage, color: "rgb(255, 74, 74)" },
    ]);
    setIsLoading(false);
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
            adjustToWidth
            animationDuration={800}
            animateOnDataChange
            onDataChangeAnimationDuration={1000}
            spacing={30}
            color="black"
            startFillColor="#FF5C5C"
            endFillColor="#D1FFBD"
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
    marginTop: 10,
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
