import { render, screen } from "@testing-library/react";
import SexCell from "@/components/SmartTable/Cells/Sex";

describe("Sexes cell component", () => {
  it("renders the right icon if the specified field is female", async () => {
    const data = { sex: "female" };
    render(<SexCell value={data} field="sex" />);
    const icons = await screen.findAllByTestId("sex-icon");
    expect(icons.length).toEqual(1);
    expect(icons[0].childNodes[0]).toHaveClass("fa-venus");
  });
});
