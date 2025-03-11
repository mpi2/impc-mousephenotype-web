import ImagesCompare from "@/app/genes/[pid]/images/[parameterStableId]/image-viewer-page";
import { API_URL, renderWithClient } from "../../utils";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import dbn1MutantImages from "../../../mocks/data/tests/dbn1-xray-mutant-images-data.json";
import dbn1ControlImages from "../../../mocks/data/tests/dbn1-xray-control-images-data.json";
import dbn1LaczMutantImages from "../../../mocks/data/tests/dbn1-lacz-mutant-images-data.json";
import dbn1LaczControlImages from "../../../mocks/data/tests/dbn1-lacz-control-images-data.json";
import { screen, waitFor } from "@testing-library/react";
import { useParams, useSearchParams } from "next/navigation";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => {
  const originalModule = jest.requireActual("next/navigation");
  const { useRouter } = jest.requireActual("next-router-mock");
  return {
    __esModule: true,
    ...originalModule,
    useRouter: jest.fn().mockImplementation(useRouter),
    usePathname: jest.fn(),
    useParams: jest.fn().mockImplementation(() => ({})),
    useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
  };
});

describe("Image comparator page", () => {
  it("renders correctly", async () => {
    const user = userEvent.setup();
    // @ts-ignore
    useParams.mockImplementation(() => ({
      pid: "MGI:1931838",
      parameterStableId: "IMPC_XRY_048_001",
    }));
    server.use(
      rest.get(
        `${API_URL}/api/v1/images/find_by_mgi_and_stable_id`,
        (req, res, ctx) => {
          const paramStableId = req.url.searchParams.get("parameterStableId");
          const mgiGeneAccessionId = req.url.searchParams.get("pid");
          if (
            paramStableId === "IMPC_XRY_048_001" &&
            mgiGeneAccessionId === "MGI:1931838"
          ) {
            return res(ctx.json(dbn1MutantImages));
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
            paramStableId === "IMPC_XRY_048_001" &&
            biologicalSampleGroup === "control"
          ) {
            return res(ctx.json(dbn1ControlImages));
          }
        },
      ),
    );
    // await mockRouter.push("/genes/MGI:1931838/images/IMPC_XRY_048_001");
    const { container } = renderWithClient(
      <ImagesCompare
        mutantImagesFromServer={[]}
        controlImagesFromServer={[]}
      />,
    );
    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "X-ray / XRay Images Whole Body Lateral Orientation",
      ),
    );
    await waitFor(async () => {
      const imgs = await screen.findAllByTestId("single-image");
      return expect(imgs.length).toEqual(61);
    });
    const headers = await screen.findAllByRole("heading", { level: 3 });
    expect(
      headers
        .map((h) => h.textContent)
        .join("|")
        .trim(),
    ).toBe("WT Images (50)|Mutant Images (11)");

    expect(container).toMatchSnapshot();
    await user.click(screen.getByTestId("heterozygote-filter"));
    await waitFor(async () => {
      const imgs = await screen.findAllByTestId("single-image");
      return expect(imgs.length).toEqual(61);
    });
    expect(await screen.findByTestId("selected-image-mutant")).toHaveAttribute(
      "src",
      "//www.ebi.ac.uk/mi/media/omero/webgateway/render_image/1069405/",
    );
    expect(
      screen.getByTestId("active-heterozygote-filter"),
    ).toBeInTheDocument();
    await user.click(screen.getByTestId("homozygote-filter"));
    await waitFor(async () => {
      const imgs = await screen.findAllByTestId("single-image");
      return expect(imgs.length).toEqual(50);
    });
    expect(screen.getByTestId("active-homozygote-filter")).toBeInTheDocument();
    await user.click(screen.getByTestId("hemizygote-filter"));
    await waitFor(async () => {
      const imgs = await screen.findAllByTestId("single-image");
      return expect(imgs.length).toEqual(50);
    });
    expect(screen.getByTestId("active-hemizygote-filter")).toBeInTheDocument();
    await user.click(screen.getByTestId("both-zygs-filter"));
    await waitFor(async () => {
      const imgs = await screen.findAllByTestId("single-image");
      return expect(imgs.length).toEqual(61);
    });
    expect(screen.getByTestId("active-both-zygs-filter")).toBeInTheDocument();
    const allThumbnails = await screen.findAllByTestId("single-image");
    await user.click(allThumbnails[1]);
    expect(await screen.findByTestId("selected-image-WT")).toHaveAttribute(
      "src",
      "//www.ebi.ac.uk/mi/media/omero/webgateway/render_image/1438446/",
    );
  });

  it("filters images by anatomy query term", async () => {
    const user = userEvent.setup();
    // @ts-ignore
    useParams.mockImplementation(() => ({
      pid: "MGI:1931838",
      parameterStableId: "IMPC_ALZ_075_001",
    }));
    // @ts-ignore
    useSearchParams.mockImplementation(
      () => new URLSearchParams({ anatomyTerm: "adrenal gland" }),
    );
    server.use(
      rest.get(
        `${API_URL}/api/v1/images/find_by_mgi_and_stable_id`,
        (req, res, ctx) => {
          const paramStableId = req.url.searchParams.get("parameterStableId");
          const mgiGeneAccessionId = req.url.searchParams.get("pid");
          if (
            paramStableId === "IMPC_ALZ_075_001" &&
            mgiGeneAccessionId === "MGI:1931838"
          ) {
            return res(ctx.json(dbn1LaczMutantImages));
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
            paramStableId === "IMPC_ALZ_075_001" &&
            biologicalSampleGroup === "control"
          ) {
            return res(ctx.json(dbn1LaczControlImages));
          }
        },
      ),
    );
    // await mockRouter.push("/genes/MGI:1931838/images/IMPC_XRY_048_001");
    renderWithClient(
      <ImagesCompare
        mutantImagesFromServer={[]}
        controlImagesFromServer={[]}
      />,
    );
    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Adult LacZ / LacZ Images Section",
      ),
    );
    await waitFor(async () => {
      const imgs = await screen.findAllByTestId("single-image");
      return expect(imgs.length).toEqual(5);
    });
    const headers = await screen.findAllByRole("heading", { level: 3 });
    expect(
      headers
        .map((h) => h.textContent)
        .join("|")
        .trim(),
    ).toBe("WT Images (3)|Mutant Images (2)");
    expect(
      await screen.findByTestId("active-anatomy-filter"),
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId("control-controlCenterFilter"),
    ).toHaveValue("JAX");
    expect(await screen.findByTestId("control-mutantCenterFilter")).toHaveValue(
      "CCP-IMG",
    );
    await user.click(screen.getByTestId("female-filter"));
    await waitFor(async () => {
      const imgs = await screen.findAllByTestId("single-image");
      return expect(imgs.length).toEqual(3);
    });
    expect(screen.getByTestId("active-female-filter")).toBeInTheDocument();
    await user.click(screen.getByTestId("male-filter"));
    await waitFor(async () => {
      const imgs = await screen.findAllByTestId("single-image");
      return expect(imgs.length).toEqual(2);
    });
    expect(screen.getByTestId("active-male-filter")).toBeInTheDocument();
    await user.click(screen.getByTestId("both-sexes-filter"));
    await waitFor(async () => {
      const imgs = await screen.findAllByTestId("single-image");
      return expect(imgs.length).toEqual(5);
    });
    expect(screen.getByTestId("active-both-sexes-filter")).toBeInTheDocument();
  });
});
