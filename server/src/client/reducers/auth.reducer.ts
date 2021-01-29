import { isSSR } from '../../utils/helpers';
import { userConstants } from '../constants';

let user = isSSR ? {} : JSON.parse(localStorage.getItem('user') as any);
const initialState = user ? { loggedIn: true, user } : {};

export function authentication(state = initialState, action: any) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: action.user
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.user
            };
        case userConstants.LOGIN_FAILURE:
            return {};
        case userConstants.LOGOUT:
            return {};
        default:
            return state
    }
}