import { AnyAction } from "redux";
import { clientConstants } from "../../client/constants/client.constants";
import { Client } from "../../models/Client";

export interface ClientState {
    isLoading: boolean;
    list?: Client[];
    error?: any;
}

export interface IClientActions extends AnyAction, ClientState {};

export const initialState: ClientState = { isLoading: false, list: [] };

export const clients = (state: ClientState = initialState, action: IClientActions) => {
    switch (action.type) {
        case clientConstants.GETALL_REQUEST:
            return {
                isLoading: true,
            };

        case clientConstants.GETALL_SUCCESS:
            return {
                isLoading: false,
                list: action.list,
            };

        case clientConstants.GETALL_FAILURE:
            return {
                isLoading: false,
                error: action.error,
            }

        default:
            return state;
    }
}