import React from "react";
import renderer from "react-test-renderer";

import SignUpHomePage from "../SignUpHomePage";

describe("<SignUpHomePage/>", () => {
  it("has 2 child", () => {
    const tree = renderer.create(<SignUpHomePage />).toJSON();
    expect(tree.children.length).toBe(2);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<SignUpHomePage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
