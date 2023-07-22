import { render, screen, fireEvent } from "@testing-library/react-native";
import SearchItem from "../SearchItem";
import { expect, jest, test } from "@jest/globals";

jest.mock("expo-font");
jest.mock("expo-asset");

const navigationObject = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const testItem = {
  product_name: "Test Product",
  manufacturer: "Test Manufacturer",
  dosage_form: "Test Dosage Form",
};

describe("SearchItem", () => {
  // Check if renders correctly
  it("renders correctly", () => {
    const tree = render(<SearchItem navigation={navigationObject} item={testItem} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // Check number of children
  it("has 3 children", () => {
    render(<SearchItem navigation={navigationObject} item={testItem} />);
    expect(screen.getByTestId("SearchItem").children.length).toBe(3);
  });
  // Check if navigates to search item page when pressed
  it("Navigates to search item page", () => {
    render(<SearchItem navigation={navigationObject} item={testItem} />);
    fireEvent.press(screen.getByTestId("SearchItem"));
    expect(navigationObject.navigate).toBeCalledWith("Search Medication Item", { medicationDetails: testItem });
  });
});
