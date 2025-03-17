import IDGPage from "@/app/secondaryproject/idg/idg-page";
import { testServer } from "../../mocks/server";
import idgData from "../../mocks/data/tests/landing-pages/idg.json";
import { rest } from "msw";
import { renderWithClient } from "../utils";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("next/navigation", () => {
  const routerMock = {
    back: jest.fn(),
    push: jest.fn(),
  };
  return {
    useRouter: jest.fn().mockImplementation(() => routerMock),
    useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
    usePathname: jest.fn(),
    useParams: jest.fn().mockImplementation(() => ({})),
  };
});

describe("IDG Page", () => {
  it("renders correctly", async () => {
    testServer.use(
      rest.get(
        "https://impc-datasets.s3.eu-west-2.amazonaws.com/landing-page-data/dr22.1/idg_landing.json",
        (_, res, ctx) => {
          return res(ctx.json(idgData));
        },
      ),
    );
    const { container } = renderWithClient(<IDGPage />);
    await waitFor(async () => {
      const tables = await screen.findAllByRole("table");
      return expect(tables.length).toEqual(5);
    });
    expect(container).toMatchSnapshot();
  });
});
