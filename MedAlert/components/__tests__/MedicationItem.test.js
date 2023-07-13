import { render, screen, fireEvent } from "@testing-library/react-native";
import MedicationItem from "../MedicationItem";
import { expect, jest, test } from "@jest/globals";

jest.mock("expo-font");
jest.mock("expo-asset");

const navigationObject = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const testScheduledItem = {
  Name: "test",
  Purpose: "test",
  Type: "test",
  Instructions: {
    TabletsPerIntake: 1,
    FrequencyPerDay: 1,
    Specifications: "test",
    FirstDosageTiming: 1,
  },
  Acknowledged: false,
  id: 1,
  notificationId: "test",
};

describe("MedicationItem", () => {
  const acknowledgeReminder = jest.fn();
  const deleteReminder = jest.fn();
  // Check if renders correctly
  it("renders correctly", () => {
    const tree = render(<MedicationItem props={{ item: testScheduledItem }} setAcknowledged={acknowledgeReminder} deleteReminder={deleteReminder} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // Check number of children
  it("has 1 child", () => {
    render(<MedicationItem props={{ item: testScheduledItem }} setAcknowledged={acknowledgeReminder} deleteReminder={deleteReminder} />);
    expect(screen.getByTestId("MedicationItem").children.length).toBe(1);
  });
  // Check if button pressed acknowledges reminder
  it("Acknowledges reminder", () => {
    render(<MedicationItem props={{ item: testScheduledItem }} setAcknowledged={acknowledgeReminder} deleteReminder={deleteReminder} />);
    fireEvent.press(screen.getByTestId("AcknowledgeButton"));
    expect(acknowledgeReminder).toBeCalled();
  });
  // Check if button pressed deletes reminder
  it("Deletes reminder", () => {
    render(<MedicationItem props={{ item: testScheduledItem }} setAcknowledged={acknowledgeReminder} deleteReminder={deleteReminder} />);
    fireEvent.press(screen.getByTestId("DeleteButton"));
    expect(deleteReminder).toBeCalled();
  });
});
