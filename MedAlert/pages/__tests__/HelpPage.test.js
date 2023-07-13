import { render, screen, fireEvent } from "@testing-library/react-native";
import HelpPage from "../HelpPage";
import { expect, jest, test } from "@jest/globals";

jest.mock("expo-font");
jest.mock("expo-asset");

const navigationObject = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe("HelpPage", () => {
  // Check if renders correctly
  it("renders correctly", () => {
    const tree = render(<HelpPage navigation={navigationObject} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // Check number of children
  it("has 5 children", () => {
    render(<HelpPage navigation={navigationObject} />);
    expect(screen.getByTestId("HelpPage").children.length).toBe(5);
  });
});
