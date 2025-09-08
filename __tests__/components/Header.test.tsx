import Header from "@/components/Header";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import headerData from "../../mocks/data/tests/header.json";
import { renderWithClient } from "../utils";
import { screen, waitFor } from "@testing-library/react";

describe("Header component", () => {
  it("renders correctly", async () => {
    testServer.use(
      rest.get(`https://www.mousephenotype.org/jsonmenu/`, (req, res, ctx) => {
        return res(ctx.json(headerData));
      }),
    );
    const { container } = renderWithClient(<Header />);
    await waitFor(async () => {
      const menuItems = await screen.findAllByRole("listitem");
      return expect(menuItems.length).toEqual(11);
    });
    expect(container).toMatchSnapshot();
  });
});
