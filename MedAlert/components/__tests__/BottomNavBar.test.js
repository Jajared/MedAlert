import React from "react";
import renderer from "react-test-renderer";

import BottomNavBar from "../BottomNavBar";

describe("<BottomNavBar />", () => {
  it("has 4 child", () => {
    const tree = renderer.create(<BottomNavBar />).toJSON();
    expect(tree.children.length).toBe(4);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<BottomNavBar />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
