
export const API_URL = process.env.NEXT_PUBLIC_API_ROOT || "";
export const PROXY_ENABLED = process.env.NEXT_PUBLIC_PROXY_ENABLED === 'TRUE' || false;

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
