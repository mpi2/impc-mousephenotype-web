import { render } from "@testing-library/react";
import HistopathLandingPage from "@/app/histopath/histopath-page";
import { createTestQueryClient } from "../../utils";
import { QueryClientProvider } from "@tanstack/react-query";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
}));

describe("Histopathology landing page", () => {
  it("renders correctly", () => {
    const client = createTestQueryClient();
    const { container } = render(
      <QueryClientProvider client={client}>
        <HistopathLandingPage />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
