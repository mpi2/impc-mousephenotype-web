import { render, screen } from "@testing-library/react";
import SignificantPValueCell from "@/components/SmartTable/Cells/SignificantPValue";

describe("Significant PValue cell component", () => {
  it("renders a link correctly (signficant phenotypes table)", () => {
    const data = {
      pValue: 0.000001,
      mgiGeneAccessionId: "MGI:000000",
      id: "ID-0",
    };
    render(<SignificantPValueCell value={data} field="pValue" />);
    expect(screen.queryByTestId("p-value")).toHaveTextContent("1x10-6");
  });

  it("links to the pain publication page if is related to PWG", () => {
    const data = {
      pValue: 0.000001,
      mgiGeneAccessionId: "MGI:000000",
      id: "ID-0",
      projectName: "PWG",
    };
    render(<SignificantPValueCell value={data} field="pValue" />);
  });

  it("renders a link correctly if the prop mpTermIdKey is specified", () => {
    const data = {
      pValue: 0.000001,
      mgiGeneAccessionId: "MGI:000000",
      phenotypeId: "ID-0",
    };
    render(<SignificantPValueCell value={data} field="pValue" />);
  });

  it("renders a N/A if is not a valid value", () => {
    const data = { pValue: null, mgiGeneAccessionId: "MGI:000000", id: "ID-0" };
    render(<SignificantPValueCell value={data} field="pValue" />);
    expect(screen.queryByTestId("p-value")).toHaveTextContent("N/A");
  });
});
