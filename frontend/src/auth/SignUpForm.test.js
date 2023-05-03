import React from "react";
import { render } from "@testing-library/react";
import SignUpForm from "./SignUpForm";
import { MemoryRouter } from "react-router";

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});