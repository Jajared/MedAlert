import React from "react";
import renderer from "react-test-renderer";

import AboutPage from "../AboutPage";

describe("<AboutPage/>", () => {
  it("has 2 child", () => {
    const tree = renderer.create(<AboutPage />).toJSON();
    expect(tree.children.length).toBe(2);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<AboutPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
