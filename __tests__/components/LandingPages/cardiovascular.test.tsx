import CardiovascularLandingPage from "@/app/cardiovascular/cardiovascular-page";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";
import {
  API_URL,
  renderWithClient,
  TEST_LANDING_PAGE_ENDPOINT,
} from "../../utils";
import { waitFor } from "@testing-library/react";
import pleiotropyData from "../../../mocks/data/tests/landing-pages/phenotype-pleiotropy.json";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
}));

jest.mock("@/components/PublicationsList", () => {
  const PublicationsListMock = () => <div>PublicationsList mock</div>;
  return PublicationsListMock;
});

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

describe("Cardiovascular landing page", () => {
  it("renders correctly", async () => {
    testServer.use(
      rest.get(`${API_URL}/api/v1/publications`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            content: [],
            first: true,
            last: false,
            number: 0,
            numberOfElements: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
          }),
        );
      }),
      rest.get(
        `${TEST_LANDING_PAGE_ENDPOINT}/phenotype_pleiotropy.json`,
        (req, res, ctx) => {
          return res(ctx.json(pleiotropyData));
        },
      ),
    );
    const { container } = renderWithClient(<CardiovascularLandingPage />);
    await waitFor(() => expect(container).toMatchSnapshot());
  });
});
