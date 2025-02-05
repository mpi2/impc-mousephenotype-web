import { screen } from "@testing-library/react";
import GeneHumanDiseases from "@/components/Gene/HumanDiseases";
import { renderWithClient, API_URL } from "../../utils";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";
import { GeneContext } from "@/contexts";
import OtogData from "../../../mocks/data/genes/MGI:1202064/disease.json";

describe("Gene human diseases component", () => {
  it("should display information", async () => {
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Otog", mgiGeneAccessionId: "MGI:1202064" }}
      >
        <GeneHumanDiseases />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("heading")).toHaveTextContent(
      "Human diseases caused by Otog mutations",
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
    server.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1202064/disease`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(OtogData));
        },
      ),
    );
    const user = userEvent.setup();
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Otog", mgiGeneAccessionId: "MGI:1202064" }}
      >
        <GeneHumanDiseases />
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
    await user.click(predictedDiseasesTab);
    expect(predictedDiseasesTab).toHaveClass("active");
  });

  it("should show an error message if the request fails", async () => {
    server.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1922546/disease`,
        (req, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );
    renderWithClient(
      <GeneContext.Provider
        value={{ geneSymbol: "Cep43", mgiGeneAccessionId: "MGI:1922546" }}
      >
        <GeneHumanDiseases />
      </GeneContext.Provider>,
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No data available for this section",
    );
  });
});
