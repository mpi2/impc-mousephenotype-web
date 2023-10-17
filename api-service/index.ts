import axios from 'axios';
export const API_URL = process.env.NEXT_PUBLIC_API_ROOT || "";
const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

export async function fetchAPI(query: string) {
  const endpointURL = MOCKING_ENABLED ? query : API_URL + query;
  try {
    const response = await axios.get(endpointURL);
    return response.data;
  } catch (error) {
    console.log('IN CATCH', error);
    return Promise.reject(error);
  }
}
