import React from "react";
import renderer from "react-test-renderer";

import HomeNavBar from "../HomeNavBar";

describe("<HomeNavBar/>", () => {
  it("has 4 child", () => {
    const tree = renderer.create(<HomeNavBar />).toJSON();
    expect(tree.children.length).toBe(4);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<HomeNavBar />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
