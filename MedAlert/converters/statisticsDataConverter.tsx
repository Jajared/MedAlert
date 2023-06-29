import { ConsumptionDataSummary, ConsumptionEvent } from "../utils/types";

interface FirestoreData {
  ConsumptionEvents: ConsumptionEvent[];
}

export const statisticsDataConverter = {
  toFirestore(data: FirestoreData) {
    return { ConsumptionEvents: data.ConsumptionEvents };
  },
  fromFirestore(snapshot): FirestoreData {
    const data = snapshot.data();
    return {
      ConsumptionEvents: data.ConsumptionEvents,
    };
  },
};
