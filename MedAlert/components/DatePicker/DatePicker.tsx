import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function DatePicker({ timeFrame, selectedDate, setSelectedDate }) {
  console.log(selectedDate);
  const handlePrevious = () => {
    const previousDate = getPreviousDate(selectedDate);
    setSelectedDate(previousDate);
  };

  const handleNext = () => {
    const nextDate = getNextDate(selectedDate);
    setSelectedDate(nextDate);
  };

  // Helper function to get the previous date based on the time frame
  const getPreviousDate = (currentDate) => {
    let previousDate;

    if (timeFrame === "Day") {
      previousDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    } else if (timeFrame === "Week") {
      previousDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      previousDate.setDate(previousDate.getDate() - previousDate.getDay() + 1); // Set to Monday of the previous week
    } else if (timeFrame === "Month") {
      previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    }

    return previousDate;
  };

  // Helper function to get the next date based on the time frame
  const getNextDate = (currentDate) => {
    let nextDate;

    if (timeFrame === "Day") {
      nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    } else if (timeFrame === "Week") {
      nextDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      nextDate.setDate(nextDate.getDate() - nextDate.getDay() + 1); // Set to Monday of the next week
    } else if (timeFrame === "Month") {
      nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    }

    return nextDate;
  };

  const formatDate = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Ap", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const formatDateAsDay = (date) => {
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day.toString()}, ${year}`;
    };

    const formatDateAsWeek = (startDate, endDate) => {
      const startMonth = monthNames[startDate.getMonth()];
      const startDay = startDate.getDate();
      const endMonth = monthNames[endDate.getMonth()];
      const endDay = endDate.getDate();
      const year = startDate.getFullYear();
      if (startMonth == endMonth) {
        return `${startMonth} ${startDay} - ${endDay}, ${year}`;
      } else {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
      }
    };

    const formatDateAsMonth = (date) => {
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${month} ${year}`;
    };

    let formattedDate;

    switch (timeFrame) {
      case "Day":
        formattedDate = formatDateAsDay(date);
        break;
      case "Week":
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(startDate.getDate() + 6);
        formattedDate = formatDateAsWeek(startDate, endDate);
        break;
      case "Month":
        formattedDate = formatDateAsMonth(date);
        break;
      default:
        formattedDate = "";
        break;
    }

    return formattedDate;
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePrevious} style={styles.buttonContainer}>
          <Text style={styles.button}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.time}>{formatDate(selectedDate)}</Text>
        {getNextDate(selectedDate) <= new Date() ? (
          <TouchableOpacity onPress={handleNext} style={styles.buttonContainer}>
            <Text style={styles.button}>{">"}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonContainer}></View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    fontSize: 18,
    fontWeight: "bold",
  },
  time: {
    flex: 3,
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
});
