export interface UserInformation {
  Name: string;
  Gender: string;
  DateOfBirth: string;
  EmailAddress: string;
  PhoneNumber: string;
  Settings: {
    DoseBoundary: number;
    FavouriteMedications: string[];
  };
}

export interface ScheduledItem extends MedicationItemData {
  Acknowledged: boolean;
  id: number;
  notificationId: string;
}

export interface MedicationItemData {
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

export interface NotificationItem {
  content: {
    title: string;
    body: string;
  };
  trigger: { hour: number; minute: number; repeats: boolean };
}

export interface FriendRequest {
  OwnRequests: string[];
  GuardianRequests: string[];
}

export interface RequestItem {
  userId: string;
  userName: string;
  status: "Requested" | "Accepted" | "Rejected";
}

export interface GuardianInfo {
  UserId: string;
  Name: string;
  Gender: string;
  DateOfBirth: string;
  EmailAddress: string;
  PhoneNumber: string;
  DeviceToken: string;
}

export interface GuardianRequest {
  UserId: string;
  Name: string;
  Gender: string;
  DateOfBirth: string;
  EmailAddress: string;
  PhoneNumber: string;
  DeviceToken: string;
}
export interface ConsumptionEvent {
  date: string;
  medicationName: string;
  scheduledTime: number;
  actualTime: number;
  difference: number;
}
