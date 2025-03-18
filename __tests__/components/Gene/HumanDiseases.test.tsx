import { act, screen } from "@testing-library/react";
import GeneHumanDiseases from "@/components/Gene/HumanDiseases";
import { renderWithClient, API_URL } from "../../utils";
import { testServer } from "../../../mocks/server";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";
import { GeneContext } from "@/contexts";
import initialDataAkt2 from "../../../mocks/data/genes/MGI:104874/disease_associationCurated_true.json";
import humanDiseaseslDataAkt2 from "../../../mocks/data/genes/MGI:104874/disease_associationCurated_false.json";

describe("Gene human diseases component", () => {
  it("should display information", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:104874/disease/json`,
        (req, res, ctx) => {
          const url = new URL(req.url);
          const associationCurated =
            url.searchParams.get("associationCurated") === "true";
          return res(
            ctx.json(
              associationCurated ? initialDataAkt2 : humanDiseaseslDataAkt2,
            ),
          );
        },
      ),
    );
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Akt2", mgiGeneAccessionId: "MGI:104874" }}
      >
        <GeneHumanDiseases initialData={initialDataAkt2} />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("heading")).toHaveTextContent(
      "Human diseases caused by Akt2 mutations",
    );
    const assocDiseasesTab = await screen.findByRole("tab", {
      name: /Human diseases associated/,
    });
    const predictedDiseasesTab = await screen.findByRole("tab", {
      name: /Human diseases predicted/,
    });
    expect(assocDiseasesTab).toBeInTheDocument();
    expect(predictedDiseasesTab).toBeInTheDocument();
  });

  it("should be able to view content from the 2 tabs", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:104874/disease/json`,
        (req, res, ctx) => {
          const url = new URL(req.url);
          const associationCurated =
            url.searchParams.get("associationCurated") === "true";
          return res(
            ctx.json(
              associationCurated ? initialDataAkt2 : humanDiseaseslDataAkt2,
            ),
          );
        },
      ),
    );
    const user = userEvent.setup();
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Akt2", mgiGeneAccessionId: "MGI:104874" }}
      >
        <GeneHumanDiseases initialData={initialDataAkt2} />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("table")).toBeInTheDocument();
    const assocDiseasesTab = screen.getByRole("tab", {
      name: /Human diseases associated/,
    });
    const predictedDiseasesTab = screen.getByRole("tab", {
      name: /Human diseases predicted/,
    });
    expect(assocDiseasesTab).toHaveClass("active");
    await act(async () => await user.click(predictedDiseasesTab));

    expect(predictedDiseasesTab).toHaveClass("active");
  });

  it("should show an error message if the request fails", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:104874/disease/json`,
        (req, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Akt2", mgiGeneAccessionId: "MGI:104874" }}
      >
        <GeneHumanDiseases initialData={[]} />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No data available for this section",
    );
  });
});
