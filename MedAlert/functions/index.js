const admin = require("firebase-admin");
const { debug, error } = require("firebase-functions/logger");

const { onSchedule } = require("firebase-functions/v2/scheduler");
admin.initializeApp();

const firestore = admin.firestore();

exports.resetScheduledData = onSchedule("00 16 * * *", async () => {
  function resetScheduledItems(scheduledItems) {
    return scheduledItems.map((item) => {
      ({ ...item, Acknowledged: false });
    });
  }
  try {
    firestore
      .collection("MedicationInformation")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const scheduledItems = doc.data().ScheduledItems;
          const newScheduledItems = resetScheduledItems(scheduledItems);
          doc.ref.update({ ScheduledItems: newScheduledItems });
        });
      });
    return null;
  } catch (e) {
    error(e);
    return null;
  }
});
