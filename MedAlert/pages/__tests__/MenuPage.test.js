import { render, screen, fireEvent } from "@testing-library/react-native";
import MenuPage from "../MenuPage";
import { expect, jest, test } from "@jest/globals";

jest.mock("expo-font");
jest.mock("expo-asset");

const navigationObject = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe("MenuPage", () => {
  // Check if renders correctly
  it("renders correctly", () => {
    const tree = render(<MenuPage navigation={navigationObject} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // Check number of children
  it("has 4 children", () => {
    render(<MenuPage navigation={navigationObject} />);
    expect(screen.getByTestId("MenuPage").children.length).toBe(4);
  });
  // Update account button is pressed
  it("Forget password button is pressed", () => {
    render(<MenuPage navigation={navigationObject} />);
    fireEvent.press(screen.getByTestId("UpdateAccountButton"));
    expect(navigationObject.navigate).toHaveBeenCalled();
  });
  // Saved guardian button is pressed
  it("Saved guardian button is pressed", () => {
    render(<MenuPage navigation={navigationObject} />);
    fireEvent.press(screen.getByTestId("GuardianButton"));
    expect(navigationObject.navigate).toHaveBeenCalled();
  });
  // Medication database button is pressed
  it("Medication database is pressed", () => {
    render(<MenuPage navigation={navigationObject} />);
    fireEvent.press(screen.getByTestId("MedicationDatabaseButton"));
    expect(navigationObject.navigate).toHaveBeenCalled();
  });
  // Logout button is pressed
  it("Logout button is pressed", () => {
    const onSignOut = jest.fn();
    render(<MenuPage navigation={navigationObject} onSignOut={onSignOut} />);
    fireEvent.press(screen.getByTestId("LogoutButton"));
    expect(onSignOut).toHaveBeenCalled();
    expect(navigationObject.navigate).toHaveBeenCalled();
  });
  // Help button is pressed
  it("Help button is pressed", () => {
    render(<MenuPage navigation={navigationObject} />);
    fireEvent.press(screen.getByTestId("HelpButton"));
    expect(navigationObject.navigate).toHaveBeenCalled();
  });
  // About button is pressed
  it("About button is pressed", () => {
    render(<MenuPage navigation={navigationObject} />);
    fireEvent.press(screen.getByTestId("AboutButton"));
    expect(navigationObject.navigate).toHaveBeenCalled();
  });
});
