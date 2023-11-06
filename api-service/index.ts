
export const API_URL = process.env.NEXT_PUBLIC_API_ROOT || "";

export async function fetchAPI(query: string) {
  const endpointURL = API_URL + query;
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
