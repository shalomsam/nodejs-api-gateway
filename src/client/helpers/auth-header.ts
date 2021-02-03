export function authHeader() {
    // return authorization header with jwt token
    let accessToken = localStorage?.getItem('accessToken');

    if (accessToken) {
        return { 'Authorization': 'Bearer ' + accessToken };
    } else {
        return {};
    }
}