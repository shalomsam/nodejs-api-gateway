import { userConstants } from "../constants";
import {
  userService,
  SuccessResponse,
  ErrorResponse,
  AuthReqObject,
} from "../services";
import { alertActions } from "./";
import { history, isSSR } from "../helpers";
import { Dispatch } from "react";
import { User } from "../../models/User";

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete,
};

function login(email: string, password: string, from: any) {
    return (dispatch: Dispatch<any>) => {
        dispatch(request({ email, password }));

        userService.login(email, password).then(
            (res: SuccessResponse) => {
                dispatch(success(res));
                history.push(from);
                if (!isSSR) window.location.reload();
            },
            (error: ErrorResponse) => {
                dispatch(failure(error));
                dispatch(alertActions.error(error.message));
            }
        );
    };

    function request({ email, password }: AuthReqObject) {
        return {
            type: userConstants.LOGIN_REQUEST,
            email,
            password,
        };
    }

    function success({ user, accessToken }: SuccessResponse) {
        return {
            type: userConstants.LOGIN_SUCCESS,
            user,
            accessToken,
        };
    }

    function failure(error: ErrorResponse) {
        return {
            type: userConstants.LOGIN_FAILURE,
            error,
        };
    }
}

function logout() {
    userService.logout();
    return {
        type: userConstants.LOGOUT,
    };
}

function register(user: Partial<User>) {
    return (dispatch: Dispatch<any>) => {
        dispatch(request(user));

        userService.register(user).then(
            ({ user }: SuccessResponse) => {
                dispatch(success(user));
                history.push("/login");
                dispatch(alertActions.success("Registration successful"));
            },
            (error: ErrorResponse) => {
                dispatch(failure(error.message));
                dispatch(alertActions.error(error.toString()));
            }
        );
    };

    function request(user: Partial<User>) {
        return {
            type: userConstants.REGISTER_REQUEST,
            user,
        };
    }

    function success(user: Partial<User>) {
        return {
            type: userConstants.REGISTER_SUCCESS,
            user,
        };
    }

    function failure(error: any) {
        return { type: userConstants.REGISTER_FAILURE, error };
    }
}

function getAll() {
    return (dispatch: any) => {
        dispatch(request());

        userService.getAll().then(
            (users: SuccessResponse) => dispatch(success(users)),
            (error: any) => dispatch(failure(error.message))
        );
    };

    function request() {
        return { type: userConstants.GETALL_REQUEST };
    }

    function success(users?: any) {
        return { type: userConstants.GETALL_SUCCESS, users };
    }

    function failure(error?: any) {
        return { type: userConstants.GETALL_FAILURE, error };
    }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch(request(id));

        userService.delete(id).then(
        (user: any) => dispatch(success(id)),
        (error: any) => dispatch(failure(id, error.toString()))
        );
    };

    function request(id: string) {
        return { type: userConstants.DELETE_REQUEST, id };
    }

    function success(id: string) {
        return { type: userConstants.DELETE_SUCCESS, id };
    }

    function failure(id: string, error: Error | object) {
        return { type: userConstants.DELETE_FAILURE, id, error };
    }
}
