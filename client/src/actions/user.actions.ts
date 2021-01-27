import { userConstants } from '../constants';
import { userService } from '../services';
import { alertActions } from './';
import { history } from '../helpers';
import { Dispatch } from 'react';

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete
};

function login(username: string, password: string, from: any) {
    return (dispatch: Dispatch<any>) => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                (user: any) => { 
                    dispatch(success(user));
                    history.push(from);
                },
                (error: any) => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user: any) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user: any) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error: any) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user: any) {
    return (dispatch: Dispatch<any>) => {
        dispatch(request(user));

        userService.register(user)
            .then(
                (user: any) => { 
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                (error: any) => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user?: any) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user?: any) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error?: any) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll() {
    return (dispatch: any) => {
        dispatch(request());

        userService.getAll()
            .then(
                (users: any) => dispatch(success(users)),
                (error: any) => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users?: any) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error?: any) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                (user: any) => dispatch(success(id)),
                (error: any) => dispatch(failure(id, error.toString()))
            );
    };

    function request(id: string) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id: string) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id: string, error: Error | object) { return { type: userConstants.DELETE_FAILURE, id, error } }
}