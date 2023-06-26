import { SafeAreaView, StatusBar, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LineChart, LineChartBicolor, PieChart } from "react-native-gifted-charts";
import React, { useState } from "react";
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";

function PerformancePage({ navigation }) {
  const sampleData = [{ value: -0.2 }, { value: 1 }, { value: 0.5 }, { value: -1 }, { value: 0.8 }, { value: 1 }, { value: -1 }, { value: 0.8 }, { value: 1 }];

  const timeFrames = ["Week", "Month", "Year"];

  const getPieChartData = (data) => {
    const { positiveCount, negativeCount } = data.reduce(
      (counts, { value }) => {
        if (value > 0) {
          counts.positiveCount++;
        } else if (value < 0) {
          counts.negativeCount++;
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

  const piechartData = getPieChartData(sampleData);
  const [selectedTimeFrame, setTimeFrame] = useState("Week");
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
      <View style={styles.chart1}>
        <PieChart
          data={piechartData}
          donut
          showGradient
          sectionAutoFocus
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
      <View style={styles.chart1}>
        <Text style={styles.header}>Trend</Text>
        <LineChartBicolor areaChart isAnimated hideDataPoints scrollToEnd animationDuration={800} yAxisLabelSuffix="h" yAxisThickness={0} initialSpacing={0} height={100} minValue={-3} maxValue={3} noOfSections={3} data={sampleData} startFillColor="rgb(20, 195, 142)" startFillColorNegative="rgb(255, 74, 74)" />
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
  chart1: {
    flex: 6,
    width: "90%",
    alignItems: "center",
  },
  bottomNavBar: {
    height: 60,
  },
});

export default PerformancePage;
