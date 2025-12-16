import { renderHook, waitFor } from "@testing-library/react";
import { testServer } from "../../mocks/server";
import { rest } from "msw";
import { API_URL, createQueryWrapper, SOLR_ENDPOINT } from "../utils";
import viabilityData from "../../mocks/data/tests/cib2-viability.json";
import solrData from "../../mocks/data/tests/viability/myo6-experiment-solr-VIA-063.json";
import { useViabilityQuery } from "@/hooks";

describe("useViabilityQuery hook", () => {
  it("gets and process data correctly", async () => {
    testServer.use(
      rest.get(
        `${API_URL}/api/v1/genes/MGI:1929293/dataset/viability`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(viabilityData));
        },
      ),
      rest.get(`${SOLR_ENDPOINT}experiment/select`, (req, res, ctx) => {
        return res(ctx.json(solrData));
      }),
    );
    const { result } = renderHook(
      () => useViabilityQuery("MGI:1929293", true),
      {
        wrapper: createQueryWrapper(),
      },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.viabilityData).toBeDefined();
    expect(result.current.viabilityData.length).toBe(1);
  });
});
