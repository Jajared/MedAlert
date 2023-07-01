import React from "react";
import renderer from "react-test-renderer";

import MenuPage from "../MenuPage";

describe("<MenuPage/>", () => {
  it("has 3 child", () => {
    const tree = renderer.create(<MenuPage />).toJSON();
    expect(tree.children.length).toBe(3);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<MenuPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
