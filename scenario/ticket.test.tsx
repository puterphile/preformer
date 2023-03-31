import React from "react";
import { describe, expect, it } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { yup, usePreformer } from "../dist";

const schema = yup.object({
  username: yup.string(),
  ticket: yup.number().min(1),
});

function Ticket() {
  const [ref, { exception }] = usePreformer(schema, (e, data) => {
    console.log("Ticket submission successed.", data);
  });

  return (
    <form ref={ref}>
      {!!exception && <span aria-label="exception">{exception.message}</span>}
      <input type="text" aria-label="username" name="username" />
      <input type="number" aria-label="ticket" name="ticket" />
      <input type="submit" aria-label="submit" value="submit" />
    </form>
  );
}

describe("ticket form validation", async () => {
  it("should render the application", async () => {
    const component = render(<Ticket />);
    expect(component).toBeDefined();
    expect(await component.findByLabelText("submit")).toBeDefined();
    expect(await component.findByLabelText("ticket")).toBeDefined();
    expect(await component.findByLabelText("username")).toBeDefined();
  });

  it("should validate form's submission", async () => {
    const component = render(<Ticket />);
    fireEvent.change(await component.findByLabelText("username"), {
      target: { value: "username" },
    });

    fireEvent.change(await component.findByLabelText("ticket"), {
      target: { value: 3 },
    });

    await act(async () =>
      fireEvent.click(await component.findByLabelText("submit"))
    );

    expect(await component.queryByLabelText("exception")).toBeNull();
  });
});
