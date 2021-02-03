import { AnyAction } from 'redux';
import { alertConstants } from '../constants';

export enum AlertType {
    success='alert-success',
    error='alert-danger',
}

export interface AlertState {
    type?: AlertType;
    message?: string;
}

export function alert(state: AlertState = {}, action: AnyAction): AlertState {
    switch (action.type) {
        case alertConstants.SUCCESS:
            return {
                type: AlertType.success,
                message: action.message
            };
        case alertConstants.ERROR:
            return {
                type: AlertType.error,
                message: action.message
            };
        case alertConstants.CLEAR:
            return {};
        default:
            return state
    }
}
