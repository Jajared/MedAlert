import { TotalConsumptionData, ConsumptionData } from "../utils/types";

interface FirestoreData {
  TotalConsumptionData: TotalConsumptionData[];
}

export const statisticsDataConverter = {
  toFirestore(data: FirestoreData) {
    return { TotalConsumptionData: data.TotalConsumptionData };
  },
  fromFirestore(snapshot): FirestoreData {
    const data = snapshot.data();
    return {
      TotalConsumptionData: data.TotalConsumptionData,
    };
  },
};
