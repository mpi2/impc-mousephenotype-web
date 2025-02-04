import { render, screen } from "@testing-library/react";
import SignificantSexesCell from "@/components/SmartTable/Cells/SignificantSexes";

describe("Significant sexes cell component", () => {
  it("renders the right icon if only the male pValue is defined", async () => {
    const data = { pValue_male: 1 };
    render(<SignificantSexesCell value={data} />);
    const icons = await screen.findAllByTestId("sex-icon");
    expect(icons.length).toEqual(1);
    expect(icons[0].childNodes[0]).toHaveClass("fa-mars");
  });
});
