import { ACCESS_TOKEN, API_KEY } from '../constants';

const apiKey = process.env.NX_REACT_APP_ADMIN_CLIENT_API_KEY;

export function getHeaders() {
  // return authorization header with jwt token
  const accessToken = getAuthToken();
  const token = accessToken ? {
    Authorization: 'Bearer ' + accessToken,
  } : {};

  return {
    [API_KEY]: apiKey,
    'Content-Type': 'application/json',
    ...token,
  };
}

export const getAuthToken = () =>
  localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);

export const isAuthenticated = () => !!getAuthToken();
