import SupportingDataPage from "@/app/supporting-data/supporting-data-page";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient } from "../utils";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import chartData from "../../mocks/data/tests/cep43-indirect-calorimetry-data.json";
import datasetData from "../../mocks/data/tests/datasets/04170d1f0c2aeb927449078c656352a2.json";

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
          mgiGeneAccessionId: "MGI:1922546",
          alleleAccessionId: "MGI:5548654",
          zygosity: "heterozygote",
          parameterStableId: "IMPC_CAL_005_001",
          pipelineStableId: "HMGU_001",
          procedureStableId: "IMPC_CAL_003",
          phenotypingCentre: "HMGU",
          metadataGroup: "593a2d0df1def577e4a39c6de7075687",
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

describe("Timeseries Chart page", () => {
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
            mgiGeneAccessionId === "MGI:1922546" &&
            parameterStableId === "IMPC_CAL_005_001"
          ) {
            return res(ctx.json(chartData));
          }
        },
      ),
    );
    testServer.use(
      rest.get(
        "https://impc-datasets.s3.eu-west-2.amazonaws.com/statistical-datasets/dr22.1/04170d1f0c2aeb927449078c656352a2.json",
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
        "Indirect Calorimetry",
      ),
    );
    expect(container).toMatchSnapshot();
  });
});
