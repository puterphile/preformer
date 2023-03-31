import React from "react";
import { describe, expect, it } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { yup, usePreformer } from "../dist";

const schema = yup.object({
  order: yup.array().of(yup.string()),
});

function Order() {
  const [ref, { exception }] = usePreformer(schema, (e, data) => {
    console.log("Order submission successed.", data);
  });

  return (
    <form ref={ref}>
      {!!exception && <span aria-label="exception">{exception.message}</span>}
      <input type="checkbox" aria-label="soda" name="order" value="soda" />
      <input type="checkbox" aria-label="pizza" name="order" value="pizza" />
      <input type="submit" aria-label="submit" value="submit" />
    </form>
  );
}

describe("order form validation", async () => {
  it("should render the application", async () => {
    const component = render(<Order />);
    expect(component).toBeDefined();
    expect(await component.findByLabelText("submit")).toBeDefined();
    expect(await component.findByLabelText("pizza")).toBeDefined();
    expect(await component.findByLabelText("soda")).toBeDefined();
  });

  it("should validate form's submission", async () => {
    const component = render(<Order />);
    fireEvent.click(await component.findByLabelText("soda"));
    fireEvent.click(await component.findByLabelText("pizza"));

    await act(async () =>
      fireEvent.click(await component.findByLabelText("submit"))
    );

    expect(await component.queryByLabelText("exception")).toBeNull();
  });
});
