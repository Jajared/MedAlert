import { render, screen, fireEvent } from "@testing-library/react-native";
import AboutPage from "../AboutPage";
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
    const tree = render(<AboutPage navigation={navigationObject} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // Check number of children
  it("has 5 children", () => {
    render(<AboutPage navigation={navigationObject} />);
    expect(screen.getByTestId("AboutPage").children.length).toBe(5);
  });
});
