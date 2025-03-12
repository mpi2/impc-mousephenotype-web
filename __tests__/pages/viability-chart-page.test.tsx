import ViabilityChartPage from "@/app/supporting-data/viability/viability-chart-page";
import { screen, waitFor } from "@testing-library/react";
import { API_URL, renderWithClient } from "../utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import viabilityData from "../../mocks/data/tests/myo6-viability-data.json";

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

describe("Bodyweight chart page", () => {
  it("renders correctly", async () => {
    server.use(
      rest.get(
        `${API_URL}/api/v1/bodyweight/byMgiGeneAccId`,
        (req, res, ctx) => {
          const mgiGeneAccessionId =
            req.url.searchParams.get("mgiGeneAccessionId");
          if (mgiGeneAccessionId === "MGI:104785") {
            return res(ctx.json(viabilityData));
          }
        },
      ),
    );
    const { container } = renderWithClient(<ViabilityChartPage />);
    await waitFor(async () => {
      const rows = await screen.findAllByRole("row");
      return expect(rows.length).toEqual(3);
    });
    expect(container).toMatchSnapshot();
  });
});
