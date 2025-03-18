import PublicationsPage from "@/app/publications/publications-page";
import { renderWithClient } from "../utils";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import aggregationData from "../../mocks/data/tests/publications-page/aggregation-data.json";
import allPubsData from "../../mocks/data/tests/publications-page/all-pubs-data.json";
import consortiumPubsData from "../../mocks/data/tests/publications-page/consortium-pubs-data.json";
import { waitFor, screen } from "@testing-library/react";

const AGGREGATION_ENDPOINT =
  "https://www.ebi.ac.uk/mi/impc/publication-service/data/api/v1/publications/aggregation";
const ALL_PUBS_ENDPOINT =
  "https://www.ebi.ac.uk/mi/impc/publication-service/data/api/v1/publications";
const CONSORTIUM_PUBS_ENDPOINT =
  "https://www.ebi.ac.uk/mi/impc/publication-service/data/api/v1/publications/by_consortium_paper";

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

describe("Publications page", () => {
  it("renders correctly", async () => {
    testServer.use(
      rest.get(AGGREGATION_ENDPOINT, (_, res, ctx) => {
        return res(ctx.json(aggregationData));
      }),
      rest.get(ALL_PUBS_ENDPOINT, (_, res, ctx) => {
        return res(ctx.json(allPubsData));
      }),
      rest.get(CONSORTIUM_PUBS_ENDPOINT, (_, res, ctx) => {
        return res(ctx.json(consortiumPubsData));
      }),
    );
    const { container } = renderWithClient(<PublicationsPage />);
    await waitFor(() => {
      expect(screen.getAllByRole("table").length).toBe(2);
    });
    expect(container).toMatchSnapshot();
  });
});
