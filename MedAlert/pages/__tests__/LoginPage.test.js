import React from "react";
import renderer from "react-test-renderer";

import LoginPage from "../LoginPage";

describe("<LoginPage/>", () => {
  it("has 8 child", () => {
    const tree = renderer.create(<LoginPage />).toJSON();
    expect(tree.children.length).toBe(8);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<LoginPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
