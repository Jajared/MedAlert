import React from "react";
import renderer from "react-test-renderer";

import PatientMedicationItem from "../PatientMedicationItem";

describe("<PatientMedicationItem/>", () => {
  it("has 3 child", () => {
    const tree = renderer.create(<PatientMedicationItem />).toJSON();
    expect(tree.children.length).toBe(3);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<PatientMedicationItem />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
