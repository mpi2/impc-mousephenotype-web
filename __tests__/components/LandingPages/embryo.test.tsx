import { screen, waitFor } from "@testing-library/react";
import EmbryoLandingPage from "@/app/embryo/embryo-page";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";
import { renderWithClient } from "../../utils";
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

describe("Embryo landing page", () => {
  it("renders correctly", async () => {
    testServer.use(
      rest.get(
        "https://impc-datasets.s3.eu-west-2.amazonaws.com/landing-page-data/dr22.1/embryo_landing.json",
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
