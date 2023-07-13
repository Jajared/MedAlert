import { render, screen, fireEvent } from "@testing-library/react-native";
import GuardianInfoItem from "../GuardianInfoItem";
import { expect, jest, test } from "@jest/globals";

jest.mock("expo-font");
jest.mock("expo-asset");

const navigationObject = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const testGuardianInfo = {
  UserId: "123",
  Name: "test",
  Gender: "male",
  DateOfBirth: "01/01/2000",
  EmailAddress: "test@gmail.com",
  PhoneNumber: "12345678",
  DeviceToken: "12345678",
};

describe("GuardianInfoItem", () => {
  const removeGuardian = jest.fn();
  // Check if renders correctly
  it("renders correctly", () => {
    const tree = render(<GuardianInfoItem navigation={navigationObject} props={{ item: testGuardianInfo }} removeGuardian={removeGuardian} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // Check number of children
  it("has 2 children", () => {
    render(<GuardianInfoItem navigation={navigationObject} props={{ item: testGuardianInfo }} removeGuardian={removeGuardian} />);
    expect(screen.getByTestId("GuardianInfoItem").children.length).toBe(2);
  });
  // Check if navigates to patient medication page when pressed
  it("Navigates to patient medication page", () => {
    render(<GuardianInfoItem navigation={navigationObject} props={{ item: testGuardianInfo }} removeGuardian={removeGuardian} />);
    fireEvent.press(screen.getByTestId("GuardianInfoItem"));
    expect(navigationObject.navigate).toBeCalledWith("Patient Medication", { guardianId: testGuardianInfo.UserId, guardianName: testGuardianInfo.Name });
  });
  // Check if delete modal pops up when remove button is pressed
  it("Delete modal pops up", () => {
    render(<GuardianInfoItem navigation={navigationObject} props={{ item: testGuardianInfo }} removeGuardian={removeGuardian} />);
    fireEvent.press(screen.getByTestId("RemoveButton"));
    expect(screen.getByTestId("DeleteModal")).toBeTruthy();
  });
});
