import { render, screen, fireEvent } from "@testing-library/react-native";
import HomeNavBar from "../HomeNavBar";
import { expect, jest, test } from "@jest/globals";

jest.mock("expo-font");
jest.mock("expo-asset");

const navigationObject = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe("HomeNavBar", () => {
  // Check if renders correctly
  it("renders correctly", () => {
    const tree = render(<HomeNavBar navigation={navigationObject} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // Check number of children
  it("has 3 children", () => {
    render(<HomeNavBar navigation={navigationObject} />);
    expect(screen.getByTestId("HomeNavBar").children.length).toBe(3);
  });
  // Check if add button works
  it("Successfully navigate to add medication", () => {
    render(<HomeNavBar navigation={navigationObject} />);
    fireEvent.press(screen.getByTestId("AddButton"));
    expect(navigationObject.navigate).toBeCalledWith("Add Medication Type");
  });
});
