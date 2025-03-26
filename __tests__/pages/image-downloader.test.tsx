import ImageDownloaderPage from "@/app/genes/[pid]/download-images/[parameterStableId]/image-downloader-page";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { API_URL, renderWithClient } from "../utils";
import { testServer } from "../../mocks/server";
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
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/images/find_by_mgi_and_stable_id`,
        (req, res, ctx) => {
          return res(ctx.json(cib2MutantImages));
        },
      ),
      rest.get(
        `${API_URL}/api/v1/images/find_by_stable_id_and_sample_id`,
        (req, res, ctx) => {
          return res(ctx.json(cib2ControlImages));
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
