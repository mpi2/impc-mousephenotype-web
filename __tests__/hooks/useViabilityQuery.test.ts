import { renderHook, waitFor } from '@testing-library/react';
import { server } from "../../mocks/server";
import { rest } from "msw";
import { API_URL, createQueryWrapper } from "../utils";
import viabilityData from "../../mocks/data/tests/cib2-viability.json";
import { useViabilityQuery } from "@/hooks";

describe("useViabilityQuery hook", () => {
  it("gets and process data correctly", async () => {
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1929293/dataset/viability`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(viabilityData));
      })
    );
    const { result } = renderHook(() => useViabilityQuery("MGI:1929293", true), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.viabilityData).toBeDefined();
    expect(result.current.viabilityData.length).toBe(1);
  });
});