import { User } from '../../models/User';
import { AnyAction } from 'redux';
import { isSSR } from '../../client/helpers';
import { userConstants } from '../constants';
import { AuthReqObject } from '../../client/services';

const { ACCESS_TOKEN } = userConstants;

export enum AuthStatus {
    loggedIn = 'loggedIn',
    loggingIn = 'loggingIn',
    loggedOut = 'loggedOut'
}
export interface AuthState {
    status?: AuthStatus;
    user?: Partial<User>;
    token?: string;
}

interface AuthActions extends AnyAction, Partial<AuthState>, Partial<AuthReqObject> {}

let accessToken = isSSR ? "" : localStorage.getItem(ACCESS_TOKEN);
let user = isSSR ? "" : JSON.parse(localStorage.getItem('user'));

export const initialAuthState = user ? { status: AuthStatus.loggedIn, accessToken, user } : { status: AuthStatus.loggedOut };

export function authentication(state: AuthState = initialAuthState, action: AuthActions): AuthState {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                status: AuthStatus.loggingIn,
                user: {
                    email: action.email,
                    password: action.password
                }
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                status: AuthStatus.loggedIn,
                user: action.user,
                [ACCESS_TOKEN]: action[ACCESS_TOKEN]
            };
        case userConstants.LOGIN_FAILURE:
            return {
                status: AuthStatus.loggedOut
            };
        case userConstants.LOGOUT:
            return {
                status: AuthStatus.loggedOut
            };
        default:
            return state
    }
}