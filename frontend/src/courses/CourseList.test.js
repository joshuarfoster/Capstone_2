import React from "react";
import { render } from "@testing-library/react";
import Courses from "./CourseList";
import App from "../App"

it("matches snapshot", function () {
  const { asFragment } = render(<App><Courses /></App>);
  expect(asFragment()).toMatchSnapshot();
});