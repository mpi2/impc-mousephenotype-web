import { render, screen, waitFor } from "@testing-library/react";
import GenePage from "@/app/genes/[pid]/gene-page";
import { QueryClientProvider } from "@tanstack/react-query";
import { API_URL, createTestQueryClient } from "../../utils";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";

import ascc2StatsRes from "../../../mocks/data/tests/gene/ascc2-stats-result-page.json";
import ascc2DatasetFilterRes from "../../../mocks/data/tests/gene/ascc2-dataset-filter.json";
import ascc2PhenHits from "../../../mocks/data/tests/gene/ascc2-phenotype-hits.json";
import ascc2Expression from "../../../mocks/data/tests/gene/ascc2-expression.json";
import ascc2Images from "../../../mocks/data/tests/gene/ascc2-images.json";
import ascc2Histopathology from "../../../mocks/data/tests/gene/ascc2-gene-histopathology.json";
import ascc2Publications from "../../../mocks/data/tests/gene/ascc2-publications.json";
import ascc2Order from "../../../mocks/data/tests/gene/ascc2-order.json";
import externalLinksProviders from "../../../mocks/data/tests/gene/ascc2-external-links-providers.json";
import ascc22ExternalLinks from "../../../mocks/data/tests/gene/ascc2-external-links.json";

type RequestMock = {
  url: string;
  resFn: (req, res, ctx) => Promise<any>;
};

const mockRequestMapper: Array<RequestMock> = [
  {
    url: `${API_URL}/api/v1/genes/statistical-result/filtered/page`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2StatsRes)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/dataset/get_filter_data`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2DatasetFilterRes)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/phenotype-hits`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2PhenHits)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/expression`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2Expression)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/images`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2Images)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/gene_histopathology`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2Histopathology)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/publication`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2Publications)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/order`,
    resFn: (_, res, ctx) => res(ctx.json(ascc2Order)),
  },
  {
    url: `${API_URL}/api/v1/genes/gene_external_links/providers`,
    resFn: (_, res, ctx) => res(ctx.json(externalLinksProviders)),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/disease/json`,
    resFn: (_, res, ctx) => res(ctx.json([])),
  },
  {
    url: `${API_URL}/api/v1/genes/MGI:1922702/gene_external_links`,
    resFn: (_, res, ctx) => res(ctx.json(ascc22ExternalLinks)),
  },
];

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
  useParams: jest.fn().mockImplementation(() => ({ pid: "MGI:1922702" })),
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
  const LayoutGroup = jest
    .fn()
    .mockImplementation(({ children }) => <>{children}</>);
  const motion = {
    a: jest.fn().mockImplementation(({ children }) => <a>{children}</a>),
  };
  return {
    __esModule: true,
    motion,
    AnimatePresence: FakeAnimatePresence,
    default: jest.fn(),
    LayoutGroup,
  };
});

describe("Gene page", () => {
  it("renders correctly", async () => {
    testServer.use(
      ...mockRequestMapper.map(({ url, resFn }) => rest.get(url, resFn)),
    );
    const client = createTestQueryClient();
    const { container } = render(
      <QueryClientProvider client={client}>
        <GenePage
          gene={{ mgiGeneAccessionId: "MGI:1922702", geneSymbol: "Ascc2" }}
          significantPhenotypes={[]}
          orderData={[]}
          expressionData={[]}
          imageData={[]}
          histopathologyData={[]}
          humanDiseasesData={[]}
        />
      </QueryClientProvider>,
    );
    await waitFor(async () => {
      const rows = await screen.findAllByRole("table");
      return expect(rows.length).toEqual(5);
    });
    expect(container).toMatchSnapshot();
  });
});
