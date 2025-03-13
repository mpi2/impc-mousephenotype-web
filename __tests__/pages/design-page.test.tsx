import DesignPage from "@/app/designs/[id]/designs-page";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient } from "../utils";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import designData from "../../mocks/data/tests/designs-page-payload.json";
import { useRouter } from "next/navigation";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => {
  const routerMock = {
    back: jest.fn(),
    push: jest.fn(),
  };
  return {
    useRouter: jest.fn().mockImplementation(() => routerMock),
    useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
    usePathname: jest.fn(),
    useParams: jest.fn().mockImplementation(() => ({
      id: "40489",
    })),
  };
});

describe("Design page", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("renders data correctly", async () => {
    const router = useRouter();
    const spy = jest.spyOn(router, "back");
    const user = userEvent.setup();
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/alleles/htgt/designId:40489`,
        (req, res, ctx) => {
          return res(ctx.json(designData));
        },
      ),
    );
    const { container } = renderWithClient(<DesignPage />);
    const backButton = screen.getByRole("button", {
      name: "Go Back to Allele page",
    });
    await user.click(backButton);
    expect(container).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
  });
  it("displays a loading state", async () => {
    const router = useRouter();
    const spy = jest.spyOn(router, "back");
    const user = userEvent.setup();
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/alleles/htgt/designId:40489`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]), ctx.delay("infinite"));
        },
      ),
    );
    renderWithClient(<DesignPage />);
    await user.click(
      screen.getByRole("button", {
        name: "Go Back to Allele page",
      }),
    );
    expect(screen.getByTestId("loading-text")).toBeInTheDocument();
    expect(spy).toHaveBeenCalled();
  });
});
