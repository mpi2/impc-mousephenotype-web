import { screen, waitFor } from "@testing-library/react";
import EmbryoLandingPage from "@/app/embryo/embryo-page";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";
import { renderWithClient, TEST_LANDING_PAGE_ENDPOINT } from "../../utils";
import embryoData from "../../../mocks/data/tests/landing-pages/embryo.json";
import pubsData from "../../../mocks/data/tests/publications-page/all-pubs-data.json";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
}));

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

jest.mock("@/components/PublicationsList", () => {
  const PublicationsListMock = () => <div>PublicationsList mock</div>;
  return PublicationsListMock;
});

jest.mock("@nivo/heatmap", () => {
  const ResponsiveHeatmapMock = () => <div>ResponsiveHeatmap mock</div>;
  return {
    ResponsiveHeatMap: ResponsiveHeatmapMock,
  };
});

describe("Embryo landing page", () => {
  it("renders correctly", async () => {
    testServer.use(
      rest.get(
        `${TEST_LANDING_PAGE_ENDPOINT}/embryo_landing.json`,
        (_, res, ctx) => {
          return res(ctx.json(embryoData));
        },
      ),
      rest.get(
        "https://www.ebi.ac.uk/mi/impc/publication-service/data/api/v1/publications",
        (_, res, ctx) => {
          return res(ctx.json(pubsData));
        },
      ),
    );
    const { container } = renderWithClient(<EmbryoLandingPage />);
    await waitFor(async () => {
      const tables = await screen.findAllByRole("table");
      return expect(tables.length).toEqual(2);
    });
    await waitFor(() => expect(container).toMatchSnapshot());
  });
});
