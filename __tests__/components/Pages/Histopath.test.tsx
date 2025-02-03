import { screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";
import Histopath from "@/app/supporting-data/histopath/[pid]/histopath-chart-page";
import { API_URL, renderWithClient } from "../../utils";
import ascc2Data from "../../../mocks/data/genes/MGI:1922702/histopath.json";
import ascc2SummaryData from "../../../mocks/data/genes/MGI:1922702/summary.json";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));

describe("Histopath page", () => {
  it("provides generic functionality of a normal table", async () => {
    const user = userEvent.setup();
    await mockRouter.push("/data/histopath/MGI:1922702?pid=MGI:1922702");
    renderWithClient(
      <Histopath gene={ascc2SummaryData} histopathologyData={ascc2Data} />,
    );
    await waitFor(() =>
      expect(screen.getByTestId("main-header")).toHaveTextContent(
        "Histopathology data for Ascc2",
      ),
    );

    await waitFor(async () => {
      const rows = await screen.findAllByRole("row");
      return expect(rows.length).toEqual(12);
    });
    expect(await screen.findByTestId("top-last-page-btn")).toHaveTextContent(
      "14",
    );
    const searchBox = screen.getByRole("textbox", {
      name: "Filter by parameters",
    });
    await user.type(searchBox, "Brain");
    let rows = await screen.findAllByRole("row");
    return expect(rows.length).toEqual(6);
  });

  it("should filter by anatomy term if is specified in a query param", async () => {
    const user = userEvent.setup();
    const replaceSpy = jest.spyOn(mockRouter, "replace");
    await mockRouter.push(
      "/data/histopath/MGI:1922702?pid=MGI:1922702&anatomy=heart",
    );
    renderWithClient(
      <Histopath gene={ascc2SummaryData} histopathologyData={ascc2Data} />,
    );
    await waitFor(() =>
      expect(screen.getByTestId("main-header")).toHaveTextContent(
        "Histopathology data for Ascc2",
      ),
    );
    await waitFor(async () => {
      const rows = await screen.findAllByRole("row");
      return expect(rows.length).toEqual(6);
    });
    expect(screen.getByTestId("anatomy-badge")).toBeInTheDocument();
    await user.click(screen.getByTestId("anatomy-badge"));
    expect(replaceSpy).toBeCalled();
  });
});
