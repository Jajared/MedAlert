import React from "react";
import renderer from "react-test-renderer";

import DatePicker from "../DatePicker";

describe("<DatePicker/>", () => {
  it("has 3 child", () => {
    const tree = renderer.create(<DatePicker />).toJSON();
    expect(tree.children.length).toBe(3);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<DatePicker />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
