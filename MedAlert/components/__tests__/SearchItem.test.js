import React from "react";
import renderer from "react-test-renderer";

import SearchItem from "../SearchItem";

describe("<SearchItem/>", () => {
  it("has 3 child", () => {
    const tree = renderer.create(<SearchItem />).toJSON();
    expect(tree.children.length).toBe(3);
  });
  it("renders correctly", () => {
    const tree = renderer.create(<SearchItem />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
