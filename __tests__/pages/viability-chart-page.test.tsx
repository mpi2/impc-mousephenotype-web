import ViabilityChartPage from "@/app/supporting-data/viability/viability-chart-page";
import { screen, waitFor } from "@testing-library/react";
import { API_URL, renderWithClient } from "../utils";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import viabilityData from "../../mocks/data/tests/myo6-viability-data.json";
import datasetData from "../../mocks/data/tests/datasets/9deeb0258d5159af7911eebdc0ba2ed3.json";

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

jest.mock("next/navigation", () => {
  const routerMock = {
    back: jest.fn(),
    push: jest.fn(),
  };
  return {
    useRouter: jest.fn().mockImplementation(() => routerMock),
    useSearchParams: jest
      .fn()
      .mockImplementation(
        () => new URLSearchParams({ mgiGeneAccessionId: "MGI:104785" }),
      ),
    usePathname: jest.fn(),
    useParams: jest.fn().mockImplementation(() => ({})),
  };
});

jest.mock("framer-motion", () => {
  const FakeTransition = jest
    .fn()
    .mockImplementation(({ children }) => children);
  const FakeAnimatePresence = jest
    .fn()
    .mockImplementation(({ children }) => (
      <FakeTransition>{children}</FakeTransition>
    ));
  const motion = {
    tr: jest.fn().mockImplementation(({ children }) => <tr>{children}</tr>),
  };
  return {
    __esModule: true,
    motion,
    AnimatePresence: FakeAnimatePresence,
    default: jest.fn(),
  };
});

describe("Viability chart page", () => {
  it("renders correctly", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:104785/dataset/viability`,
        (req, res, ctx) => {
          return res(ctx.json(viabilityData));
        },
      ),
      rest.get(
        `https://impc-datasets.s3.eu-west-2.amazonaws.com/statistical-datasets/dr22.1/9deeb0258d5159af7911eebdc0ba2ed3.json`,
        (req, res, ctx) => {
          return res(ctx.json(datasetData));
        },
      ),
    );
    const { container } = renderWithClient(<ViabilityChartPage />);
    await waitFor(async () => {
      const rows = await screen.findAllByRole("row");
      return expect(rows.length).toEqual(3);
    });
    await waitFor(() =>
      expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent(
        "Viability data for Myo6 gene",
      ),
    );
    expect(container).toMatchSnapshot();
  });
});
