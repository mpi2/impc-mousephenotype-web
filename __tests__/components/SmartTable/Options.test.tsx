import { render, screen } from "@testing-library/react";
import OptionsCell from "@/components/SmartTable/Cells/Options";

describe("Options cell component", () => {
  it("renders a link correctly", () => {
    const data = { tag: "below5" };
    render(
      <OptionsCell
        value={data}
        field="tag"
        options={{ below5: "< 5%", above95: "> 95%" }}
      />,
    );
    const cell = screen.queryByTestId("options-cell");
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveTextContent("< 5%");
  });
});
