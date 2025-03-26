import LateAdultLandingPage from "@/app/late-adult-data/late-adult-page";
import { renderWithClient } from "../../utils";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";
import lateAdultData from "../../../mocks/data/tests/landing-pages/late-adult.json";
import { screen, waitFor } from "@testing-library/react";

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
}));

describe("Late Adult landing page", () => {
  it("renders correctly", async () => {
    testServer.use(
      rest.get(
        "https://impc-datasets.s3.eu-west-2.amazonaws.com/landing-page-data/dr22.1/late_adult_landing/procedure_level_data.json",
        (_, res, ctx) => {
          return res(ctx.json(lateAdultData));
        },
      ),
    );
    const { container } = renderWithClient(<LateAdultLandingPage />);
    await waitFor(async () => {
      const tables = await screen.findAllByTestId("late-adult-heatmap");
      return expect(tables.length).toEqual(1);
    });
    expect(container).toMatchSnapshot();
  });
});
