import SupportingDataPage from "@/app/supporting-data/supporting-data-page";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient, TEST_DATASETS_ENDPOINT } from "../utils";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import chartData from "../../mocks/data/tests/myo6-abnomal-startle-reflex.json";
import datasetData from "../../mocks/data/tests/datasets/5e7bcb3efa98f7fcaa282f9a3e4c4a59.json";

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
    useSearchParams: jest.fn().mockImplementation(
      () =>
        new URLSearchParams({
          mgiGeneAccessionId: "MGI:104785",
          mpTermId: "MP:0001486",
        }),
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

describe("Categorical Chart page", () => {
  it("renders correctly", async () => {
    window.URL.createObjectURL = jest.fn();
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:104785/MP:0001486/dataset`,
        (req, res, ctx) => {
          return res(ctx.json(chartData));
        },
      ),
    );
    testServer.use(
      rest.get(
        `${TEST_DATASETS_ENDPOINT}/5e7bcb3efa98f7fcaa282f9a3e4c4a59.json`,
        (req, res, ctx) => {
          return res(ctx.json(datasetData));
        },
      ),
    );
    const { container } = renderWithClient(
      <SupportingDataPage initialDatasets={[]} />,
    );
    await waitFor(() =>
      expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent(
        "abnormal startle reflex",
      ),
    );
    expect(container).toMatchSnapshot();
  });
});
