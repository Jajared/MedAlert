import { User } from "firebase/auth";
import { UserInformation } from "../utils/types";

export const userDataConverter = {
  toFirestore(userInformation: UserInformation) {
    return { Name: userInformation.Name, Gender: userInformation.Gender, DateOfBirth: userInformation.DateOfBirth, EmailAddress: userInformation.EmailAddress, PhoneNumber: userInformation.PhoneNumber };
  },
  fromFirestore(snapshot): UserInformation {
    const data = snapshot.data();
    return {
      Name: data.Name,
      Gender: data.Gender,
      DateOfBirth: data.DateOfBirth,
      EmailAddress: data.EmailAddress,
      PhoneNumber: data.PhoneNumber,
    };
  },
};
