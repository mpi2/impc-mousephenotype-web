import ImageDownloaderPage from "@/app/genes/[pid]/download-images/[parameterStableId]/image-downloader-page";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient } from "../utils";
import { server } from "../../mocks/server";
import { rest } from "msw";
import cib2MutantImages from "../../mocks/data/tests/cib2-abr-mutant-images-data.json";
import cib2ControlImages from "../../mocks/data/tests/cib2-abr-control-images-data.json";

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
      pid: "MGI:1929293",
      parameterStableId: "IMPC_ABR_014_001",
    })),
  };
});

describe("Image Downloader Page", () => {
  it("renders without crashing", () => {
    server.use(
      rest.get(
        `${API_URL}/api/v1/images/find_by_mgi_and_stable_id?mgiGeneAccessionId=MGI:1929293&parameterStableId=IMPC_ABR_014_001`,
        (req, res, ctx) => {
          const paramStableId = req.url.searchParams.get("parameterStableId");
          const biologicalSampleGroup = req.url.searchParams.get(
            "biologicalSampleGroup",
          );
          if (paramStableId === "IMPC_ABR_014_001") {
            return res(
              ctx.json(
                biologicalSampleGroup === "control"
                  ? cib2ControlImages
                  : cib2MutantImages,
              ),
            );
          }
        },
      ),
    );
    const { container } = renderWithClient(
      <ImageDownloaderPage
        controlImagesFromServer={[]}
        mutantImagesFromServer={[]}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
