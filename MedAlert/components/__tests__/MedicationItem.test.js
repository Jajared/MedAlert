import React from "react";
import renderer from "react-test-renderer";

import MedicationItem from "../MedicationItem";

describe("<MedicationItem/>", () => {
  it("has 3 child", () => {
    const tree = renderer.create(<MedicationItem />).toJSON();
    expect(tree.children.length).toBe(3);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<MedicationItem />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
