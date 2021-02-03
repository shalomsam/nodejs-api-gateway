import { AnyAction } from 'redux';
import { userConstants } from '../constants';

export interface RegistrationState {
    registering?: boolean
}

export function registration(state: RegistrationState = {}, action: AnyAction): RegistrationState {
    switch (action.type) {
        case userConstants.REGISTER_REQUEST:
            return { registering: true };
        case userConstants.REGISTER_SUCCESS:
            return {};
        case userConstants.REGISTER_FAILURE:
            return {};
        default:
            return state
    }
}