import { renderHook, waitFor } from '@testing-library/react';
import { server } from "../../mocks/server";
import { rest } from "msw";
import { API_URL, createQueryWrapper } from "../utils";
import phenotypeHitsData from "../../mocks/data/tests/myo6-phenotype-hits.json";
import { useSignificantPhenotypesQuery } from "@/hooks";

describe("useSignificantPhenotypesQuery hook", () => {
  it("gets and process data correctly", async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:104785/phenotype-hits`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(phenotypeHitsData));
      })
    );
    const { result } = renderHook(() => useSignificantPhenotypesQuery("MGI:104785", true), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.phenotypeData).toBeDefined();
    expect(result.current.phenotypeData.length).toBe(34);
  });
});