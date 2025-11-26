import ViabilityChartPage from "@/app/supporting-data/viability/viability-chart-page";
import { screen, waitFor } from "@testing-library/react";
import {
  API_URL,
  renderWithClient,
  TEST_DATASETS_ENDPOINT,
  SOLR_ENDPOINT,
} from "../utils";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import viabilityData from "../../mocks/data/tests/myo6-viability-data.json";
import datasetData from "../../mocks/data/tests/datasets/9deeb0258d5159af7911eebdc0ba2ed3.json";
import via063Data from "../../mocks/data/tests/viability/myo6-experiment-solr-VIA-063.json";
import via064Data from "../../mocks/data/tests/viability/myo6-experiment-solr-VIA-064.json";
import via065Data from "../../mocks/data/tests/viability/myo6-experiment-solr-VIA-065.json";
import via066Data from "../../mocks/data/tests/viability/myo6-experiment-solr-VIA-066.json";
import via067Data from "../../mocks/data/tests/viability/myo6-experiment-solr-VIA-067.json";

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
        `${TEST_DATASETS_ENDPOINT}/9deeb0258d5159af7911eebdc0ba2ed3.json`,
        (req, res, ctx) => {
          return res(ctx.json(datasetData));
        },
      ),
      rest.get(`${SOLR_ENDPOINT}experiment/select`, (req, res, ctx) => {
        const q = req.url.searchParams.get("q")!;
        if (q.includes("IMPC_VIA_063_001")) {
          return res(ctx.json(via063Data));
        }
        if (q.includes("IMPC_VIA_064_001")) {
          return res(ctx.json(via064Data));
        }
        if (q.includes("IMPC_VIA_065_001")) {
          return res(ctx.json(via065Data));
        }
        if (q.includes("IMPC_VIA_066_001")) {
          return res(ctx.json(via066Data));
        }
        if (q.includes("IMPC_VIA_067_001")) {
          return res(ctx.json(via067Data));
        }
      }),
    );
    const { container } = renderWithClient(<ViabilityChartPage />);
    await waitFor(async () => {
      const tables = await screen.findAllByRole("table");
      return expect(tables.length).toEqual(2);
    });
    await waitFor(() =>
      expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent(
        "Viability data for Myo6 gene",
      ),
    );
    await waitFor(async () => {
      const rows = await screen.findAllByRole("row");
      return expect(rows.length).toEqual(12);
    });
    expect(container).toMatchSnapshot();
  });
});
