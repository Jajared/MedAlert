import { render, screen, fireEvent } from "@testing-library/react-native";
import NextButton from "../NextButton";
import { expect, jest, test } from "@jest/globals";

jest.mock("expo-font");
jest.mock("expo-asset");

describe("NextButton", () => {
  // Check if renders correctly
  it("renders correctly", () => {
    const tree = render(<NextButton />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // Check number of children
  it("has 2 children", () => {
    render(<NextButton />);
    expect(screen.getByTestId("NextButton").children.length).toBe(2);
  });
  // Check onPress function is called when button is pressed
  it("Successfully call onPress", () => {
    const onPress = jest.fn();
    render(<NextButton onPress={onPress} />);
    fireEvent.press(screen.getByTestId("NextButton"));
    expect(onPress).toBeCalled();
  });
});
