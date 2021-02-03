import { AnyAction, Dispatch } from "redux";
import { clientConstants } from "../../client/constants/client.constants";
import { SuccessResponse } from "../../client/services";
import clientServices from "../../client/services/client.services";
import { Client } from "../../models/Client";
import { alertActions } from "./alert.actions";

interface ClientSuccessResponse extends Partial<SuccessResponse> {
    clients: Client[];
}

class ClientActions {
    public getAll() {
        return async (dispach: Dispatch<AnyAction>) => {
            dispach({
                type: clientConstants.GETALL_REQUEST,
            });

            try {
                const { clients }: ClientSuccessResponse = await clientServices.getAll();
                dispach({
                    type: clientConstants.GETALL_SUCCESS,
                    clients
                });
            } catch (error: any) {
                dispach({
                    type: clientConstants.GETALL_FAILURE,
                    error
                });
                // dispach(alertActions.error(error.message))
            }
        }
    }
}

const clientActions = new ClientActions();
export default clientActions;
