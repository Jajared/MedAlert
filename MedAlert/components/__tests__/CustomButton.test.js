import React from "react";
import renderer from "react-test-renderer";

import CustomButton from "../CustomButton";

describe("<CustomButton />", () => {
  it("has 1 child", () => {
    const tree = renderer.create(<CustomButton />).toJSON();
    expect(tree.children.length).toBe(1);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<CustomButton />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
