import { screen, render, waitFor, within } from "@testing-library/react";
import EmbryoVignettesPage from "@/app/embryo/vignettes/vignettes-page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
}));

jest.mock("react-slick", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="slick_mock">{children}</div>,
}));

describe("Embryo vignettes page", () => {
  it("renders correctly", async () => {
    const { container } = render(<EmbryoVignettesPage gene="" />);
    await waitFor(() => expect(container).toMatchSnapshot());
    const slickContainer = screen.getByTestId("slick_mock");
    expect(
      within(slickContainer).queryAllByRole("heading", { level: 1 }).length,
    ).toBe(20);
  });
});
