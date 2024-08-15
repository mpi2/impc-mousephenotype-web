import { rest } from "msw";
import searchResults from "./data/search.json";

const API_URL = process.env.NEXT_PUBLIC_API_ROOT || "";

export const handlers = [
  rest.post(`${API_URL}/api/v1/login`, (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem("is-authenticated", "true");
    return res(
      // Respond with a 200 status code
      ctx.status(200)
    );
  }),
  rest.get(`${API_URL}/api/v1/genes/all/summary-averages`, (req, res ,ctx) => {
    return res(ctx.status(200), ctx.json({
      significantPhenotypesAverage: 8.280087527352297,
      associatedDiseasesAverage: 2.867132867132867,
      adultExpressionObservationsAverage :57.04410751206065,
      embryoExpressionObservationsAverage: 42.84877384196185
    }));
  }),
  rest.get(`${API_URL}/api/v1/user`, (req, res, ctx) => {
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
  rest.get(`${API_URL}/api/search/v1/search`, (req, res, ctx) => {
    const prefix = req.url.searchParams.get("prefix");
    const type = req.url.searchParams.get("type");
    const { query } = req.params;
    try {
      let results;
      if (!type || type === "GENE") {
        results = require("./data/search_new.json");
      } else {
        results = require("./data/search_phenotypes.json");
      }
      return res(ctx.status(200), ctx.json(results));
    } catch (e) {
      console.error(e);
      return res(ctx.status(404));
    }
  }),
  rest.get(`${API_URL}/api/v1/genes/:geneId/:section`, (req, res, ctx) => {
    const { geneId, section } = req.params;
    try {
      const geneSectionData = require(`./data/genes/${geneId}/${section}.json`);
      const sectionKeyMap = {
        statisticalResults: "statisticalResults",
        phenotypes: "significantPhenotypes",
        // diseases: "gene_diseases",
      };
      const sectionData = sectionKeyMap.hasOwnProperty(section)
        ? geneSectionData[sectionKeyMap[section]]
        : geneSectionData;
      return res(ctx.status(200), ctx.json(sectionData));
    } catch (e) {
      return res(ctx.status(404));
    }
  }),
  rest.get(
      `${API_URL}/api/v1/supporting-data-unidimensional/:geneId/`,
    (req, res, ctx) => {
      const { geneId } = req.params;
      const genes = require.context(`./data/genes/`, true, /\.json$/);
      try {
        const geneSectionData = genes(
          `./${geneId}/supporting-data-unidimensional.json`
        );
        const sectionData = geneSectionData["dataStatsResults"][0];

        return res(ctx.status(200), ctx.json(sectionData));
      } catch (e) {
        return res(ctx.status(404));
      }
    }
  ),
  rest.get(`${API_URL}/api/v1/supporting-data-categorical/:geneId/`, (req, res, ctx) => {
    const { geneId } = req.params;
    const genes = require.context(`./data/genes/`, true, /\.json$/);
    try {
      const geneSectionData = genes(
          `./${geneId}/supporting-data-categorical.json`
      );
      const sectionData = geneSectionData["dataStatsResults"][0];

      return res(ctx.status(200), ctx.json(sectionData));
    } catch (e) {
      return res(ctx.status(404));
    }
  }),
  rest.get(`${API_URL}/api/v1/alleles/:geneId/:alleleName`, (req, res, ctx) => {
    const { geneId, alleleName } = req.params;
    try {
      const geneSectionData = require(`./data/genes/${geneId}/alleles/${alleleName}.json`);
      return res(ctx.status(200), ctx.json(geneSectionData));
    } catch (e) {
      return res(ctx.status(404));
    }
  }),
  rest.get(`${API_URL}/api/v1/phenotypes/:phenotypeId/:section`, (req, res, ctx) => {
    const { phenotypeId, section } = req.params;
    const phenotypes = require.context(`./data/phenotypes/`, true, /\.json$/);
    try {
      const sectionKeyMap = {
        "genotype-hits": "genotype-hits",
        procedures: "procedures",
        stats: "stats",
        summary: "summary",
        gwas: "gwas"
      };
      const phenotypeSectionData = phenotypes(
        `./${phenotypeId}/${sectionKeyMap[section]}.json`
      );

      return res(ctx.status(200), ctx.json(phenotypeSectionData));
    } catch (e) {
      return res(ctx.status(404), e);
    }
  }),
  rest.get(`${API_URL}/api/v1/landing-pages-data/embryo`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(require('./data/landing-pages/embryo.json')));
  }),
  rest.get(`${API_URL}/api/v1/publications`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(require('./data/publications')));
  }),
  rest.get(`${API_URL}/api/imaging/v1/thumbnails`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(require('./data/imaging/thumbnails.json')));
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
