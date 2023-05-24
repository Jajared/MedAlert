export interface UserInformation {
  Name: string;
  Gender: string;
  DateOfBirth: string;
  EmailAddress: string;
  PhoneNumber: string;
  ProfilePicture: string;
}

export interface ScheduledItem extends MedicationItem {
  Acknowledged: boolean;
  id: number;
  notificationId: string;
}

export interface MedicationItem {
  Name: string;
  Type: string;
  Purpose: string;
  Instructions: {
    TabletsPerIntake: number;
    FrequencyPerDay: number;
    Specifications: string;
    FirstDosageTiming: number;
  };
}
