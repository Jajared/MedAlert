import { render, screen, fireEvent } from "@testing-library/react-native";
import BackNavBar from "../BackNavBar";
import { expect, jest, test } from "@jest/globals";

jest.mock("expo-font");
jest.mock("expo-asset");

const navigationObject = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe("BackNavBar", () => {
  // Check if the component renders correctly
  it("renders correctly", () => {
    const tree = render(<BackNavBar title="Test" navigation={navigationObject} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // Check number of children
  it("has 2 children", () => {
    render(<BackNavBar title="Test" navigation={navigationObject} />);
    expect(screen.getByTestId("BackNavBar").children.length).toBe(2);
  });
  // Check if back button works
  it("Back button works", () => {
    render(<BackNavBar title="Test" navigation={navigationObject} />);
    fireEvent.press(screen.getByTestId("BackButton"));
    expect(navigationObject.goBack).toHaveBeenCalled();
  });
});
