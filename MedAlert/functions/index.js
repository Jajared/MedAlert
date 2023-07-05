const admin = require("firebase-admin");
const { debug, error } = require("firebase-functions/logger");

const { onSchedule } = require("firebase-functions/v2/scheduler");
admin.initializeApp();

const firestore = admin.firestore();

exports.resetScheduledData = onSchedule("00 16 * * *", async () => {
  function getScheduledItems(allMedicationItems) {
    var temp = [];
    for (let i = 0; i < allMedicationItems.length; i++) {
      const timeInterval = 24 / allMedicationItems[i].Instructions.FrequencyPerDay;
      for (let j = 0; j < allMedicationItems[i].Instructions.FrequencyPerDay; j++) {
        temp.push({
          ...allMedicationItems[i],
          Acknowledged: false,
          Instructions: {
            ...allMedicationItems[i].Instructions,
            FirstDosageTiming: allMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j > 24 * 60 ? allMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j - 24 * 60 : allMedicationItems[i].Instructions.FirstDosageTiming + timeInterval * 60 * j,
          },
        });
      }
    }
    var result = sortScheduledItems(temp);
    return result;
  }
  // Sort scheduled items in order of time
  function sortScheduledItems(data) {
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
  try {
    firestore
      .collection("MedicationInformation")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const medicationItems = doc.data().MedicationItems;
          doc.ref.update({ ScheduledItems: getScheduledItems(medicationItems) });
        });
      });
    return null;
  } catch (e) {
    error(e);
    return null;
  }
});
