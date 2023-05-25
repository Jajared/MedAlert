import { UserInformation } from "../utils/types";

export const userDataConverter = {
  toFirestore(userInformation: UserInformation) {
    return { ...userInformation };
  },
  fromFirestore(snapshot): UserInformation {
    const data = snapshot.data();
    return {
      Name: data.Name,
      Gender: data.Gender,
      DateOfBirth: data.DateOfBirth,
      EmailAddress: data.EmailAddress,
      PhoneNumber: data.PhoneNumber,
      ProfilePicture: data.ProfilePicture,
    };
  },
};
