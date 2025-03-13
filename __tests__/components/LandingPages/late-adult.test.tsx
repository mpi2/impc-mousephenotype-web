import LateAdultLandingPage from "@/app/late-adult-data/late-adult-page";
import { renderWithClient } from "../../utils";

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
    const { container } = renderWithClient(<LateAdultLandingPage />);
    expect(container).toMatchSnapshot();
  });
});
