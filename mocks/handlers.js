import { rest } from "msw";
import searchResults from "./data/search.json";

export const handlers = [
  rest.post("/api/login", (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem("is-authenticated", "true");
    return res(
      // Respond with a 200 status code
      ctx.status(200)
    );
  }),
  rest.get("/api/user", (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const isAuthenticated = sessionStorage.getItem("is-authenticated");
    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: "Not authorized",
        })
      );
    }
    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        username: "admin",
      })
    );
  }),
  rest.get("/api/genes/search", (req, res, ctx) => {
    try {
      // const results = require("./data/search.json");
      const results = searchResults;
      return res(ctx.status(200), ctx.json(results));
    } catch (e) {
      return res(ctx.status(404));
    }
  }),
  rest.get("/api/genes/search/:query?", (req, res, ctx) => {
    const { query } = req.params;
    try {
      const results = require("./data/search.json");
      if (!query) {
        return res(ctx.status(200), ctx.json(results));
      }
      const filteredResults = results.filter(
        (r) =>
          `${r.marker_name} ${r.marker_symbol} ${(r.marker_synonym ?? []).join(
            " "
          )}`.indexOf(query) >= 0
      );
      return res(ctx.status(200), ctx.json(filteredResults));
    } catch (e) {
      return res(ctx.status(404));
    }
  }),
  rest.get("/api/genes/:geneId/:section", (req, res, ctx) => {
    const { geneId, section } = req.params;
    const genes = require.context(`./data/genes/`, true, /\.json$/);
    try {
      const geneSectionData = genes(`./${geneId}/${section}.json`);
      const sectionKeyMap = {
        expression: "expressionData",
        statisticalResults: "statisticalResults",
        phenotypes: "significantPhenotypes",
        publications: "publications",
        images: "gene_images",
        diseases: "gene_diseases",
        histopathology: "gene_histopathology",
      };
      const sectionData = sectionKeyMap.hasOwnProperty(section)
        ? geneSectionData[sectionKeyMap[section]]
        : geneSectionData;

      return res(ctx.status(200), ctx.json(sectionData));
    } catch (e) {
      return res(ctx.status(404));
    }
  }),
  rest.get("/api/supporting-data-unidimensional/:geneId/", (req, res, ctx) => {
    const { geneId } = req.params;
    const genes = require.context(`./data/genes/`, true, /\.json$/);
    try {
      const geneSectionData = genes(`./${geneId}/supporting-data-unidimensional.json`);
      const sectionData = geneSectionData['dataStatsResults'][0];
      
      return res(ctx.status(200), ctx.json(sectionData));
    } catch (e) {
      return res(ctx.status(404));
    }
  }),
  rest.get("/api/supporting-data-categorical/:geneId/", (req, res, ctx) => {
    const { geneId } = req.params;
    const genes = require.context(`./data/genes/`, true, /\.json$/);
    try {
      const geneSectionData = genes(`./${geneId}/supporting-data-categorical.json`);
      const sectionData = geneSectionData['dataStatsResults'][0];
      
      return res(ctx.status(200), ctx.json(sectionData));
    } catch (e) {
      return res(ctx.status(404));
    }
  }),
  rest.get("/api/products/:geneId/:alleleName", (req, res, ctx) => {
    const { geneId, alleleName } = req.params;
    const genes = require.context(`./data/genes/`, true, /\.json$/);
    try {
      const geneSectionData = genes(`./${geneId}/alleles/${alleleName}.json`);
      return res(ctx.status(200), ctx.json(geneSectionData));
    } catch (e) {
      return res(ctx.status(404));
    }
  }),
  // rest.post(
  //   "https://monarchinitiative.org/simsearch/phenotype",
  //   (req, res, ctx) => {
  //     const test = require(`./data/simsearch/test.json`);
  //     return res(
  //       // Respond with a 200 status code
  //       ctx.status(200),
  //       ctx.json(test)
  //     );
  //   }
  // ),
];
