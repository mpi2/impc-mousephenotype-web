
export const API_URL = process.env.NEXT_PUBLIC_API_ROOT || "";
export const PROXY_ENABLED = process.env.NEXT_PUBLIC_PROXY_ENABLED === 'TRUE' || false;
export const DR_DATASET_VERSION = process.env.NEXT_PUBLIC_DR_DATASET_VERSION || 'latest';

export async function fetchAPI(query: string) {
  const domain = PROXY_ENABLED ? 'http://localhost:8010/proxy' : API_URL;
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
    return Promise.reject('Error: ' + error);
  }
}

export async function fetchDatasetFromS3(datasetId: string) {
  const response = await fetch(
    `https://impc-datasets.s3.eu-west-2.amazonaws.com/${DR_DATASET_VERSION}/${datasetId}.json`
  );
  if (!response.ok) {
    return Promise.reject(`An error has occured: ${response.status}`);
  }
  return await response.json();
}

export async function fetchMHPlotDataFromS3(mpId: string) {
  const response = await fetch(
    `https://impc-datasets.s3.eu-west-2.amazonaws.com/phenotype-stats-results/${DR_DATASET_VERSION}/${mpId}.json`
  );
  if (!response.ok) {
    return Promise.reject(`An error has occured: ${response.status}`);
  }
  return await response.json();
}