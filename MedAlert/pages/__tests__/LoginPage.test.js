import { render, screen, fireEvent } from "@testing-library/react-native";
import LoginPage from "../LoginPage";
import { expect, jest, test } from "@jest/globals";

jest.mock("expo-font");
jest.mock("expo-asset");

const navigationObject = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe("AboutPage", () => {
  // Check if renders correctly
  it("renders correctly", () => {
    const tree = render(<LoginPage navigation={navigationObject} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // Check number of children
  it("has 9 children", () => {
    render(<LoginPage navigation={navigationObject} />);
    expect(screen.getByTestId("LoginPage").children.length).toBe(9);
  });
  // Forget password button is pressed
  it("Forget password button is pressed", () => {
    render(<LoginPage navigation={navigationObject} />);
    fireEvent.press(screen.getByTestId("ForgetButton"));
    expect(navigationObject.navigate).toHaveBeenCalled();
  });
  // Sign up button is pressed
  it("Sign up button is pressed", () => {
    render(<LoginPage navigation={navigationObject} />);
    fireEvent.press(screen.getByTestId("SignUpButton"));
    expect(navigationObject.navigate).toHaveBeenCalled();
  });
});
