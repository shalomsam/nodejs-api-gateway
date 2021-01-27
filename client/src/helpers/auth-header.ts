export function authHeader(_user?: any) {
    // return authorization header with jwt token
    let user = _user || JSON.parse(localStorage.getItem('user') as any);

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}