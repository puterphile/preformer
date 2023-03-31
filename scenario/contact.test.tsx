import React from "react";
import { describe, expect, it } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { yup, usePreformer } from "../dist";

const schema = yup.object({
  email: yup.string().email(),
  message: yup.string().min(4),
});

function Contact() {
  const [ref, { exception }] = usePreformer(schema, (e, data) => {
    console.log("Contact submission successed.", data);
  });

  return (
    <form ref={ref}>
      {!!exception && <span aria-label="exception">{exception.message}</span>}
      <input type="text" aria-label="email" name="email" />
      <input type="text" aria-label="message" name="message" />
      <input type="submit" aria-label="submit" value="submit" />
    </form>
  );
}

describe("contact form validation", async () => {
  it("should render the application", async () => {
    const component = render(<Contact />);
    expect(component).toBeDefined();
    expect(await component.findByLabelText("submit")).toBeDefined();
    expect(await component.findByLabelText("message")).toBeDefined();
    expect(await component.findByLabelText("email")).toBeDefined();
  });

  it("should validate form's submission", async () => {
    const component = render(<Contact />);
    fireEvent.change(await component.findByLabelText("email"), {
      target: { value: "email@gmail.com" },
    });
    fireEvent.change(await component.findByLabelText("message"), {
      target: { value: "Hello, World" },
    });

    await act(async () =>
      fireEvent.click(await component.findByLabelText("submit"))
    );

    expect(await component.queryByLabelText("exception")).toBeNull();
  });

  it("should throw an exception message because of an invalid input", async () => {
    const component = render(<Contact />);
    fireEvent.change(await component.findByLabelText("email"), {
      target: { value: "invalid email" },
    });

    fireEvent.change(await component.findByLabelText("message"), {
      target: { value: "Hello, World" },
    });

    await act(async () =>
      fireEvent.click(await component.findByLabelText("submit"))
    );

    expect(await component.queryByLabelText("exception")).not.toBeNull();
  }, 4000);
});
