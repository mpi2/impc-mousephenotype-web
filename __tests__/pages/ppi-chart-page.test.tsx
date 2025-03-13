import SupportingDataPage from "@/app/supporting-data/supporting-data-page";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient } from "../utils";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import chartData from "../../mocks/data/tests/myo-ppi-chart-data.json";
import dataset1Data from "../../mocks/data/tests/datasets/25de380279fe66e5cc7b132c9a6c05bb.json";
import dataset2Data from "../../mocks/data/tests/datasets/9875b568ba425f24dbefb073118423c7.json";
import dataset3Data from "../../mocks/data/tests/datasets/64d496cef51d3d02be1cd6332ed69389.json";
import dataset4Data from "../../mocks/data/tests/datasets/fb6573b35b0a77cba03c0ce9121aa017.json";
import dataset5Data from "../../mocks/data/tests/datasets/1c9c88cff10b0482e65de209f7d3e0c6.json";

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
          mpTermId: "MP:0009142",
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

describe("PPI Chart page", () => {
  it("renders correctly", async () => {
    window.URL.createObjectURL = jest.fn();
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:104785/MP:0009142/dataset/`,
        (req, res, ctx) => {
          return res(ctx.json(chartData));
        },
      ),
    );
    testServer.use(
      rest.get(
        "https://impc-datasets.s3.eu-west-2.amazonaws.com/statistical-datasets/dr22.1/25de380279fe66e5cc7b132c9a6c05bb.json",
        (req, res, ctx) => {
          return res(ctx.json(dataset1Data));
        },
      ),
    );
    testServer.use(
      rest.get(
        "https://impc-datasets.s3.eu-west-2.amazonaws.com/statistical-datasets/dr22.1/9875b568ba425f24dbefb073118423c7.json",
        (req, res, ctx) => {
          return res(ctx.json(dataset2Data));
        },
      ),
    );
    testServer.use(
      rest.get(
        "https://impc-datasets.s3.eu-west-2.amazonaws.com/statistical-datasets/dr22.1/64d496cef51d3d02be1cd6332ed69389.json",
        (req, res, ctx) => {
          return res(ctx.json(dataset3Data));
        },
      ),
    );
    testServer.use(
      rest.get(
        "https://impc-datasets.s3.eu-west-2.amazonaws.com/statistical-datasets/dr22.1/fb6573b35b0a77cba03c0ce9121aa017.json",
        (req, res, ctx) => {
          return res(ctx.json(dataset4Data));
        },
      ),
    );
    testServer.use(
      rest.get(
        "https://impc-datasets.s3.eu-west-2.amazonaws.com/statistical-datasets/dr22.1/1c9c88cff10b0482e65de209f7d3e0c6.json",
        (req, res, ctx) => {
          return res(ctx.json(dataset5Data));
        },
      ),
    );
    const { container } = renderWithClient(
      <SupportingDataPage initialDatasets={[]} />,
    );
    await waitFor(() =>
      expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent(
        "decreased prepulse inhibition",
      ),
    );
    expect(container).toMatchSnapshot();
  });
});
