const admin = require("firebase-admin");
const { debug, error } = require("firebase-functions/logger");

const { onSchedule } = require("firebase-functions/v2/scheduler");
admin.initializeApp();

const firestore = admin.firestore();

exports.resetScheduledData = onSchedule("00 16 * * *", async () => {
  function resetScheduledItems(scheduledItems) {
    var temp = [];
    for (let i = 0; i < scheduledItems.length; i++) {
      temp.push({
        ...scheduledItems[i],
        Acknowledged: false,
      });
    }
    return temp;
  }

  try {
    firestore
      .collection("MedicationInformation")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const scheduledItems = doc.data().ScheduledItems;
          doc.ref.update({ ScheduledItems: resetScheduledItems(scheduledItems) });
        });
      });
    return null;
  } catch (e) {
    error(e);
    return null;
  }
});
