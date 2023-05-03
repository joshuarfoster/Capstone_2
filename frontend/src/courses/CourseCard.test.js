import React from "react";
import { render } from "@testing-library/react";
import CourseCard from "./CourseCard";
import { MemoryRouter } from "react-router";
import App from "../App"

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <App>
        <CourseCard
            key={1}
            id={1}
            title="Course"
            creatorUsername="teacher"
            about="learn"
        />
        </App>
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

