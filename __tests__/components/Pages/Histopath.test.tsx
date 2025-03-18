import { screen, waitFor } from "@testing-library/react";
import Histopath from "@/app/supporting-data/histopath/[pid]/histopath-chart-page";
import { API_URL, renderWithClient } from "../../utils";
import ascc2Data from "../../../mocks/data/tests/ascc2-histopath-data.json";
import ascc2SummaryData from "../../../mocks/data/genes/MGI:1922702/summary.json";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { useSearchParams } from "next/navigation";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";

jest.mock("next/navigation", () => {
  const originalModule = jest.requireActual("next/navigation");
  const { useRouter } = jest.requireActual("next-router-mock");
  const usePathname = jest.fn().mockImplementation(() => {
    const router = useRouter();
    return router.pathname;
  });
  return {
    __esModule: true,
    ...originalModule,
    useRouter: jest.fn().mockImplementation(useRouter),
    usePathname,
    useParams: jest.fn().mockImplementation(() => ({ pid: "MGI:1922702" })),
    useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  };
});

describe("Histopath page", () => {
  it("provides generic functionality of a normal table", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1922702/summary`,
        (req, res, ctx) => {
          return res(ctx.json(ascc2SummaryData));
        },
      ),
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1922702/histopathology`,
        (req, res, ctx) => {
          return res(ctx.json(ascc2Data));
        },
      ),
    );
    const user = userEvent.setup();
    // await mockRouter.push("/data/histopath/MGI:1922702?pid=MGI:1922702");
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
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1922702/summary`,
        (req, res, ctx) => {
          return res(ctx.json(ascc2SummaryData));
        },
      ),
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1922702/histopathology`,
        (req, res, ctx) => {
          return res(ctx.json(ascc2Data));
        },
      ),
    );
    // @ts-ignore
    useSearchParams.mockImplementation(
      () => new URLSearchParams({ anatomy: "heart" }),
    );
    const user = userEvent.setup();
    const replaceSpy = jest.spyOn(mockRouter, "replace");
    await mockRouter.push(
      "/supporting-data/histopath/MGI:1922702?pid=MGI:1922702&anatomy=heart",
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

  it("should display a modal to view tissue details", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1922702/summary`,
        (req, res, ctx) => {
          return res(ctx.json(ascc2SummaryData));
        },
      ),
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1922702/histopathology`,
        (req, res, ctx) => {
          return res(ctx.json(ascc2Data));
        },
      ),
    );
    // @ts-ignore
    useSearchParams.mockImplementation(
      () => new URLSearchParams({ anatomy: "heart" }),
    );
    const user = userEvent.setup();
    //const replaceSpy = jest.spyOn(mockRouter, "replace");
    await mockRouter.push(
      "/supporting-data/histopath/MGI:1922702?pid=MGI:1922702&anatomy=heart",
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
    await user.click(
      screen.getByRole("link", {
        name: "Sections from the heart revealed left ventricular ...",
      }),
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
