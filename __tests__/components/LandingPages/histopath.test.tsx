import { within, screen, waitFor } from "@testing-library/react";
import HistopathLandingPage from "@/app/histopath/histopath-page";
import { renderWithClient } from "../../utils";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
}));

describe("Histopathology landing page", () => {
  it("renders correctly", async () => {
    const user = userEvent.setup();
    const { container } = renderWithClient(<HistopathLandingPage />);
    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());
    expect(
      await screen.findByText("55", { selector: "span" }),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
    await user.type(screen.getByTitle("gene search box"), "Rpl12");
    await waitFor(async () => {
      const rows = await screen.findAllByRole("row");
      return expect(rows.length).toEqual(3);
    });
    await waitFor(async () => {
      const rows = await screen.findAllByRole("columnheader");
      return expect(rows.length).toEqual(106);
    });
    expect(await screen.findByTitle("fixed tissue link")).toHaveAttribute(
      "href",
      "/data/alleles/MGI:98002/em1(IMPC)Mbp#mice",
    );
    await user.clear(screen.getByTitle("gene search box"));
    await user.click(screen.getByTestId("bone-header"));
    let rows = await screen.findAllByTestId("result-rows");
    expect(within(rows[0]).getByTestId("gene-symbol")).toHaveTextContent(
      "Col9a3",
    );
    await user.click(screen.getByTestId("knee-joint-header"));
    rows = await screen.findAllByTestId("result-rows");
    expect(within(rows[0]).getByTestId("gene-symbol")).toHaveTextContent(
      "Chsy3",
    );
    await user.click(screen.getByTestId("gene-symbol-sort"));
    rows = await screen.findAllByTestId("result-rows");
    expect(within(rows[0]).getByTestId("gene-symbol")).toHaveTextContent(
      "Ache",
    );
  });
});
