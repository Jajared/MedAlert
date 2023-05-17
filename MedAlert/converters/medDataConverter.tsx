import { UserInformation, MedicationItem, ScheduledItem } from "../utils/types";

interface FirestoreData {
  MedicationItems: MedicationItem[];
  ScheduledItems: ScheduledItem[];
}

export const medDataConverter = {
  toFirestore(data: FirestoreData) {
    return { MediationItems: data.MedicationItems, ScheduledItems: data.ScheduledItems };
  },
  fromFirestore(snapshot): FirestoreData {
    const data = snapshot.data();
    return {
      MedicationItems: data.MedicationItems,
      ScheduledItems: data.ScheduledItems,
    };
  },
};
