import SupportingDataPage from "@/app/supporting-data/supporting-data-page";
import { screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient, TEST_DATASETS_ENDPOINT } from "../utils";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import chartData from "../../mocks/data/tests/1700Rik-preweaning-lethality-data.json";
import dataset1Data from "../../mocks/data/tests/datasets/32dbf8977406a2692e22be3b17f4ff8b.json";
import dataset2Data from "../../mocks/data/tests/datasets/5e0629cf0c49797d9f2f6527086ab9f1.json";
import userEvent from "@testing-library/user-event";

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
          mgiGeneAccessionId: "MGI:1922730",
          mpTermId: "MP:0011110",
        }),
    ),
    usePathname: jest.fn(),
    useParams: jest.fn().mockImplementation(() => ({})),
  };
});

jest.mock("motion/react", () => {
  const FakeTransition = jest
    .fn()
    .mockImplementation(({ children }) => children);
  const FakeAnimatePresence = jest
    .fn()
    .mockImplementation(({ children }) => (
      <FakeTransition>{children}</FakeTransition>
    ));
  const motion = {
    tr: jest
      .fn()
      .mockImplementation(({ children, className }) => (
        <tr className={className}>{children}</tr>
      )),
  };
  return {
    __esModule: true,
    motion,
    AnimatePresence: FakeAnimatePresence,
    default: jest.fn(),
  };
});

describe("Embryo viability chart", () => {
  it("renders correctly", async () => {
    const user = userEvent.setup();
    testServer.use(
      rest.get(
        `${TEST_DATASETS_ENDPOINT}/32dbf8977406a2692e22be3b17f4ff8b.json`,
        (req, res, ctx) => {
          return res(ctx.json(dataset1Data));
        },
      ),
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1922730/MP:0011110/dataset`,
        (req, res, ctx) => {
          return res(ctx.json(chartData));
        },
      ),
    );
    testServer.use(
      rest.get(
        `${TEST_DATASETS_ENDPOINT}/5e0629cf0c49797d9f2f6527086ab9f1.json`,
        (req, res, ctx) => {
          return res(ctx.json(dataset2Data));
        },
      ),
    );
    const { container } = renderWithClient(
      <SupportingDataPage initialDatasets={[]} />,
    );
    await waitFor(() =>
      expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent(
        "preweaning lethality, incomplete penetrance",
      ),
    );
    await waitFor(() =>
      expect(screen.getAllByRole("link")[3]).toHaveTextContent(
        "Go Back to 1700003F12Rik",
      ),
    );
    const dataComparisonTable = screen.getAllByRole("table")[0];
    const rowToSelect = within(dataComparisonTable).getAllByRole("row")[3];
    expect(rowToSelect).toHaveClass("highlighted-row");
    expect(screen.getAllByRole("table").length).toBe(2);
    expect(container).toMatchSnapshot();
  });
});
