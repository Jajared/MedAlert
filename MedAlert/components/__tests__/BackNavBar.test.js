import { render, screen, fireEvent } from "@testing-library/react-native";
import BackNavBar from "../BackNavBar";
import { expect, jest, test } from "@jest/globals";

const navigationObject = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe("BackNavBar", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<BackNavBar navigation={navigationObject} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders correctly with title", () => {
    const { toJSON } = render(<BackNavBar navigation={navigationObject} title="Test" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
