import { ApiError, User, UserSuccess } from '@node-api-gateway/api-interfaces';
import { ACCESS_TOKEN, apiBase } from '../constants';
import { getHeaders } from '../helpers';

export interface AuthReqObject {
  email: string;
  password: string;
}

export const userService = {
  login,
  logout,
  register,
  getAll,
  getUser,
  getById,
  update,
  delete: _delete,
};

async function login(
  email: string,
  password: string
): Promise<UserSuccess | ApiError> {
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  };

  const response = await fetch(`${apiBase}/user/authenticate`, requestOptions);
  return handleResponse(response);
}

// Logout
function logout() {
  localStorage.removeItem(ACCESS_TOKEN);
  sessionStorage.removeItem(ACCESS_TOKEN);
}

// Get Current User & Check token
async function getUser() {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: getHeaders(),
  };
  const response = await fetch(`${apiBase}/user`, requestOptions);
  return handleResponse(response);
}

// Get All users
async function getAll(): Promise<UserSuccess | ApiError> {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: getHeaders(),
  };

  const response = await fetch(`${apiBase}/users`, requestOptions);
  return handleResponse(response);
}

// Get User by Id
async function getById(id: string): Promise<UserSuccess | ApiError> {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: getHeaders(),
  };

  const response = await fetch(`${apiBase}/users/${id}`, requestOptions);
  return handleResponse(response);
}

// Register User
async function register(user: Partial<User>): Promise<UserSuccess | ApiError> {
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(user),
  };

  const response = await fetch(`${apiBase}/user`, requestOptions);
  return handleResponse(response);
}

// Update User
async function update(user: Partial<User>): Promise<ApiError | UserSuccess> {
  const requestOptions: RequestInit = {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(user),
  };

  const response = await fetch(`${apiBase}/user/${user._id}`, requestOptions);
  return handleResponse(response);
}

// prefixed function name with underscore because delete is a reserved word in javascript
async function _delete(id: string): Promise<UserSuccess | ApiError> {
  const requestOptions: RequestInit = {
    method: 'DELETE',
    headers: getHeaders(),
  };

  const response = await fetch(`${apiBase}/user/${id}`, requestOptions);
  return handleResponse(response);
}

async function handleResponse(response: Response) {
  const text = await response.text();
  const data = text && JSON.parse(text);
  if (!response.ok) {
    // if (response.status === 401) {
    //     // auto logout if 401 response returned from api
    //     logout();
    //     // eslint-disable-next-line no-restricted-globals
    //     location.reload(true);
    // }
    // const error = (data && data.message) || response.statusText;
    return Promise.reject(data);
  }
  return data;
}
