
const API_URL = process.env.NEXT_PUBLIC_API_ROOT || "";
const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

export async function fetchAPI(query: string) {
  const endpointURL = MOCKING_ENABLED ? query : API_URL + query;
  const response = await fetch(endpointURL);
  if (!response.ok) {
    return Promise.reject(`An error has occured: ${response.status}`);
  }
  if (response.status === 204) {
    return Promise.reject("No content");
  }
  return await response.json();
}
