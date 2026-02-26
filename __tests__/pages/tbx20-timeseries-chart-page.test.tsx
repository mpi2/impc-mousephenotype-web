import SupportingDataPage from "@/app/supporting-data/supporting-data-page";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient, TEST_DATASETS_ENDPOINT } from "../utils";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import tbx20DatasetSummary from "../../mocks/data/tests/tbx20-open-field-dataset.json";
import tbxDatasetData from "../../mocks/data/tests/datasets/0bb683babb4780836d0bee3c0afe1034.json";

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

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
          mgiGeneAccessionId: "MGI:1888496",
          alleleAccessionId: "MGI:6277044",
          zygosity: "heterozygote",
          parameterStableId: "IMPC_OFD_045_001",
          pipelineStableId: "UCD_001",
          procedureStableId: "IMPC_OFD_001",
          phenotypingCentre: "UC Davis",
          metadataGroup: "a41f1a21bc519c78a116277740720f96",
        }),
    ),
    usePathname: jest.fn(),
    useParams: jest.fn().mockImplementation(() => ({})),
  };
});

describe("Tbx20 Open field timeseries Chart page", () => {
  it("renders correctly", async () => {
    window.URL.createObjectURL = jest.fn();
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/dataset/find_by_multiple_parameter`,
        (req, res, ctx) => {
          const mgiGeneAccessionId =
            req.url.searchParams.get("mgiGeneAccessionId");
          const parameterStableId =
            req.url.searchParams.get("parameterStableId");
          if (
            mgiGeneAccessionId === "MGI:1888496" &&
            parameterStableId === "IMPC_OFD_045_001"
          ) {
            return res(ctx.json(tbx20DatasetSummary));
          }
        },
      ),
    );
    testServer.use(
      rest.get(
        `${TEST_DATASETS_ENDPOINT}/0bb683babb4780836d0bee3c0afe1034.json`,
        (req, res, ctx) => {
          return res(ctx.json(tbxDatasetData));
        },
      ),
    );
    const { container } = renderWithClient(
      <SupportingDataPage initialDatasets={[]} />,
    );
    await waitFor(() =>
      expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent(
        "Open Field",
      ),
    );
    expect(container).toMatchSnapshot();
  });
});
