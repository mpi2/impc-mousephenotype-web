import ImageDownloaderPage from "@/app/genes/[pid]/download-images/[parameterStableId]/image-downloader-page";
import { screen, waitFor } from "@testing-library/react";
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
  it("renders without crashing", async () => {
    server.use(
      rest.get(
        `${API_URL}/api/v1/images/find_by_mgi_and_stable_id`,
        (req, res, ctx) => {
          const paramStableId = req.url.searchParams.get("parameterStableId");
          const mgiGeneAccessionId = req.url.searchParams.get("pid");
          if (
            paramStableId === "IMPC_ABR_014_001" &&
            mgiGeneAccessionId === "MGI:1929293"
          ) {
            return res(ctx.json(cib2MutantImages));
          }
        },
      ),
    );
    server.use(
      rest.get(
        `${API_URL}/api/v1/images/find_by_stable_id_and_sample_id`,
        (req, res, ctx) => {
          const paramStableId = req.url.searchParams.get("parameterStableId");
          const biologicalSampleGroup = req.url.searchParams.get(
            "biologicalSampleGroup",
          );
          if (
            paramStableId === "IMPC_ABR_014_001" &&
            biologicalSampleGroup === "control"
          ) {
            return res(ctx.json(cib2ControlImages));
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
    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Auditory Brain Stem Response / Click-evoked + 6 to 30kHz tone waveforms (pdf format)",
      ),
    );
    await waitFor(async () => {
      const rows = await screen.findAllByRole("table");
      return expect(rows.length).toEqual(2);
    });
    await waitFor(async () => {
      const rows = await screen.findAllByRole("row");
      return expect(rows.length).toEqual(17);
    });
    expect(container).toMatchSnapshot();
  });
});
