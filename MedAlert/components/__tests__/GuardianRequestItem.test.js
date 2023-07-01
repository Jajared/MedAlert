import React from "react";
import renderer from "react-test-renderer";

import GuardianRequestItem from "../GuardianRequestItem";

describe("<GuardianRequestItem/>", () => {
  it("has 3 child", () => {
    const tree = renderer.create(<GuardianRequestItem />).toJSON();
    expect(tree.children.length).toBe(3);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<GuardianRequestItem />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
