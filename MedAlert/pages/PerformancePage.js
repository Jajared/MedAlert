import { SafeAreaView, StatusBar, View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";
import React, { useEffect, useState, useCallback } from "react";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";

function PerformancePage({ navigation, consumptionEvents }) {
  const DEFAULT_CHART_DATA = [
    { date: "2023-06-27", value: 0 },
    { date: "2023-06-28", value: 0 },
  ];
  const DEFAULT_PIECHART_DATA = [
    { value: 100, color: "rgb(20, 195, 142)" },
    { value: 0, color: "rgb(255, 74, 74)" },
  ];
  const [chartData, setChartData] = useState(DEFAULT_CHART_DATA);
  const [piechartData, setPieChartData] = useState(DEFAULT_PIECHART_DATA);
  const [selectedTimeFrame, setTimeFrame] = useState("Week");
  const timeFrames = ["Day", "Week", "Month"];
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);

  const handleTimeFrameChange = useCallback((timeFrame) => {
    getChartData(timeFrame);
  }, []);

  const getChartData = async (timeFrame) => {
    setIsLoading(true);
    if (timeFrame === "Day") {
      const chartData = await calculateDataDaily(consumptionEvents);
      setChartData(chartData);
    } else if (timeFrame === "Week") {
      const chartData = await calculateDataWeekly(consumptionEvents);
      setChartData(chartData);
    } else {
      const chartData = calculateDataMonthly(consumptionEvents);
      setChartData(chartData);
    }
    setPieChartData(getPieChartData(chartData));
    setIsLoading(false);
  };

  // Filter and calculate data based on a weekly time frame
  function calculateDataWeekly(data) {
    const currentDate = new Date();
    const weekStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    const filteredData = data.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= weekStartDate && eventDate <= currentDate;
    });
    const chartData = filteredData.map((event) => {
      return { date: event.date, value: event.value };
    });
    return chartData;
  }

  // Filter and calculate data based on a daily time frame
  function calculateDataDaily(data) {
    const currentDate = new Date().toISOString().split("T")[0];
    const filteredData = data.filter((event) => event.date === currentDate);
    const chartData = filteredData.map((event) => {
      return { date: event.date, value: event.value };
    });
    return chartData;
  }

  // Filter and calculate data based on a monthly time frame
  function calculateDataMonthly(data) {
    const currentDate = new Date();
    const monthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const filteredData = data.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= monthStartDate && eventDate <= currentDate;
    });
    return filteredData;
  }

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
                handleTimeFrameChange(timeFrame);
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
