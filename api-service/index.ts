export const API_URL = process.env.NEXT_PUBLIC_API_ROOT || "";
export const PROXY_ENABLED =
  process.env.NEXT_PUBLIC_PROXY_ENABLED === "TRUE" || false;
export const STATS_DATASETS_URL =
  process.env.NEXT_PUBLIC_STATS_DATASETS_URL || "";
export const MH_PLOT_DATA_URL = process.env.NEXT_PUBLIC_MH_PLOT_DATA_URL || "";

export async function fetchAPI(query: string) {
  const domain = PROXY_ENABLED ? "http://localhost:8010/proxy" : API_URL;
  const endpointURL = domain + query;
  try {
    const response = await fetch(endpointURL);
    if (response.status === 204 || response.status === 404) {
      return Promise.reject("No content");
    }
    if (!response.ok) {
      return Promise.reject(`An error has occured: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return Promise.reject("Error: " + error);
  }
}

export async function fetchDatasetFromS3(datasetId: string) {
  const response = await fetch(`${STATS_DATASETS_URL}/${datasetId}.json`);
  if (!response.ok) {
    return Promise.reject(`An error has occured: ${response.status}`);
  }
  return await response.json();
}

export async function fetchMHPlotDataFromS3(mpId: string) {
  const response = await fetch(`${MH_PLOT_DATA_URL}/${mpId}.json`);
  if (!response.ok) {
    return Promise.reject(`An error has occured: ${response.status}`);
  }
  return await response.json();
}

export async function fetchLandingPageData(landingPageId: string) {
  const response = await fetch(
    `https://impc-datasets.s3.eu-west-2.amazonaws.com/landing-page-data/${DR_DATASET_VERSION}/${landingPageId}_landing.json`
  );
  if (!response.ok) {
    return Promise.reject(`An error has occured: ${response.status}`);
  }
  return await response.json();
}
