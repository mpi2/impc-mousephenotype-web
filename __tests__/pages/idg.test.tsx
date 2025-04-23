import IDGPage from "@/app/secondaryproject/idg/idg-page";
import { testServer } from "../../mocks/server";
import idgData from "../../mocks/data/tests/landing-pages/idg.json";
import { rest } from "msw";
import { renderWithClient, TEST_LANDING_PAGE_ENDPOINT } from "../utils";
import { screen, waitFor } from "@testing-library/react";

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

jest.mock("@/components/ChordDiagram", () => {
  const ChordDiagramMock = () => <div>ChordDiagram mock</div>;
  return ChordDiagramMock;
});

describe("IDG Page", () => {
  it("renders correctly", async () => {
    testServer.use(
      rest.get(
        `${TEST_LANDING_PAGE_ENDPOINT}/idg_landing.json`,
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
