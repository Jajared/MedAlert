import React from "react";
import renderer from "react-test-renderer";

import GuardianInfoItem from "../GuardianInfoItem";

describe("<GuardianInfoItem />", () => {
  it("has 3 child", () => {
    const tree = renderer.create(<GuardianInfoItem />).toJSON();
    expect(tree.children.length).toBe(5);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<GuardianInfoItem />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
