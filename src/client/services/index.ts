import { User } from '../../models/User';
import { authHeader } from '../helpers';
import { userConstants } from '../constants'

const { ACCESS_TOKEN } = userConstants;

export interface ErrorResponse {
    message: string;
    status: "error";
    statusCode: 400 | 401;
}
export interface SuccessResponse {
    message: string;
    status: "success";
    statusCode: 200;
    accessToken: string;
    user: User;
    users?: User[];
}

export interface AuthReqObject {
    email: string;
    password: string;
}


export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};

export const apiBase = '/api/v1';

function login(email: string, password: string) {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    return fetch(`${apiBase}/user/authenticate`, requestOptions)
        .then(handleResponse)
        .then(({ user, accessToken }: SuccessResponse) => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            return { user, accessToken };
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${apiBase}/users`, requestOptions).then(handleResponse);
}

function getById(id: any) {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiBase}/users/${id}`, requestOptions).then(handleResponse);
}

function register(user: any) {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${apiBase}/user`, requestOptions).then(handleResponse);
}

function update(user: any) {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${apiBase}/user/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id: any) {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${apiBase}/user/${id}`, requestOptions).then(handleResponse);
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
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
}