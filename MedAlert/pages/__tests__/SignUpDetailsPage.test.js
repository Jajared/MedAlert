import React from "react";
import renderer from "react-test-renderer";

import SignUpDetailsPage from "../SignUpDetailsPage";

describe("<SignUpDetailsPage/>", () => {
  it("has 2 child", () => {
    const tree = renderer.create(<SignUpDetailsPage />).toJSON();
    expect(tree.children.length).toBe(2);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<SignUpDetailsPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
