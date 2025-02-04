import { render } from "@testing-library/react";
import ImagesCompare from "@/app/genes/[pid]/images/[parameterStableId]/image-viewer-page";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "../../utils";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  usePathname: jest.fn(),
  useParams: jest
    .fn()
    .mockImplementation(() => ({
      pid: "MGI:96853",
      parameterStableId: "TCPLA_XRY_051_001",
    })),
}));

describe("Image comparator page", () => {
  it("renders correctly", async () => {
    const client = createTestQueryClient();
    // await mockRouter.push("/genes/MGI:1931838/images/IMPC_XRY_048_001");
    const { container } = render(
      <QueryClientProvider client={client}>
        <ImagesCompare
          mutantImagesFromServer={[]}
          controlImagesFromServer={[]}
        />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
