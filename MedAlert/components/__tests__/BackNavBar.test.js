import React from "react";
import renderer from "react-test-renderer";

import BackNavBar from "../BackNavBar";

describe("<BackNavBar />", () => {
  it("has 2 child", () => {
    const tree = renderer.create(<BackNavBar />).toJSON();
    expect(tree.children.length).toBe(2);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<BackNavBar />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
