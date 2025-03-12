import SupportingDataPage from "@/app/supporting-data/supporting-data-page";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient } from "../utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import chartData from "../../mocks/data/tests/myo6-decreased-body-length.json";

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
          mpTermId: "MP:0001258",
        }),
    ),
    usePathname: jest.fn(),
    useParams: jest.fn().mockImplementation(() => ({})),
  };
});

describe("Unidimensional Chart page", () => {
  it("renders correctly", async () => {
    window.URL.createObjectURL = jest.fn();
    server.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:104785/MP:0001258/dataset/`,
        (req, res, ctx) => {
          return res(ctx.json(chartData));
        },
      ),
    );
    const { container } = renderWithClient(
      <SupportingDataPage initialDatasets={[]} />,
    );
    await waitFor(() =>
      expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent(
        "decreased body length",
      ),
    );
    expect(container).toMatchSnapshot();
  });
});
