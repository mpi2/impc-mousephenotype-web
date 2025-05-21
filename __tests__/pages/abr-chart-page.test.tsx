import SupportingDataPage from "@/app/supporting-data/supporting-data-page";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient, TEST_DATASETS_ENDPOINT } from "../utils";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import chartData from "../../mocks/data/tests/cib2-abr-chart-data.json";
import ABR002Data from "../../mocks/data/tests/cib2-IMPC_ABR_002_001-datasets.json";
import ABR012Data from "../../mocks/data/tests/cib2-IMPC_ABR_012_001-datasets.json";
import dataset1Data from "../../mocks/data/tests/datasets/5682218200528351d763e190dbb492bc.json";
import dataset2Data from "../../mocks/data/tests/datasets/3f1010ee50e0cd27cc2da4a7f3f7ec42.json";
import dataset3Data from "../../mocks/data/tests/datasets/73fcc7c348c83f166e9feceff9736854.json";
import dataset4Data from "../../mocks/data/tests/datasets/fc0ea562c56ef142a9c6302af51c885c.json";

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
          mgiGeneAccessionId: "MGI:1929293",
          mpTermId: "MP:0004738",
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

describe("ABR Chart page", () => {
  it("renders correctly", async () => {
    window.URL.createObjectURL = jest.fn();
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1929293/MP:0004738/dataset`,
        (req, res, ctx) => {
          return res(ctx.json(chartData));
        },
      ),
    );
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/dataset/find_by_multiple_parameter`,
        (req, res, ctx) => {
          const mgiGeneAccessionId =
            req.url.searchParams.get("mgiGeneAccessionId");
          const parameterStableId =
            req.url.searchParams.get("parameterStableId");
          if (mgiGeneAccessionId === "MGI:1929293") {
            return res(
              ctx.json(
                parameterStableId === "IMPC_ABR_012_001"
                  ? ABR012Data
                  : ABR002Data,
              ),
            );
          }
        },
      ),
    );
    testServer.use(
      rest.get(
        `${TEST_DATASETS_ENDPOINT}/5682218200528351d763e190dbb492bc.json`,
        (req, res, ctx) => {
          return res(ctx.json(dataset1Data));
        },
      ),
    );
    testServer.use(
      rest.get(
        `${TEST_DATASETS_ENDPOINT}/3f1010ee50e0cd27cc2da4a7f3f7ec42.json`,
        (req, res, ctx) => {
          return res(ctx.json(dataset2Data));
        },
      ),
    );
    testServer.use(
      rest.get(
        `${TEST_DATASETS_ENDPOINT}/73fcc7c348c83f166e9feceff9736854.json`,
        (req, res, ctx) => {
          return res(ctx.json(dataset3Data));
        },
      ),
    );
    testServer.use(
      rest.get(
        `${TEST_DATASETS_ENDPOINT}/fc0ea562c56ef142a9c6302af51c885c.json`,
        (req, res, ctx) => {
          return res(ctx.json(dataset4Data));
        },
      ),
    );
    const { container } = renderWithClient(
      <SupportingDataPage initialDatasets={[]} />,
    );
    await waitFor(() =>
      expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent(
        "abnormal auditory brainstem response",
      ),
    );
    await waitFor(async () => {
      expect(screen.getByTestId("back-to-gene-page-link")).toHaveTextContent(
        "Go Back to Cib2",
      );
    });
    expect(container).toMatchSnapshot();
  });
});
