import BodyWeightChartPage from "@/app/supporting-data/bodyweight/bodyweight-chart-page";
import { screen, waitFor } from "@testing-library/react";
import { API_URL, renderWithClient } from "../utils";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import bodyWeightData from "../../mocks/data/tests/myo6-bodyweight-data.json";
import datasetData1 from "../../mocks/data/tests/datasets/c837b482854713419a2b4563862f394e.json";
import datasetData2 from "../../mocks/data/tests/datasets/70a966ba779881114975a76f03898a3d.json";

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

jest.mock("motion/react", () => {
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
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/bodyweight/byMgiGeneAccId`,
        (req, res, ctx) => {
          const mgiGeneAccessionId = req.url.searchParams.get("mgiGeneAccId");
          if (mgiGeneAccessionId === "MGI:104785") {
            return res(ctx.json(bodyWeightData));
          }
        },
      ),
    );
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/c837b482854713419a2b4563862f394e/dataset`,
        (req, res, ctx) => {
          return res(ctx.json(datasetData1));
        },
      ),
    );
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/70a966ba779881114975a76f03898a3d/dataset`,
        (req, res, ctx) => {
          return res(ctx.json(datasetData2));
        },
      ),
    );
    const { container } = renderWithClient(<BodyWeightChartPage />);
    await waitFor(async () => {
      const rows = await screen.findAllByRole("row");
      return expect(rows.length).toEqual(3);
    });
    await waitFor(async () =>
      expect(
        await screen.findByTestId("body-weight-canvas"),
      ).toBeInTheDocument(),
    );
    expect(container).toMatchSnapshot();
  });
});
