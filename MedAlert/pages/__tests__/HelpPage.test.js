import React from "react";
import renderer from "react-test-renderer";

import HelpPage from "../HelpPage";

describe("<HelpPage/>", () => {
  it("has 2 child", () => {
    const tree = renderer.create(<HelpPage />).toJSON();
    expect(tree.children.length).toBe(2);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<HelpPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
